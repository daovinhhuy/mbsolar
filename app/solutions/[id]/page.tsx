import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import { getSolutions } from "@/services/solutionsCatalog";
import SolutionDetail from "../SolutionDetail";

type SolutionPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { id } = await params;
  const solutions = await getSolutions();
  const solution = solutions.find((item) => item.id === id);

  return solution ? { title: `${solution.title} | MB Solar` } : {};
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { id } = await params;
  const solutions = await getSolutions();
  const solution = solutions.find((item) => item.id === id);

  if (!solution) notFound();

  return (
    <>
      <Header />
      <main className="construction-detail-page solution-detail-page">
        <SolutionDetail solution={solution} />
      </main>
      <Footer />
    </>
  );
}
