import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description: "AI 도구 리뷰 블로그의 이용약관입니다.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">이용약관</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
          <p><strong>시행일:</strong> 2026년 2월 22일</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">제1조 (목적)</h2>
          <p>
            본 약관은 &ldquo;AI 도구 리뷰 블로그&rdquo;(이하 &ldquo;사이트&rdquo;)가 제공하는 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">제2조 (서비스 내용)</h2>
          <p>본 사이트는 다음과 같은 서비스를 제공합니다.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>AI 도구 및 디지털 서비스에 대한 리뷰 콘텐츠</li>
            <li>재테크, 디지털 라이프 관련 정보 콘텐츠</li>
            <li>주간/월간 브리핑 콘텐츠</li>
            <li>유용한 온라인 도구(계산기 등)</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">제3조 (면책 조항)</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>본 사이트에 게시된 콘텐츠는 정보 제공 목적이며, 전문적인 조언을 대체하지 않습니다.</li>
            <li>재테크 관련 콘텐츠는 투자 권유가 아니며, 투자 결과에 대한 책임은 본인에게 있습니다.</li>
            <li>AI 도구 리뷰는 작성 시점 기준이며, 이후 변경된 사항이 있을 수 있습니다.</li>
            <li>외부 링크를 통해 연결되는 사이트에 대해서는 책임을 지지 않습니다.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">제4조 (저작권)</h2>
          <p>
            본 사이트에 게시된 모든 콘텐츠(글, 이미지, 디자인 등)의 저작권은 사이트 운영자에게 있습니다.
            무단 복제, 배포, 전송을 금지하며, 인용 시 출처를 명시해야 합니다.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">제5조 (이용자의 의무)</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>타인의 개인정보를 침해하는 행위를 금지합니다.</li>
            <li>사이트의 정상적인 운영을 방해하는 행위를 금지합니다.</li>
            <li>불법적인 목적으로 서비스를 이용하는 행위를 금지합니다.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">제6조 (광고)</h2>
          <p>
            본 사이트는 Google AdSense 등을 통해 광고를 게재하며, 이를 통해 수익을 얻을 수 있습니다.
            광고 콘텐츠는 사이트 운영자의 의견과 다를 수 있습니다.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">제7조 (약관의 변경)</h2>
          <p>
            본 약관은 필요에 따라 변경될 수 있으며, 변경 시 사이트 내 공지를 통해 알려드립니다.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">제8조 (문의)</h2>
          <p>
            서비스 이용 관련 문의는 아래 이메일로 연락해 주시기 바랍니다.
          </p>
          <p><strong>이메일:</strong> contact@ai-review-blog.com</p>

          <p className="mt-8 text-sm text-gray-400">본 약관은 2026년 2월 22일부터 시행됩니다.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
