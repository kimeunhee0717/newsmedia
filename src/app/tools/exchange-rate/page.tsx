import Header from "@/components/Header";
import { ExchangeRateCalculator } from "@/components/tools/ExchangeRateCalculator";

export default function ExchangeRatePage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <ExchangeRateCalculator />
      </main>
    </>
  );
}
