import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
    // Clear the auth cookie
    cookies.delete("admin_auth", {
        path: "/",
    });

    return redirect("/admin");
};
