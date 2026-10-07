import ProjectDetailClient from '@/components/dashboard/ProjectDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ProjectDetailClient projectId={id} />;
}
