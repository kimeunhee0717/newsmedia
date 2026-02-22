import Header from "@/components/Header";
import { SavingsCalculator } from "@/components/tools/SavingsCalculator";

export default function SavingsPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <SavingsCalculator />
      </main>
    </>
  );
}
