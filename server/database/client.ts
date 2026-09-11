import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

function createDatabase() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required.')
  }

  const client = postgres(databaseUrl)

  return drizzle(client, { schema })
}

export type Database = ReturnType<typeof createDatabase>

export type DatabaseTransaction = Parameters<
  Parameters<Database['transaction']>[0]
>[0]

export type DatabaseExecutor = Database | DatabaseTransaction

let database: Database | undefined

export function useDatabase(): Database {
  database ??= createDatabase()

  return database
}