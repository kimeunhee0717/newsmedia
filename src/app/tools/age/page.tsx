import Header from "@/components/Header";
import { AgeCalculator } from "@/components/tools/AgeCalculator";

export default function AgePage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <AgeCalculator />
      </main>
    </>
  );
}
