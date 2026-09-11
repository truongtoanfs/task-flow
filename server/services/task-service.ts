import type { CreateTaskBody } from '../validation/task'
import { useDatabase } from '../database/client'
import type {
  NewActivityLog,
  ProjectRole,
  Task,
} from '../database/schema'
import { insertActivityLog } from '../repositories/activity-log-repository'
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

export function buildTaskCreatedActivityLog(
  input: {
    projectId: string
    actorId: string
    taskId: string
  },
): NewActivityLog {
  return {
    projectId: input.projectId,
    actorId: input.actorId,
    taskId: input.taskId,
    action: 'task_created',
    metadata: {},
  }
}

export async function createTask(
  input: CreateTaskInput,
): Promise<Task> {
  const database = useDatabase()

  return database.transaction(async (transaction) => {
    const membership
      = await findProjectMembership(
        transaction,
        input.projectId,
        input.actorId,
      )

    assertCanCreateTask(
      membership?.role ?? null,
    )

    const task = await insertTask(transaction, {
      projectId: input.projectId,
      createdBy: input.actorId,
      ...input.body,
    })

    await insertActivityLog(
      transaction,
      buildTaskCreatedActivityLog({
        projectId: input.projectId,
        actorId: input.actorId,
        taskId: task.id,
      }),
    )

    return task
  })
}