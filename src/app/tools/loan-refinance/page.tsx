import Header from "@/components/Header";
import { LoanRefinanceCalculator } from "@/components/tools/LoanRefinanceCalculator";

export default function LoanRefinancePage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <LoanRefinanceCalculator />
      </main>
    </>
  );
}
