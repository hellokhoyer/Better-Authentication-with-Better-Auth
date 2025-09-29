import { defaineConfig } from "drizzle-kit";
export default defaineConfig({
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dialect: "pg",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
	casing: "snake_case",
});
