import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "이용약관",
  description: "AI 도구 리뷰 블로그 이용약관입니다.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="mx-auto max-w-4xl px-4 py-12 text-gray-800">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">이용약관</h1>
          <p className="mb-8 text-sm text-gray-500">시행일: 2026년 2월 22일</p>

          <div className="space-y-8 leading-8">
            <section>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">1. 목적</h2>
              <p>
                본 약관은 AI 도구 리뷰 블로그가 제공하는 서비스의 이용 조건과 운영 기준을 규정하는 것을
                목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">2. 서비스 내용</h2>
              <p>
                사이트는 AI 도구 리뷰, 활용 가이드, 유용한 도구 페이지 등 정보성 콘텐츠를 제공합니다.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">3. 면책 사항</h2>
              <p>
                본 사이트의 정보는 참고용이며, 특정 결과를 보장하지 않습니다. 투자, 법률, 세무 등 전문
                판단이 필요한 경우 별도의 전문가 상담을 권장합니다.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">4. 저작권</h2>
              <p>
                사이트 내 콘텐츠의 저작권은 운영자에게 있으며, 사전 동의 없는 무단 복제 및 배포를 금합니다.
                인용 시 출처를 명확히 밝혀야 합니다.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">5. 약관 변경</h2>
              <p>
                운영 정책 또는 관련 법령 변경 시 약관이 개정될 수 있으며, 변경 사항은 사이트에 공지됩니다.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">6. 문의처</h2>
              <p>서비스 관련 문의는 아래 이메일로 접수해 주시기 바랍니다.</p>
              <p className="mt-2 font-medium text-gray-900">contact@ai-review-blog.com</p>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
