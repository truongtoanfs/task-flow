CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"actor_id" uuid NOT NULL,
	"task_id" uuid,
	"target_user_id" uuid,
	"action" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "activity_logs_action_check" CHECK ("activity_logs"."action" IN (
        'project_created',
        'member_added',
        'member_removed',
        'member_role_changed',
        'task_created',
        'task_status_changed',
        'task_assigned',
        'task_unassigned'
      )),
	CONSTRAINT "activity_logs_metadata_object_check" CHECK (jsonb_typeof("activity_logs"."metadata") = 'object'),
	CONSTRAINT "activity_logs_reference_shape_check" CHECK ((
          "activity_logs"."action" = 'project_created'
          AND "activity_logs"."task_id" IS NULL
          AND "activity_logs"."target_user_id" IS NULL
        ) OR (
          "activity_logs"."action" IN (
            'member_added',
            'member_removed',
            'member_role_changed'
          )
          AND "activity_logs"."task_id" IS NULL
          AND "activity_logs"."target_user_id" IS NOT NULL
        ) OR (
          "activity_logs"."action" IN (
            'task_created',
            'task_status_changed'
          )
          AND "activity_logs"."task_id" IS NOT NULL
          AND "activity_logs"."target_user_id" IS NULL
        ) OR (
          "activity_logs"."action" IN (
            'task_assigned',
            'task_unassigned'
          )
          AND "activity_logs"."task_id" IS NOT NULL
          AND "activity_logs"."target_user_id" IS NOT NULL
        ))
);
--> statement-breakpoint
CREATE TABLE "project_members" (
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_members_project_id_user_id_pk" PRIMARY KEY("project_id","user_id"),
	CONSTRAINT "project_members_role_check" CHECK ("project_members"."role" IN ('owner', 'member', 'viewer'))
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_name_trimmed_check" CHECK ("projects"."name" = btrim("projects"."name")),
	CONSTRAINT "projects_name_length_check" CHECK (char_length("projects"."name") BETWEEN 1 AND 120),
	CONSTRAINT "projects_description_length_check" CHECK ("projects"."description" IS NULL
        OR char_length("projects"."description") BETWEEN 1 AND 5000)
);
--> statement-breakpoint
CREATE TABLE "task_assignees" (
	"task_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"assigned_by" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "task_assignees_task_id_user_id_pk" PRIMARY KEY("task_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"created_by" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'todo' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tasks_id_project_id_unique" UNIQUE("id","project_id"),
	CONSTRAINT "tasks_title_trimmed_check" CHECK ("tasks"."title" = btrim("tasks"."title")),
	CONSTRAINT "tasks_title_length_check" CHECK (char_length("tasks"."title") BETWEEN 1 AND 200),
	CONSTRAINT "tasks_description_length_check" CHECK ("tasks"."description" IS NULL
        OR char_length("tasks"."description") BETWEEN 1 AND 10000),
	CONSTRAINT "tasks_status_check" CHECK ("tasks"."status" IN ('todo', 'in_progress', 'done')),
	CONSTRAINT "tasks_priority_check" CHECK ("tasks"."priority" IN ('low', 'medium', 'high')),
	CONSTRAINT "tasks_version_check" CHECK ("tasks"."version" >= 1)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_display_name_trimmed_check" CHECK ("users"."display_name" = btrim("users"."display_name")),
	CONSTRAINT "users_display_name_length_check" CHECK (char_length("users"."display_name") BETWEEN 1 AND 100)
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_task_project_fk" FOREIGN KEY ("task_id","project_id") REFERENCES "public"."tasks"("id","project_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_task_project_fk" FOREIGN KEY ("task_id","project_id") REFERENCES "public"."tasks"("id","project_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_project_member_fk" FOREIGN KEY ("project_id","user_id") REFERENCES "public"."project_members"("project_id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;