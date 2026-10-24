import { headers } from "next/headers";
import type { FinishedConstructionProject } from "@/app/finished-construction/projects";

type ApiConstructionProject = {
  id: string;
  title: string;
  introduction: string;
  content: string;
  images: string[];
};

export async function getFinishedConstructionProjects(): Promise<FinishedConstructionProject[]> {
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
    const response = await fetch(
      `${protocol}://${host}/api/construction-projects`,
      { cache: "no-store" },
    );

    if (!response.ok) return [];

    const data = (await response.json()) as {
      projects: ApiConstructionProject[];
    };

    return data.projects.map((project) => ({
      id: project.id,
      title: project.title,
      introduction: project.introduction,
      content: project.content
        .split(/\r?\n\s*\r?\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
      images: project.images,
    }));
  } catch (error) {
    console.error("Failed to fetch construction projects from API:", error);
    return [];
  }
}
