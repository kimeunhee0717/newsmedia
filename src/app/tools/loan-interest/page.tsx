import Header from "@/components/Header";
import { LoanInterestCalculator } from "@/components/tools/LoanInterestCalculator";

export default function LoanInterestPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <LoanInterestCalculator />
      </main>
    </>
  );
}
