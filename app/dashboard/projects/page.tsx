import { getAuthUser } from '@/lib/auth';
import ProjectBoardClient from '@/components/internal/ProjectBoardClient';

export default async function DashboardProjectsPage() {
  const user = await getAuthUser();

  return (
    <div>
      <ProjectBoardClient currentUser={user} />
    </div>
  );
}
