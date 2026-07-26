"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function PrintShortcut({
  route
}: {
  route: string
}) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isPrintShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "p";

      if (!isPrintShortcut) return;

      event.preventDefault();

      window.open(route, "_blank", "noopener,noreferrer");
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return null;
}