"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, SendHorizonal } from "lucide-react";

type FormCaptureProps = {
  placeholder: React.ReactNode; // Can be renderText result or string
  buttonText: React.ReactNode;  // Can be renderText result or string
  onSubmit?: (email: string) => void;
  accentColor?: string;
  className?: string;
};

export function FormCapture({
  placeholder,
  buttonText,
  onSubmit,
  accentColor = "#D6FC51",
  className = "",
}: FormCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
      return;
    }

    // Call onSubmit callback if provided
    if (onSubmit) {
      onSubmit(email);
    }

    // Show success state
    setStatus("success");
    setTimeout(() => {
      setStatus("idle");
      setEmail("");
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className={`mx-auto max-w-sm ${className}`}>
      <div
        className={`relative grid grid-cols-[1fr_auto] pr-1.5 items-center rounded-[1rem] border shadow shadow-zinc-950/5 has-[input:focus]:ring-2 lg:pr-0 transition-colors ${
          status === "error"
            ? "border-red-500 has-[input:focus]:ring-red-500"
            : status === "success"
            ? "border-green-500 has-[input:focus]:ring-green-500"
            : "has-[input:focus]:ring-muted"
        }`}
        style={{
          backgroundColor: "var(--background, #ffffff)",
        }}
      >
        <Mail className="pointer-events-none absolute inset-y-0 left-4 my-auto size-4" />

        <input
          placeholder={typeof placeholder === "string" ? placeholder : ""}
          className="h-12 w-full bg-transparent pl-12 focus:outline-none"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "success"}
        />

        <div className="md:pr-1.5 lg:pr-0">
          <motion.button
            type="submit"
            aria-label="submit"
            className="h-9 px-4 rounded-[0.5rem] text-sm font-medium transition-colors disabled:opacity-50"
            style={{
              backgroundColor: status === "success" ? "#10b981" : accentColor,
              color: "#000000",
            }}
            whileHover={{ scale: status !== "success" ? 1.05 : 1 }}
            whileTap={{ scale: status !== "success" ? 0.95 : 1 }}
            disabled={status === "success"}
          >
            {status === "success" ? (
              <span className="hidden md:block">✓ Sent!</span>
            ) : (
              <>
                <span className="hidden md:block">
                  {typeof buttonText === "string" ? buttonText : "Get Started"}
                </span>
                <SendHorizonal
                  className="relative mx-auto size-5 md:hidden"
                  strokeWidth={2}
                />
              </>
            )}
          </motion.button>
        </div>
      </div>

      {status === "error" && (
        <p className="mt-2 text-sm text-red-500">
          Please enter a valid email address
        </p>
      )}
    </form>
  );
}
