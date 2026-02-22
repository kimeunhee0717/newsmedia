import Header from "@/components/Header";
import { RetirementCalculator } from "@/components/tools/RetirementCalculator";

export default function RetirementPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <RetirementCalculator />
      </main>
    </>
  );
}
