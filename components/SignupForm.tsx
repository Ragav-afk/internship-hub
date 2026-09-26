"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, SignUpState } from "@/lib/authActions";

const initialState: SignUpState = { error: null, info: null };

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <div className="w-full max-w-sm rounded-md border border-gray-300 bg-white p-6">
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Sign up</h1>

      {state.info ? (
        <div className="text-center text-sm text-gray-700">
          <p>{state.info}</p>
          <Link href="/login" className="mt-4 inline-block text-blue-700 hover:underline">
            Go to login
          </Link>
        </div>
      ) : (
        <>
          <form action={formAction} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">At least 6 characters.</p>
            </div>

            {state.error && <p className="text-sm text-red-600">{state.error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {pending ? "Signing up..." : "Sign up"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-700 hover:underline">
              Log in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
