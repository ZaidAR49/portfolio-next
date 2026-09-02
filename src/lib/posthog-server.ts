import { PostHog } from "posthog-node";

export function getPostHogClient() {
  const isEnabled = process.env.NEXT_PUBLIC_ENABLE_POSTHOG === "true";
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || "disabled";

  const posthogClient = new PostHog(
    token,
    {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
      disabled: !isEnabled,
    }
  );
  return posthogClient;
}

