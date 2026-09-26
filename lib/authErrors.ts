interface SupabaseAuthErrorLike {
  code?: string;
  message: string;
}

// Maps Supabase's auth errors to messages a user can actually act on.
// Prefers the stable `code` field over the human-readable `message`, since
// Supabase can reword messages between versions but keeps codes stable.
export function mapAuthError(error: SupabaseAuthErrorLike): string {
  switch (error.code) {
    case "invalid_credentials":
      // Supabase deliberately returns this same error whether the email
      // doesn't exist or the password is wrong, so a stranger can't use it
      // to find out which emails have accounts. We can't (and shouldn't
      // try to) tell those two cases apart.
      return "Incorrect email or password.";
    case "user_already_exists":
      return "An account with this email already exists. Try logging in instead.";
    case "weak_password":
      return "Password must be at least 6 characters.";
    case "email_address_invalid":
    case "validation_failed":
      return "Please enter a valid email address.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Too many attempts. Please wait a moment and try again.";
    case "email_not_confirmed":
      return "Please confirm your email address before logging in.";
  }

  // Fallback for older/self-hosted Supabase instances that might not send a code.
  const message = error.message.toLowerCase();
  if (message.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }
  if (message.includes("already registered") || message.includes("already been registered")) {
    return "An account with this email already exists. Try logging in instead.";
  }
  if (message.includes("invalid") && message.includes("email")) {
    return "Please enter a valid email address.";
  }
  if (message.includes("password") && message.includes("least")) {
    return "Password must be at least 6 characters.";
  }
  if (message.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  return "Something went wrong. Please try again.";
}
