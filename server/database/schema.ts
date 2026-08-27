import { sql } from 'drizzle-orm'
import {
  check,
  foreignKey,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

export const projectRoles = ['owner', 'member', 'viewer'] as const

export const taskStatuses = [
  'todo',
  'in_progress',
  'done',
] as const

export const taskPriorities = [
  'low',
  'medium',
  'high',
] as const

export const activityActions = [
  'project_created',
  'member_added',
  'member_removed',
  'member_role_changed',
  'task_created',
  'task_status_changed',
  'task_assigned',
  'task_unassigned',
] as const

export type ProjectRole = (typeof projectRoles)[number]
export type TaskStatus = (typeof taskStatuses)[number]
export type TaskPriority = (typeof taskPriorities)[number]
export type ActivityAction = (typeof activityActions)[number]
export type ActivityMetadata = Record<string, unknown>

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    displayName: text('display_name').notNull(),

    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  table => [
    check(
      'users_display_name_trimmed_check',
      sql`${table.displayName} = btrim(${table.displayName})`,
    ),

    check(
      'users_display_name_length_check',
      sql`char_length(${table.displayName}) BETWEEN 1 AND 100`,
    ),
  ],
)

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    name: text('name').notNull(),

    description: text('description'),

    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id, {
        onDelete: 'restrict',
      }),

    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  table => [
    check(
      'projects_name_trimmed_check',
      sql`${table.name} = btrim(${table.name})`,
    ),

    check(
      'projects_name_length_check',
      sql`char_length(${table.name}) BETWEEN 1 AND 120`,
    ),

    check(
      'projects_description_length_check',
      sql`${table.description} IS NULL
        OR char_length(${table.description}) BETWEEN 1 AND 5000`,
    ),
  ],
)

export const projectMembers = pgTable(
  'project_members',
  {
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, {
        onDelete: 'restrict',
      }),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'restrict',
      }),

    role: text('role', {
      enum: projectRoles,
    }).notNull(),

    joinedAt: timestamp('joined_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  table => [
    primaryKey({
      name: 'project_members_project_id_user_id_pk',
      columns: [
        table.projectId,
        table.userId,
      ],
    }),

    check(
      'project_members_role_check',
      sql`${table.role} IN ('owner', 'member', 'viewer')`,
    ),
  ],
)

export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, {
        onDelete: 'restrict',
      }),

    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id, {
        onDelete: 'restrict',
      }),

    title: text('title').notNull(),

    description: text('description'),

    status: text('status', {
      enum: taskStatuses,
    })
      .notNull()
      .default('todo'),

    priority: text('priority', {
      enum: taskPriorities,
    })
      .notNull()
      .default('medium'),

    version: integer('version')
      .notNull()
      .default(1),

    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  table => [
    unique('tasks_id_project_id_unique').on(
      table.id,
      table.projectId,
    ),

    check(
      'tasks_title_trimmed_check',
      sql`${table.title} = btrim(${table.title})`,
    ),

    check(
      'tasks_title_length_check',
      sql`char_length(${table.title}) BETWEEN 1 AND 200`,
    ),

    check(
      'tasks_description_length_check',
      sql`${table.description} IS NULL
        OR char_length(${table.description}) BETWEEN 1 AND 10000`,
    ),

    check(
      'tasks_status_check',
      sql`${table.status} IN ('todo', 'in_progress', 'done')`,
    ),

    check(
      'tasks_priority_check',
      sql`${table.priority} IN ('low', 'medium', 'high')`,
    ),

    check(
      'tasks_version_check',
      sql`${table.version} >= 1`,
    ),
  ],
)

export const taskAssignees = pgTable(
  'task_assignees',
  {
    taskId: uuid('task_id').notNull(),

    projectId: uuid('project_id').notNull(),

    userId: uuid('user_id').notNull(),

    assignedBy: uuid('assigned_by')
      .notNull()
      .references(() => users.id, {
        onDelete: 'restrict',
      }),

    assignedAt: timestamp('assigned_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  table => [
    primaryKey({
      name: 'task_assignees_task_id_user_id_pk',
      columns: [
        table.taskId,
        table.userId,
      ],
    }),

    foreignKey({
      name: 'task_assignees_task_project_fk',
      columns: [
        table.taskId,
        table.projectId,
      ],
      foreignColumns: [
        tasks.id,
        tasks.projectId,
      ],
    }).onDelete('restrict'),

    foreignKey({
      name: 'task_assignees_project_member_fk',
      columns: [
        table.projectId,
        table.userId,
      ],
      foreignColumns: [
        projectMembers.projectId,
        projectMembers.userId,
      ],
    }).onDelete('restrict'),
  ],
)

export const activityLogs = pgTable(
  'activity_logs',
  {
    id: uuid('id')
      .defaultRandom()
      .primaryKey(),

    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, {
        onDelete: 'restrict',
      }),

    actorId: uuid('actor_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'restrict',
      }),

    taskId: uuid('task_id'),

    targetUserId: uuid('target_user_id')
      .references(() => users.id, {
        onDelete: 'restrict',
      }),

    action: text('action', {
      enum: activityActions,
    }).notNull(),

    metadata: jsonb('metadata')
      .$type<ActivityMetadata>()
      .notNull()
      .default(sql`'{}'::jsonb`),

    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  table => [
    foreignKey({
      name: 'activity_logs_task_project_fk',
      columns: [
        table.taskId,
        table.projectId,
      ],
      foreignColumns: [
        tasks.id,
        tasks.projectId,
      ],
    }).onDelete('restrict'),

    check(
      'activity_logs_action_check',
      sql`${table.action} IN (
        'project_created',
        'member_added',
        'member_removed',
        'member_role_changed',
        'task_created',
        'task_status_changed',
        'task_assigned',
        'task_unassigned'
      )`,
    ),

    check(
      'activity_logs_metadata_object_check',
      sql`jsonb_typeof(${table.metadata}) = 'object'`,
    ),

    check(
      'activity_logs_reference_shape_check',
      sql`(
          ${table.action} = 'project_created'
          AND ${table.taskId} IS NULL
          AND ${table.targetUserId} IS NULL
        ) OR (
          ${table.action} IN (
            'member_added',
            'member_removed',
            'member_role_changed'
          )
          AND ${table.taskId} IS NULL
          AND ${table.targetUserId} IS NOT NULL
        ) OR (
          ${table.action} IN (
            'task_created',
            'task_status_changed'
          )
          AND ${table.taskId} IS NOT NULL
          AND ${table.targetUserId} IS NULL
        ) OR (
          ${table.action} IN (
            'task_assigned',
            'task_unassigned'
          )
          AND ${table.taskId} IS NOT NULL
          AND ${table.targetUserId} IS NOT NULL
        )`,
    ),
  ],
)

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

export type ProjectMember = typeof projectMembers.$inferSelect
export type NewProjectMember = typeof projectMembers.$inferInsert

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert

export type TaskAssignee = typeof taskAssignees.$inferSelect
export type NewTaskAssignee = typeof taskAssignees.$inferInsert

export type ActivityLog = typeof activityLogs.$inferSelect
export type NewActivityLog = typeof activityLogs.$inferInsert