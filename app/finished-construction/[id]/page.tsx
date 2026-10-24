import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import FinishedConstructionDetail from "../FinishedConstructionDetail";
import { getFinishedConstructionProjects } from "@/services/finishedConstructionCatalog";

type FinishedConstructionPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: FinishedConstructionPageProps): Promise<Metadata> {
  const { id } = await params;
  const projects = await getFinishedConstructionProjects();
  const project = projects.find((item) => item.id === id);

  return project ? { title: `${project.title} | MB Solar` } : {};
}

export default async function FinishedConstructionPage({
  params,
}: FinishedConstructionPageProps) {
  const { id } = await params;
  const projects = await getFinishedConstructionProjects();
  const project = projects.find((item) => item.id === id);

  if (!project) notFound();

  return (
    <>
      <Header />
      <main className="construction-detail-page">
        <FinishedConstructionDetail project={project} />
      </main>
      <Footer />
    </>
  );
}
