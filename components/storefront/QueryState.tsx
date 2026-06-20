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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/60 px-6 py-14 text-center">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <p className="text-sm font-medium text-red-700">
        {message ?? "Something went wrong while loading this content."}
      </p>
      {onRetry ? (
        <Button
          variant="outline"
          size="sm"
          className="mt-5"
          onClick={onRetry}
        >
          <RefreshCw className="h-4 w-4" /> Try again
        </Button>
      ) : null}
    </div>
  );
}
