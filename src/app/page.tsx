import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Ayeye</h1>
        <p className="text-lg text-gray-500 mb-10">
          The marketplace where buyers and sellers connect.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-xl transition"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
