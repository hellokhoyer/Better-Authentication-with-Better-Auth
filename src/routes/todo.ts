import { Hono } from "hono";
import { getTodoByUserId, insertTodo } from "@/src/db/queries";
import type { AuthEnv } from "@/src/middleware/auth";
import { validateCreateTodo } from "@/src/validator/todo";

const todoApp = new Hono<AuthEnv>();

todoApp.post("/", validateCreateTodo, async (c) => {
	const user = c.get("user");

	if (!user) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const { title, description } = c.req.valid("json");

	const todo = await insertTodo({
		title,
		description,
		userId: user.id,
	});

	return c.json(todo, 201);
});

// Fetch todos for current user

todoApp.get("/", async (c) => {
	const user = c.get("user");

	if (!user) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const todos = await getTodoByUserId(user.id);

	return c.json(todos);
});

export default todoApp;
