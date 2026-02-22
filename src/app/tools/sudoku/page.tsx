import Header from "@/components/Header";
import { SudokuGame } from "@/components/tools/SudokuGame";

export default function SudokuPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <SudokuGame />
      </main>
    </>
  );
}
