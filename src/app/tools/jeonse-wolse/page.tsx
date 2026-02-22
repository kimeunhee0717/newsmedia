import Header from "@/components/Header";
import { JeonseWolseCalculator } from "@/components/tools/JeonseWolseCalculator";

export default function JeonseWolsePage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <JeonseWolseCalculator />
      </main>
    </>
  );
}
