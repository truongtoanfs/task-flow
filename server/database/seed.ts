import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import {
  activityLogs,
  projectMembers,
  projects,
  taskAssignees,
  tasks,
  users,
  type NewActivityLog,
  type NewProject,
  type NewProjectMember,
  type NewTask,
  type NewTaskAssignee,
  type NewUser,
} from './schema'

function requireDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is required. Copy .env.example to .env first.',
    )
  }

  return databaseUrl
}

if (process.env.NODE_ENV === 'production') {
  throw new Error('Refusing to seed when NODE_ENV=production.')
}

const seedIds = {
  users: {
    owner: '10000000-0000-4000-8000-000000000001',
    member: '10000000-0000-4000-8000-000000000002',
    viewer: '10000000-0000-4000-8000-000000000003',
    outsider: '10000000-0000-4000-8000-000000000004',
  },
  project: '20000000-0000-4000-8000-000000000001',
  tasks: {
    todoLow: '30000000-0000-4000-8000-000000000001',
    inProgressMedium: '30000000-0000-4000-8000-000000000002',
    doneHigh: '30000000-0000-4000-8000-000000000003',
  },
  activityLogs: {
    projectCreated: '40000000-0000-4000-8000-000000000001',
    memberAdded: '40000000-0000-4000-8000-000000000002',
    viewerAdded: '40000000-0000-4000-8000-000000000003',
    todoTaskCreated: '40000000-0000-4000-8000-000000000004',
    progressTaskCreated: '40000000-0000-4000-8000-000000000005',
    doneTaskCreated: '40000000-0000-4000-8000-000000000006',
    todoTaskAssigned: '40000000-0000-4000-8000-000000000007',
    progressTaskOwnerAssigned:
      '40000000-0000-4000-8000-000000000008',
    progressTaskMemberAssigned:
      '40000000-0000-4000-8000-000000000009',
  },
} as const

const seedTime = new Date('2026-09-07T00:00:00.000Z')

const seedUsers: NewUser[] = [
  {
    id: seedIds.users.owner,
    displayName: 'TaskFlow Owner',
    createdAt: seedTime,
    updatedAt: seedTime,
  },
  {
    id: seedIds.users.member,
    displayName: 'TaskFlow Member',
    createdAt: seedTime,
    updatedAt: seedTime,
  },
  {
    id: seedIds.users.viewer,
    displayName: 'TaskFlow Viewer',
    createdAt: seedTime,
    updatedAt: seedTime,
  },
  {
    id: seedIds.users.outsider,
    displayName: 'TaskFlow Outsider',
    createdAt: seedTime,
    updatedAt: seedTime,
  },
]

const seedProjects: NewProject[] = [
  {
    id: seedIds.project,
    name: 'TaskFlow Demo Project',
    description: 'Stable development data for TaskFlow.',
    createdBy: seedIds.users.owner,
    createdAt: seedTime,
    updatedAt: seedTime,
  },
]

const seedProjectMembers: NewProjectMember[] = [
  {
    projectId: seedIds.project,
    userId: seedIds.users.owner,
    role: 'owner',
    joinedAt: seedTime,
    updatedAt: seedTime,
  },
  {
    projectId: seedIds.project,
    userId: seedIds.users.member,
    role: 'member',
    joinedAt: seedTime,
    updatedAt: seedTime,
  },
  {
    projectId: seedIds.project,
    userId: seedIds.users.viewer,
    role: 'viewer',
    joinedAt: seedTime,
    updatedAt: seedTime,
  },
]

const seedTasks: NewTask[] = [
  {
    id: seedIds.tasks.todoLow,
    projectId: seedIds.project,
    createdBy: seedIds.users.owner,
    title: 'Prepare TaskFlow API contract',
    description: null,
    status: 'todo',
    priority: 'low',
    version: 1,
    createdAt: seedTime,
    updatedAt: seedTime,
  },
  {
    id: seedIds.tasks.inProgressMedium,
    projectId: seedIds.project,
    createdBy: seedIds.users.member,
    title: 'Implement task creation flow',
    description: 'Task with two assignees for relationship testing.',
    status: 'in_progress',
    priority: 'medium',
    version: 1,
    createdAt: seedTime,
    updatedAt: seedTime,
  },
  {
    id: seedIds.tasks.doneHigh,
    projectId: seedIds.project,
    createdBy: seedIds.users.owner,
    title: 'T'.repeat(200),
    description: 'Unassigned task with a maximum-length title.',
    status: 'done',
    priority: 'high',
    version: 1,
    createdAt: seedTime,
    updatedAt: seedTime,
  },
]

