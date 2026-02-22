import Header from "@/components/Header";
import { ElectricityCalculator } from "@/components/tools/ElectricityCalculator";

export default function ElectricityPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <ElectricityCalculator />
      </main>
    </>
  );
}
