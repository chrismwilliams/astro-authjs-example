/// <reference path="../.astro/db-types.d.ts" />
/// <reference types="astro/client" />

import type { Session, User } from "lucia";

declare namespace App {
	interface Locals {
		session: import("lucia").Session | null;
		user: import("lucia").User | null;
	}
}
