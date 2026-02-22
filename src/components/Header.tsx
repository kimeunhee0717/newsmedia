"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          🤖 AI 도구 리뷰
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition">
            홈
          </Link>
          {isSignedIn && (
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition">
              글쓰기
            </Link>
          )}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-gray-600 hover:text-blue-600 transition">
                    로그인
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    회원가입
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
