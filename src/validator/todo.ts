import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

export const createTodoSchema = z.object({
	title: z.string().min(1, "Title is required").max(500),
	description: z.string().max(1000).optional(),
});

export const updateTodoSchema = z.object({
	title: z.string().min(1).max(500).optional(),
	description: z.string().max(1000).optional(),
	completed: z.boolean().optional(),
});

export const validateCreateTodo = zValidator("json", createTodoSchema, (result, c) => {
	if (!result.success) {
		return c.json(
			{
				errors: result.error.issues.map((issue) => issue.message),
			},
			400,
		);
	}
});

export const validateUpdateTodo = zValidator("json", updateTodoSchema, (result, c) => {
	if (!result.success) {
		return c.json(
			{
				errors: result.error.issues.map((issue) => issue.message),
			},
			400,
		);
	}
});
