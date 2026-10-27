[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$BaseUrl
)

$ErrorActionPreference = 'Stop'
$taskUri = $null
if (-not [Uri]::TryCreate($BaseUrl, [UriKind]::Absolute, [ref]$taskUri)) {
    throw 'BaseUrl must be an absolute website URL.'
}
if ($taskUri.Scheme -ne 'https' -and -not ($taskUri.Scheme -eq 'http' -and $taskUri.IsLoopback)) {
    throw 'Use the HTTPS URL of the deployed website.'
}
if ($taskUri.UserInfo -or $taskUri.Query -or $taskUri.Fragment) {
    throw 'BaseUrl must not contain credentials, a query string, or a fragment. Include only the site URL and optional basePath.'
}
$taskEndpoint = $taskUri.AbsoluteUri.TrimEnd('/') + '/api/internal/db-setup'

Add-Type -AssemblyName System.Net.Http
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
$taskHandler = New-Object System.Net.Http.HttpClientHandler
$taskHandler.AllowAutoRedirect = $false
$taskClient = New-Object System.Net.Http.HttpClient($taskHandler)
$taskClient.Timeout = [TimeSpan]::FromSeconds(120)
$taskSecureToken = Read-Host 'Enter DB_SETUP_TOKEN configured on Vibe (input is hidden)' -AsSecureString
$taskTokenPointer = [IntPtr]::Zero
$taskToken = $null

function Invoke-CatalogSetup {
    param([string]$Method, [string]$Url)
    $taskRequest = New-Object System.Net.Http.HttpRequestMessage
    $taskRequest.Method = New-Object System.Net.Http.HttpMethod($Method)
    $taskRequest.RequestUri = [Uri]$Url
    $taskRequest.Headers.Authorization = New-Object System.Net.Http.Headers.AuthenticationHeaderValue('Bearer', $taskToken)
    $taskResponse = $null
    try {
        $taskResponse = $taskClient.SendAsync($taskRequest).GetAwaiter().GetResult()
        $taskBody = $taskResponse.Content.ReadAsStringAsync().GetAwaiter().GetResult()
        $taskResult = $null
        try { $taskResult = $taskBody | ConvertFrom-Json } catch { }
        if (-not $taskResponse.IsSuccessStatusCode) {
            $taskStatus = [int]$taskResponse.StatusCode
            if ($taskStatus -ge 300 -and $taskStatus -lt 400) {
                throw 'The site redirected this request. Use its final HTTPS domain/basePath and run again.'
            }
            if ($taskStatus -eq 404) { throw 'Setup endpoint is unavailable. Deploy the updated code with DB_SETUP_TOKEN configured.' }
            if ($taskStatus -eq 401) { throw 'DB_SETUP_TOKEN does not match the deployed website.' }
            if ($taskResult.error) { throw ('HTTP {0}: {1} - {2}' -f $taskStatus, $taskResult.error, $taskResult.message) }
            throw ('HTTP {0}: The website did not return a successful setup response.' -f $taskStatus)
        }
        if (-not $taskResult -or -not $taskResult.ok) { throw 'The website returned an unexpected response.' }
        return $taskResult
    } finally {
        if ($taskResponse) { $taskResponse.Dispose() }
        $taskRequest.Dispose()
    }
}

try {
    $taskTokenPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($taskSecureToken)
    $taskToken = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($taskTokenPointer)
    if ($taskToken.Length -lt 32) { throw 'DB_SETUP_TOKEN must contain at least 32 characters, matching the deployed value.' }
    Write-Host 'Checking the deployed catalog seed endpoint...'
    $taskBefore = Invoke-CatalogSetup -Method 'GET' -Url $taskEndpoint
    if ($taskBefore.catalog_seed_available -ne $true) {
        throw 'This deployment only supports the old partner setup. Commit/push the updated files and redeploy before running this script.'
    }
    if (@($taskBefore.missing_expected_tables).Count -ne 0) { throw 'Application tables are missing. Complete the initial database setup first.' }
    Write-Host ('Connected database: {0}' -f $taskBefore.database_name)
    Write-Host ('Existing partner rows: {0}' -f $taskBefore.partners_total)
    Write-Host 'Importing the six catalog seeds in one transaction (matching product fields are updated)...'
    $taskAfter = Invoke-CatalogSetup -Method 'POST' -Url ($taskEndpoint + '?seed=catalog')
    if ($taskAfter.mode -ne 'seed-catalog-only') { throw 'Unexpected import mode. Check the deployed version before running again.' }
    Write-Host ('Verified products: {0}' -f $taskAfter.catalog_records_verified.products)
    Write-Host ('Verified product image links: {0}' -f $taskAfter.catalog_records_verified.image_links)
    Write-Host ('Verified solutions: {0}' -f $taskAfter.catalog_records_verified.solutions)
    Write-Host 'Current database totals:'
    $taskAfter.totals.PSObject.Properties | ForEach-Object { Write-Host ('  {0}: {1}' -f $_.Name, $_.Value) }
    Write-Host 'Done. Remove DB_SETUP_TOKEN on Vibe and redeploy to disable the setup endpoint.'
    Write-Host 'Check the deployed product/solution pages. Image files must also be included in the deployment.'
} catch {
    Write-Error $_.Exception.Message
    exit 1
} finally {
    if ($taskTokenPointer -ne [IntPtr]::Zero) { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($taskTokenPointer) }
    $taskToken = $null
    $taskSecureToken.Dispose()
    $taskClient.Dispose()
    $taskHandler.Dispose()
}
