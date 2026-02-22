import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "AI 도구 리뷰 블로그 개인정보처리방침입니다.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="mx-auto max-w-4xl px-4 py-12 text-gray-800">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">개인정보처리방침</h1>
          <p className="mb-8 text-sm text-gray-500">시행일: 2026년 2월 22일</p>

          <div className="space-y-8 leading-8">
            <section>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">1. 수집하는 정보</h2>
              <p>
                서비스 이용 과정에서 계정 정보, 접속 기록, 브라우저 정보 등 서비스 운영에 필요한 최소
                정보를 수집할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">2. 정보 이용 목적</h2>
              <p>
                수집된 정보는 회원 식별, 서비스 개선, 보안 대응, 통계 분석 및 맞춤형 콘텐츠 제공을 위해
                사용됩니다.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">3. 쿠키 사용</h2>
              <p>
                사이트는 서비스 품질 개선과 이용 통계를 위해 쿠키를 사용할 수 있습니다. 이용자는 브라우저
                설정에서 쿠키 저장을 거부할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">4. 정보 보관 및 파기</h2>
              <p>
                개인정보는 수집 목적 달성 시 지체 없이 파기하며, 관련 법령에 따라 일정 기간 보관이 필요한
                경우 해당 기간 동안만 안전하게 보관합니다.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">5. 문의처</h2>
              <p>개인정보 관련 문의는 아래 이메일로 접수해 주시기 바랍니다.</p>
              <p className="mt-2 font-medium text-gray-900">contact@ai-review-blog.com</p>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
