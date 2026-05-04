import { auth } from "@/auth";
import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {session.user?.name}!
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Logged in as <strong>{session.user?.email}</strong> &middot; Role:{" "}
            <span className="capitalize">{session.user?.role?.toLowerCase()}</span>
          </p>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
