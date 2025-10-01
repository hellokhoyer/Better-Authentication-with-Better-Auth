import { desc, eq } from "drizzle-orm";
import { db } from "@/src/db/db";
import { todos } from "@/src/db/schema";
import type { NewTodo, Todo } from "@/src/db/types";

export async function insertTodo(todo: NewTodo): Promise<Todo> {
	const [createdTodo] = await db.insert(todos).values(todo).returning();

	return createdTodo;
}

export async function getTodoByUserId(userId: string): Promise<Todo[]> {
	return db
		.select()
		.from(todos)
		.where(eq(todos.userId, userId))
		.orderBy(desc(todos.createdAt));
}
