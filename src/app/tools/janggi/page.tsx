import Header from "@/components/Header";
import JanggiGame from "@/components/tools/JanggiGame";

export default function JanggiPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <JanggiGame />
      </main>
    </>
  );
}
