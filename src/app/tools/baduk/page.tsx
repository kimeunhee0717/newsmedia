import Header from "@/components/Header";
import BadukGame from "@/components/tools/BadukGame";

export default function BadukPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <BadukGame />
      </main>
    </>
  );
}
