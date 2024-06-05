import type { APIRoute } from "astro";
import { db, eq, User } from "astro:db";
import { lucia } from "@/lib/auth";
import { verify } from "@node-rs/argon2";

export const POST: APIRoute = async ({ cookies, request, redirect }) => {
	const formData = await request.formData();
	const username = formData.get("username") as string;
	const password = formData.get("password") as string;

	if (!username || !password) {
		return new Response("Username and password are required", { status: 400 });
	}

	const existingUser = (await db.select().from(User).where(eq(User.username, username)))[0];

	if (!existingUser) {
		return new Response(
			JSON.stringify({
				error: "Incorrect username or password",
			}),
			{
				status: 400,
			},
		);
	}

	const validPassword = await verify(existingUser!.password, password, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1,
	});
	if (!validPassword) {
		return new Response("Incorrect username or password", { status: 400 });
	}

	const session = await lucia.createSession(existingUser!.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return redirect("/dashboard");
};
