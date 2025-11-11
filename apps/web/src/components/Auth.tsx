import React, { useState } from "react";
import { signUpWithEmail, signInWithEmail } from "../services/auth";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface AuthProps {
  // onAuthenticated receives the mode the user used to authenticate so
  // callers can differentiate sign-in vs sign-up behavior.
  onAuthenticated: (mode: "signin" | "signup") => void;
  initialMode?: "signin" | "signup";
}

export function Auth({ onAuthenticated, initialMode }: AuthProps) {
  const [mode, setMode] = useState<"signin" | "signup">(
    initialMode || "signin"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        await signUpWithEmail(email, password);
        // After successful signup, notify parent with mode
        onAuthenticated("signup");
      } else {
        await signInWithEmail(email, password);
        // After successful sign-in, notify parent with mode
        onAuthenticated("signin");
      }
    } catch (e: any) {
      setError(
        e?.message || "Authentication failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-slate-900 mb-4">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button
            disabled={loading || !email || password.length < 6}
            onClick={submit}
            className="w-full bg-slate-900 text-white"
          >
            {loading
              ? "Please wait…"
              : mode === "signin"
              ? "Sign in"
              : "Sign up"}
          </Button>
          <button
            className="text-sm text-slate-600 underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin"
              ? "Don't have an account? Sign up"
              : "Have an account? Sign in"}
          </button>
        </div>
      </Card>
    </div>
  );
}
