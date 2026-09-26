"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapAuthError } from "@/lib/authErrors";

export interface SignInState {
  error: string | null;
}

export interface SignUpState {
  error: string | null;
  info: string | null;
}

// Note: redirect() works by throwing a special error that Next's action
// runtime catches to perform the navigation. Don't wrap these bodies in a
// blanket try/catch later without excluding that - it would turn a
// successful login/signup into a swallowed "error".

export async function signIn(_prevState: SignInState, formData: FormData): Promise<SignInState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: mapAuthError(error) };
  }

  redirect("/");
}

export async function signUp(_prevState: SignUpState, formData: FormData): Promise<SignUpState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: mapAuthError(error), info: null };
  }

  if (data.session) {
    redirect("/");
  }

  return { error: null, info: "Check your email to confirm your account, then log in." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
