import { and, eq } from 'drizzle-orm'
import type { DatabaseExecutor } from '../database/client'
import { projectMembers } from '../database/schema'

export async function findProjectMembership(
  database: DatabaseExecutor,
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
    .limit(1).for('update')

  return membership ?? null
}