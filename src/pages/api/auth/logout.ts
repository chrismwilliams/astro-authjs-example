import type { APIRoute } from "astro";
import { lucia } from "@/lib/auth";

export const GET: APIRoute = async ({ cookies, locals, redirect }) => {
	if (!locals.session) {
		return new Response(null, {
			status: 401,
		});
	}

	await lucia.invalidateSession(locals.session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return redirect("/");
};
