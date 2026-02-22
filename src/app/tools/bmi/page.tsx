import Header from "@/components/Header";
import { BmiCalculator } from "@/components/tools/BmiCalculator";

export default function BmiPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <BmiCalculator />
      </main>
    </>
  );
}
