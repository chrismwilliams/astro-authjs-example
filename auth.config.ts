import Credentials from "@auth/core/providers/credentials";
import { db, eq, User } from "astro:db";
import { verify } from "@node-rs/argon2";
import { defineConfig } from "auth-astro";

/**
 * An array of path prefixes to require authentication for.
 */
export const paths = ["/dashboard"];

export default defineConfig({
	providers: [
		Credentials({
			credentials: {
				email: {},
				password: {},
			},
			authorize: async (credentials) => {
				const user = (await db.select().from(User).where(eq(User.email, credentials.email)))[0];

				if (!user) {
					// No user found, so this is their first attempt to login
					// meaning this is also the place you could do registration
					return null;
				}

				const validPassword = await verify(user!.password, credentials.password, {
					memoryCost: 19456,
					timeCost: 2,
					outputLen: 32,
					parallelism: 1,
				});
				if (!validPassword) {
					return null;
				}

				return user;
			},
		}),
	],
});
