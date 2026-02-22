import Header from "@/components/Header";
import { StockReturnCalculator } from "@/components/tools/StockReturnCalculator";

export default function StockReturnPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <StockReturnCalculator />
      </main>
    </>
  );
}
