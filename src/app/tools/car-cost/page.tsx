import Header from "@/components/Header";
import { CarCostCalculator } from "@/components/tools/CarCostCalculator";

export default function CarCostPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <CarCostCalculator />
      </main>
    </>
  );
}
