import Header from "@/components/Header";
import { IncomeTaxCalculator } from "@/components/tools/IncomeTaxCalculator";

export default function IncomeTaxPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <IncomeTaxCalculator />
      </main>
    </>
  );
}
