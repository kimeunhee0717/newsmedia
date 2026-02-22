import Header from "@/components/Header";
import { ChessGame } from "@/components/tools/ChessGame";

export default function ChessPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <ChessGame />
      </main>
    </>
  );
}
