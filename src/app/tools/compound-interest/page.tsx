import Header from "@/components/Header";
import { CompoundInterestCalculator } from "@/components/tools/CompoundInterestCalculator";

export default function CompoundInterestPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <CompoundInterestCalculator />
      </main>
    </>
  );
}
