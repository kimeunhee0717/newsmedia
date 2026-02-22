"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          AI 도구 리뷰
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-gray-600 transition hover:text-blue-600">
            홈
          </Link>
          <Link href="/tools" className="text-gray-600 transition hover:text-blue-600">
            유용한 도구
          </Link>
          {isSignedIn && (
            <Link href="/dashboard" className="text-gray-600 transition hover:text-blue-600">
              글쓰기
            </Link>
          )}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-gray-600 transition hover:text-blue-600">로그인</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
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