const seedTaskAssignees: NewTaskAssignee[] = [
  {
    taskId: seedIds.tasks.todoLow,
    projectId: seedIds.project,
    userId: seedIds.users.member,
    assignedBy: seedIds.users.owner,
    assignedAt: seedTime,
  },
  {
    taskId: seedIds.tasks.inProgressMedium,
    projectId: seedIds.project,
    userId: seedIds.users.owner,
    assignedBy: seedIds.users.member,
    assignedAt: seedTime,
  },
  {
    taskId: seedIds.tasks.inProgressMedium,
    projectId: seedIds.project,
    userId: seedIds.users.member,
    assignedBy: seedIds.users.member,
    assignedAt: seedTime,
  },
]

const seedActivityLogs: NewActivityLog[] = [
  {
    id: seedIds.activityLogs.projectCreated,
    projectId: seedIds.project,
    actorId: seedIds.users.owner,
    action: 'project_created',
    metadata: {},
    createdAt: seedTime,
  },
  {
    id: seedIds.activityLogs.memberAdded,
    projectId: seedIds.project,
    actorId: seedIds.users.owner,
    targetUserId: seedIds.users.member,
    action: 'member_added',
    metadata: { role: 'member' },
    createdAt: seedTime,
  },
  {
    id: seedIds.activityLogs.viewerAdded,
    projectId: seedIds.project,
    actorId: seedIds.users.owner,
    targetUserId: seedIds.users.viewer,
    action: 'member_added',
    metadata: { role: 'viewer' },
    createdAt: seedTime,
  },
  ...([
    [
      seedIds.activityLogs.todoTaskCreated,
      seedIds.tasks.todoLow,
      seedIds.users.owner,
    ],
    [
      seedIds.activityLogs.progressTaskCreated,
      seedIds.tasks.inProgressMedium,
      seedIds.users.member,
    ],
    [
      seedIds.activityLogs.doneTaskCreated,
      seedIds.tasks.doneHigh,
      seedIds.users.owner,
    ],
  ] as const).map(([id, taskId, actorId]) => ({
    id,
    projectId: seedIds.project,
    actorId,
    taskId,
    action: 'task_created' as const,
    metadata: {},
    createdAt: seedTime,
  })),
  ...([
    [
      seedIds.activityLogs.todoTaskAssigned,
      seedIds.tasks.todoLow,
      seedIds.users.member,
      seedIds.users.owner,
    ],
    [
      seedIds.activityLogs.progressTaskOwnerAssigned,
      seedIds.tasks.inProgressMedium,
      seedIds.users.owner,
      seedIds.users.member,
    ],
    [
      seedIds.activityLogs.progressTaskMemberAssigned,
      seedIds.tasks.inProgressMedium,
      seedIds.users.member,
      seedIds.users.member,
    ],
  ] as const).map(([id, taskId, targetUserId, actorId]) => ({
    id,
    projectId: seedIds.project,
    actorId,
    taskId,
    targetUserId,
    action: 'task_assigned' as const,
    metadata: {},
    createdAt: seedTime,
  })),
]

async function seedDatabase() {
  const databaseUrl = requireDatabaseUrl()
  const client = postgres(databaseUrl, { max: 1 })
  const db = drizzle({ client })

  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(users)
        .values(seedUsers)
        .onConflictDoNothing()

      await tx
        .insert(projects)
        .values(seedProjects)
        .onConflictDoNothing()

      await tx
        .insert(projectMembers)
        .values(seedProjectMembers)
        .onConflictDoNothing()

      await tx
        .insert(tasks)
        .values(seedTasks)
        .onConflictDoNothing()

      await tx
        .insert(taskAssignees)
        .values(seedTaskAssignees)
        .onConflictDoNothing()

      await tx
        .insert(activityLogs)
        .values(seedActivityLogs)
        .onConflictDoNothing()
    })

    console.info('TaskFlow seed completed successfully.')
  }
  finally {
    await client.end()
  }
}

seedDatabase().catch((error: unknown) => {
  console.error('TaskFlow seed failed.', error)
  process.exitCode = 1
})
