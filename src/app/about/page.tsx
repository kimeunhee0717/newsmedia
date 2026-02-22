import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소개 및 문의",
  description: "AI 도구 리뷰 블로그 소개와 문의 안내입니다.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">소개 및 문의</h1>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          {/* 사이트 소개 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">🤖 AI 도구 리뷰 블로그란?</h2>
            <p className="mb-3">
              AI 도구 리뷰 블로그는 <strong>최신 AI 도구와 디지털 서비스를 직접 사용해보고 솔직하게 리뷰</strong>하는 블로그입니다.
            </p>
            <p className="mb-3">
              ChatGPT, Gemini, Midjourney부터 생산성 도구, 재테크 앱까지 — 직접 체험한 후기와 실질적인 활용법을 공유합니다.
              비전공자도 쉽게 이해할 수 있도록 친절하게 설명하는 것이 저희의 원칙입니다.
            </p>
          </section>

          {/* 운영 목적 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">📌 운영 목적</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>솔직한 리뷰</strong> — 광고가 아닌 실사용 후기를 기반으로 작성합니다</li>
              <li><strong>실용적인 정보</strong> — 읽고 바로 실천할 수 있는 가이드를 제공합니다</li>
              <li><strong>누구나 이해 가능</strong> — 전문 용어를 최소화하고 쉬운 말로 설명합니다</li>
              <li><strong>다양한 주제</strong> — AI, 디지털 라이프, 재테크, 생활 정보를 폭넓게 다룹니다</li>
            </ul>
          </section>

          {/* 카테고리 소개 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">📂 카테고리 소개</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-blue-600">🔧 디지털라이프</h3>
                <p className="mt-1 text-sm">스마트폰, PC, 앱 활용법 등 디지털 생활 팁</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-purple-600">🤖 AI소식</h3>
                <p className="mt-1 text-sm">AI 도구 리뷰, 비교, 활용법, 최신 소식</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-green-600">💰 재테크</h3>
                <p className="mt-1 text-sm">절약, 투자, 부업, 자산 관리 실전 정보</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-orange-600">📰 브리핑</h3>
                <p className="mt-1 text-sm">주간 뉴스 요약, 트렌드, 생활 정보 정리</p>
              </div>
            </div>
          </section>

          {/* 문의 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">📧 문의하기</h2>
            <p className="mb-3">
              콘텐츠 관련 문의, 협업 제안, 오류 신고 등은 아래 이메일로 연락해 주시기 바랍니다.
            </p>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <p className="text-lg font-medium text-blue-800">📮 contact@ai-review-blog.com</p>
              <p className="mt-2 text-sm text-blue-600">영업일 기준 2~3일 이내에 답변드리겠습니다.</p>
            </div>
          </section>

          {/* 광고 안내 */}
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">📢 광고 안내</h2>
            <p>
              본 블로그는 Google AdSense를 통한 광고 수익으로 운영됩니다.
              광고는 콘텐츠의 객관성에 영향을 주지 않으며, 모든 리뷰는 개인적인 사용 경험을 바탕으로 작성됩니다.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
