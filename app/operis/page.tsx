import type { Metadata } from "next";
import { OperisPageShell } from "./components/OperisPageShell";

export const metadata: Metadata = {
  title: "Operis | Detachering voor Operations en Logistiek",
  description:
    "Operis levert premium detachering voor Operations, Control Room, Planning en Operational Management.",
};

export default function OperisPage() {
  return <OperisPageShell />;
}
