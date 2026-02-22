import Header from "@/components/Header";
import { RealEstateCalculator } from "@/components/tools/RealEstateCalculator";

export default function RealEstatePage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <RealEstateCalculator />
      </main>
    </>
  );
}
