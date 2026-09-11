import type { DatabaseExecutor } from '../database/client'
import {
  tasks,
  type NewTask,
  type Task,
} from '../database/schema'

export async function insertTask(
  database: DatabaseExecutor,
  task: NewTask,
): Promise<Task> {
  const [createdTask] = await database
    .insert(tasks)
    .values(task)
    .returning()

  if (!createdTask) {
    throw new Error(
      'Task insert returned no row.',
    )
  }

  return createdTask
}