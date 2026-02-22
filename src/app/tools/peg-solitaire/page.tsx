import Header from "@/components/Header";
import { PegSolitaireGame } from "@/components/tools/PegSolitaireGame";

export default function PegSolitairePage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <PegSolitaireGame />
      </main>
    </>
  );
}
