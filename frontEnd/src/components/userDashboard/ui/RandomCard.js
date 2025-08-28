import React from "react";
import clsx from "clsx";

export function Card({ className, children }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-gray-200 bg-white shadow-md p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={clsx("mb-4", className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={clsx("text-lg font-semibold text-gray-900", className)}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children }) {
  return <div className={clsx("text-gray-700", className)}>{children}</div>;
}
