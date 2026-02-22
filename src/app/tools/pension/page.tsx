import Header from "@/components/Header";
import { PensionCalculator } from "@/components/tools/PensionCalculator";

export default function PensionPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <PensionCalculator />
      </main>
    </>
  );
}
