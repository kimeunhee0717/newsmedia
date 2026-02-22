import Header from "@/components/Header";
import { VatCalculator } from "@/components/tools/VatCalculator";

export default function VatPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <VatCalculator />
      </main>
    </>
  );
}
