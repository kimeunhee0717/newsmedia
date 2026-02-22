import Header from "@/components/Header";
import { HourlyWageCalculator } from "@/components/tools/HourlyWageCalculator";

export default function HourlyWagePage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <HourlyWageCalculator />
      </main>
    </>
  );
}
