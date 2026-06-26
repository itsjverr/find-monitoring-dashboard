import { LockKeyhole } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <form
        action="/api/auth/login"
        method="post"
        className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-7 shadow-soft"
      >
        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-nd-50 text-nd-700">
            <LockKeyhole size={20} />
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-normal text-ink">
              Fi<span className="text-nd-600">ND</span>
            </div>
            <p className="text-sm text-zinc-500">Monitoring</p>
          </div>
        </div>
        <label className="text-sm font-medium text-zinc-700" htmlFor="password">
          Internal password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          className="mt-2 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 outline-none transition focus:border-nd-500 focus:bg-white focus:ring-4 focus:ring-nd-100"
        />
        <button className="mt-5 h-12 w-full rounded-2xl bg-ink px-4 text-sm font-semibold text-white transition hover:bg-zinc-800">
          Enter FiND
        </button>
        <p className="mt-4 text-xs text-zinc-400">Demo password: find-demo</p>
      </form>
    </main>
  );
}
