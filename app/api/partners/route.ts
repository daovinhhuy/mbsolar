import { getPartners } from "@/services/partners";

export async function GET() {
  try {
    const partners = await getPartners();
    return Response.json({ partners });
  } catch (error) {
    console.error("Failed to load partners:", error);
    return Response.json(
      { error: "Không thể tải danh sách đối tác." },
      { status: 500 },
    );
  }
}
