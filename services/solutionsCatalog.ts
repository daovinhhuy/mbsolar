import { headers } from "next/headers";
import type { Solution } from "@/app/solutions/solutions";

type ApiSolution = {
  id: string;
  title: string;
  introduction: string;
  content: string;
  images: string[];
};

export async function getSolutions(): Promise<Solution[]> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim() ??
    requestHeaders.get("host");

  if (!host) return [];

  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const isLocalHost =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]");
  const protocol =
    forwardedProtocol ??
    (process.env.NODE_ENV === "development" || isLocalHost ? "http" : "https");

  try {
    const response = await fetch(`${protocol}://${host}/api/solutions`, {
      cache: "no-store",
    });

    if (!response.ok) return [];

    const data = (await response.json()) as { solutions: ApiSolution[] };

    return data.solutions.map((solution) => ({
      id: solution.id,
      title: solution.title,
      introduction: solution.introduction,
      content: solution.content
        .split(/\r?\n\s*\r?\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
      images: solution.images,
    }));
  } catch (error) {
    console.error("Failed to fetch solutions from API:", error);
    return [];
  }
}
