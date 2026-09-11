import type { DatabaseExecutor } from '../database/client'
import {
  activityLogs,
  type ActivityLog,
  type NewActivityLog,
} from '../database/schema'

export async function insertActivityLog(
  database: DatabaseExecutor,
  activityLog: NewActivityLog,
): Promise<ActivityLog> {
  const [createdActivityLog] = await database
    .insert(activityLogs)
    .values(activityLog)
    .returning()

  if (!createdActivityLog) {
    throw new Error(
      'Activity log insert returned no row.',
    )
  }

  return createdActivityLog
}