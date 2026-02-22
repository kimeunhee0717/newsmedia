import Header from "@/components/Header";
import { ChildCostCalculator } from "@/components/tools/ChildCostCalculator";

export default function ChildCostPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <ChildCostCalculator />
      </main>
    </>
  );
}
