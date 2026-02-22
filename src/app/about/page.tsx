import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "소개 및 문의",
  description: "AI 도구 리뷰 블로그 소개와 문의 안내입니다.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="mx-auto max-w-4xl px-4 py-12 text-gray-800">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">소개 및 문의</h1>

          <div className="space-y-10 leading-8">
            <section>
              <h2 className="mb-3 text-2xl font-semibold text-gray-900">AI 도구 리뷰 블로그란?</h2>
              <p>
                AI 도구 리뷰 블로그는 최신 AI 도구와 디지털 서비스를 실제로 사용해 본 뒤,
                실무와 일상에서 도움이 되는 방식으로 정리해 공유하는 공간입니다.
              </p>
              <p className="mt-3">
                복잡한 기술 설명보다는 바로 적용 가능한 사용 방법, 장단점, 추천 대상을 중심으로
                쉽고 명확한 정보를 제공합니다.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-gray-900">운영 원칙</h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>실사용 기반 리뷰 작성</li>
                <li>핵심 내용 위주의 간결한 설명</li>
                <li>초보자도 이해할 수 있는 용어 사용</li>
                <li>실제 활용성을 우선한 콘텐츠 구성</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-2xl font-semibold text-gray-900">문의</h2>
              <p>콘텐츠 제안, 제휴, 오류 제보는 아래 이메일로 연락 부탁드립니다.</p>
              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-blue-900">
                contact@ai-review-blog.com
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
