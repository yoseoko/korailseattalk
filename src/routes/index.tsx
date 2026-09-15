import { createFileRoute } from "@tanstack/react-router";
import { SeatBoard } from "@/components/seat-board";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <SeatBoard />;
}
