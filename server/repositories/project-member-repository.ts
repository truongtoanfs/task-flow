import { and, eq } from 'drizzle-orm'
import type { Database } from '../database/client'
import { projectMembers } from '../database/schema'

export async function findProjectMembership(
  database: Database,
  projectId: string,
  userId: string,
) {
  const [membership] = await database
    .select({
      role: projectMembers.role,
    })
    .from(projectMembers)
    .where(
      and(
        eq(
          projectMembers.projectId,
          projectId,
        ),
        eq(
          projectMembers.userId,
          userId,
        ),
      ),
    )
    .limit(1)

  return membership ?? null
}