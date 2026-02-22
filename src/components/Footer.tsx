import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-gray-700">AI Tool Review</p>
          <p className="mt-1">Practical reviews, useful tools, and clear guides.</p>
        </div>

        <nav className="flex flex-wrap items-center gap-4">
          <Link href="/about" className="transition hover:text-blue-600">
            소개
          </Link>
          <Link href="/terms" className="transition hover:text-blue-600">
            이용약관
          </Link>
          <Link href="/privacy" className="transition hover:text-blue-600">
            개인정보처리방침
          </Link>
          <Link href="/feed.xml" className="transition hover:text-blue-600">
            RSS
          </Link>
        </nav>
      </div>

      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-gray-400">
          © {new Date().getFullYear()} AI Tool Review. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
