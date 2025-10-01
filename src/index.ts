import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "@/src/lib/auth";
import { type AuthEnv, authSessionMiddleware } from "@/src/middleware/auth";
import todoRoutes from "@/src/routes/todo";

const app = new Hono<AuthEnv>();

app.use(
	"/api/auth/*",
	cors({
		origin: "http://localhost:3000",
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

app.use("*", authSessionMiddleware);

app
	.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))
	.route("/api/todos", todoRoutes)
	.get("/", (c) => {
		return c.text("Hello Hono!");
	});

export default app;
