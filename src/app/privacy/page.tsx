import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "AI 도구 리뷰 블로그의 개인정보처리방침입니다.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">개인정보처리방침</h1>
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
          <p><strong>시행일:</strong> 2026년 2월 22일</p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">1. 수집하는 개인정보 항목</h2>
          <p>
            본 블로그(&ldquo;AI 도구 리뷰 블로그&rdquo;, 이하 &ldquo;사이트&rdquo;)는 서비스 제공을 위해 아래와 같은 정보를 수집할 수 있습니다.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>회원가입 시: 이메일 주소, 이름(닉네임)</li>
            <li>자동 수집: 접속 IP, 브라우저 종류, 방문 일시, 쿠키 정보</li>
            <li>Google Analytics를 통한 익명화된 사용 통계</li>
            <li>Google AdSense를 통한 광고 쿠키</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">2. 개인정보의 수집 및 이용 목적</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>서비스 제공 및 회원 관리</li>
            <li>콘텐츠 이용 통계 분석</li>
            <li>맞춤형 광고 제공 (Google AdSense)</li>
            <li>사이트 개선 및 사용자 경험 향상</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">3. 쿠키(Cookie) 사용</h2>
          <p>
            본 사이트는 Google AdSense 및 Google Analytics를 사용하며, 이 과정에서 쿠키가 사용됩니다.
            쿠키는 사용자의 브라우저에 저장되는 작은 텍스트 파일로, 사이트 이용 패턴을 분석하고 맞춤형 광고를 제공하는 데 활용됩니다.
          </p>
          <p>
            사용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">4. Google AdSense 및 제3자 광고</h2>
          <p>
            본 사이트는 Google AdSense를 통해 광고를 게재합니다. Google은 사용자의 관심사에 기반한 광고를 표시하기 위해 
            DART 쿠키를 사용할 수 있습니다. 사용자는{" "}
            <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Google 광고 설정
            </a>
            에서 맞춤 광고를 비활성화할 수 있습니다.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">5. 개인정보의 보유 및 파기</h2>
          <p>
            회원 탈퇴 시 개인정보는 즉시 파기됩니다. 단, 관련 법령에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">6. 개인정보의 제3자 제공</h2>
          <p>
            본 사이트는 원칙적으로 사용자의 개인정보를 제3자에게 제공하지 않습니다. 
            다만, 법령에 의한 요구가 있는 경우에는 예외로 합니다.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">7. 이용자의 권리</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>개인정보 열람, 수정, 삭제 요청 가능</li>
            <li>회원 탈퇴를 통한 개인정보 삭제</li>
            <li>쿠키 거부 설정</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">8. 문의</h2>
          <p>
            개인정보 관련 문의는 아래 이메일로 연락해 주시기 바랍니다.
          </p>
          <p><strong>이메일:</strong> contact@ai-review-blog.com</p>

          <p className="mt-8 text-sm text-gray-400">본 방침은 2026년 2월 22일부터 시행됩니다.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
