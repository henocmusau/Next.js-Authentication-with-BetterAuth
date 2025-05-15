ALTER TABLE "invitation" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "member" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "oauth_access_token" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "oauth_application" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "oauth_consent" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "organization" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "invitation" CASCADE;--> statement-breakpoint
DROP TABLE "member" CASCADE;--> statement-breakpoint
DROP TABLE "oauth_access_token" CASCADE;--> statement-breakpoint
DROP TABLE "oauth_application" CASCADE;--> statement-breakpoint
DROP TABLE "oauth_consent" CASCADE;--> statement-breakpoint
DROP TABLE "organization" CASCADE;--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_username_unique";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "active_organization_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "username";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "display_username";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "is_first_connection";