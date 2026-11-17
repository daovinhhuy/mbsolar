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

function Invoke-VibeMigrationRequest {
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
            if ($taskStatus -eq 404 -and $taskResult.error -eq 'NOT_FOUND') {
                throw 'The deployed setup route is hiding itself because DB_SETUP_TOKEN is not configured. Add DB_SETUP_TOKEN to the Vibe app environment and redeploy.'
            }
            if ($taskStatus -eq 404) { throw 'Setup endpoint is unavailable. Deploy the updated code to Vibe first.' }
            if ($taskStatus -eq 401) { throw 'DB_SETUP_TOKEN does not match the deployed website.' }
            if ($taskResult.error) { throw ('HTTP {0}: {1} - {2}' -f $taskStatus, $taskResult.error, $taskResult.message) }
            throw ('HTTP {0}: The website did not return a successful migration response.' -f $taskStatus)
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

    Write-Host 'Checking the deployed migration endpoint and target database...'
    $taskBefore = Invoke-VibeMigrationRequest -Method 'GET' -Url $taskEndpoint
    if ($taskBefore.current_schema_migration_available -ne $true) {
        throw 'The deployed version does not include this migration endpoint. Commit/push the updated files and redeploy first.'
    }
    if (@($taskBefore.missing_expected_tables).Count -ne 0) {
        throw 'Application tables are missing. Complete the initial database setup before migrating.'
    }

    Write-Host ('Target database: {0}' -f $taskBefore.database_name)
    Write-Host 'Applying the categories and solutions migration in one transaction...'
    $taskAfter = Invoke-VibeMigrationRequest -Method 'POST' -Url ($taskEndpoint + '?migrate=current-schema')
    if ($taskAfter.mode -ne 'migrated-current-schema') { throw 'Unexpected migration mode. Check the deployed version.' }
    if ($taskAfter.tables.categories.filter_key -ne 'removed' -or $taskAfter.tables.solutions.section_columns -ne 12) {
        throw 'The database returned an unexpected schema verification result.'
    }

    Write-Host ('Migrated database: {0}' -f $taskAfter.database_name)
    Write-Host 'Verified categories: category_group present; filter_key removed.'
    Write-Host ('Verified solutions: {0} section columns present.' -f $taskAfter.tables.solutions.section_columns)
    Write-Host ('Legacy solution rows copied: {0}' -f $taskAfter.migrated_solution_rows)
    Write-Host 'Migration complete. Remove DB_SETUP_TOKEN from Vibe and redeploy to disable the setup endpoint.'
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
