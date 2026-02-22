import Header from "@/components/Header";
import { SeveranceCalculator } from "@/components/tools/SeveranceCalculator";

export default function SeverancePage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <SeveranceCalculator />
      </main>
    </>
  );
}
