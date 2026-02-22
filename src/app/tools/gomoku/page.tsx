import Header from "@/components/Header";
import GomokuGame from "@/components/tools/GomokuGame";

export default function GomokuPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <GomokuGame />
      </main>
    </>
  );
}
