import Header from "@/components/Header";
import { SalaryCalculator } from "@/components/tools/SalaryCalculator";

export default function SalaryPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <SalaryCalculator />
      </main>
    </>
  );
}
