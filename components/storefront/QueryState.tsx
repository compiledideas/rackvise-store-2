"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/** Inline error block with an optional retry button. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center border border-destructive/30 bg-destructive/5 px-6 py-14 text-center">
      <span className="mb-4 flex size-12 items-center justify-center bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </span>
      <p className="text-sm font-medium text-destructive">
        {message ?? "Something went wrong while loading this content."}
      </p>
      {onRetry ? (
        <Button
          variant="outline"
          size="sm"
          className="mt-5"
          onClick={onRetry}
        >
          <RefreshCw /> Try again
        </Button>
      ) : null}
    </div>
  );
}
