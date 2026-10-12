import { getInternalUser } from '@/lib/auth';
import { canAccessProjects } from '@/lib/types/dashboard';
import { redirect } from 'next/navigation';
import ProjectBoardClient from '@/components/internal/ProjectBoardClient';

export default async function ProjectsPage() {
  const user = await getInternalUser();

  if (!canAccessProjects(user.role)) {
    redirect('/internal');
  }

  return (
    <div>
      <ProjectBoardClient currentUser={user} />
    </div>
  );
}
