import type { CreateTaskBody } from '../validation/task'
import { useDatabase } from '../database/client'
import type {
  ProjectRole,
  Task,
} from '../database/schema'
import { findProjectMembership } from '../repositories/project-member-repository'
import { insertTask } from '../repositories/task-repository'
import { ApiError } from '../utils/api-error'

export interface CreateTaskInput {
  projectId: string
  actorId: string
  body: CreateTaskBody
}

export function assertCanCreateTask(
  role: ProjectRole | null,
): void {
  if (!role) {
    throw new ApiError(
      404,
      'RESOURCE_NOT_FOUND',
      'Project was not found.',
    )
  }

  if (role === 'viewer') {
    throw new ApiError(
      403,
      'FORBIDDEN',
      'You do not have permission to create tasks in this project.',
    )
  }
}

export async function createTask(
  input: CreateTaskInput,
): Promise<Task> {
  const database = useDatabase()

  const membership
    = await findProjectMembership(
      database,
      input.projectId,
      input.actorId,
    )

  assertCanCreateTask(
    membership?.role ?? null,
  )

  return insertTask(database, {
    projectId: input.projectId,
    createdBy: input.actorId,
    ...input.body,
  })
}