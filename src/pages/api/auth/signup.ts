import { lucia } from "@/lib/auth";
import { generateId } from "lucia";
import { hash } from "@node-rs/argon2";
import { db, User } from "astro:db";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies, request, redirect }) => {
	const formData = await request.formData();
	const username = formData.get("username")?.toString();
	const password = formData.get("password")?.toString();

	if (!username || !password) {
		return new Response("Email and password are required", { status: 400 });
	}

	const hashedPassword = await hash(password, {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
	const userId = generateId(15);

	// TODO: check if username is already used
	await db.insert(User).values({ id: userId, username, password: hashedPassword });
	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return redirect("/dashboard");
};
