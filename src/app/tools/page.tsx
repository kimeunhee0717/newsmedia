import Link from "next/link";
import Header from "@/components/Header";

type ToolCard = {
  name: string;
  description: string;
  href: string;
  badge: string;
};

const tools: ToolCard[] = [
  {
    name: "마크다운 뷰어 및 편집기",
    description: "마크다운 작성, 실시간 미리보기, 복사와 파일 저장을 한 번에 처리합니다.",
    href: "/markdown-editor.html",
    badge: "문서",
  },
  {
    name: "복리 계산기",
    description: "초기금, 적립금, 수익률로 장기 복리 효과를 확인합니다.",
    href: "/tools/compound-interest",
    badge: "재테크",
  },
  {
    name: "대출이자 계산기",
    description: "원리금균등, 원금균등, 만기일시 상환을 비교합니다.",
    href: "/tools/loan-interest",
    badge: "부채",
  },
  {
    name: "적금/예금 계산기",
    description: "단리·복리와 과세 옵션까지 반영해 만기 수령액을 계산합니다.",
    href: "/tools/savings",
    badge: "저축",
  },
  {
    name: "시급 변환 계산기",
    description: "시급, 주급, 월급, 연봉을 상호 변환하고 기준 소득을 비교합니다.",
    href: "/tools/hourly-wage",
    badge: "근로",
  },
  {
    name: "연금 계산기",
    description: "국민연금 예상액과 개인연금 수령 시뮬레이션을 계산합니다.",
    href: "/tools/pension",
    badge: "노후",
  },
  {
    name: "퇴직금 계산기",
    description: "재직기간과 급여 입력으로 예상 퇴직금을 계산합니다.",
    href: "/tools/severance",
    badge: "노동",
  },
  {
    name: "주식 수익률 계산기",
    description: "매매 수수료, 거래세, 배당 영향을 반영해 수익률을 계산합니다.",
    href: "/tools/stock-return",
    badge: "투자",
  },
  {
    name: "전월세 전환 계산기",
    description: "전세와 월세를 전환 기준으로 상호 변환합니다.",
    href: "/tools/jeonse-wolse",
    badge: "부동산",
  },
  {
    name: "전기요금 계산기",
    description: "누진제 구간과 부가요금을 반영해 주택용 전기요금을 계산합니다.",
    href: "/tools/electricity",
    badge: "생활비",
  },
  {
    name: "종합소득세 계산기",
    description: "소득, 경비, 공제를 넣어 종합소득세를 간편 추정합니다.",
    href: "/tools/income-tax",
    badge: "세무",
  },
  {
    name: "자동차 유지비 계산기",
    description: "연료비, 보험, 세금, 감가상각까지 연간 차량비용을 계산합니다.",
    href: "/tools/car-cost",
    badge: "자동차",
  },
  {
    name: "노후자금 계산기",
    description: "목표 생활비와 물가, 수익률을 반영해 필요자금을 계산합니다.",
    href: "/tools/retirement",
    badge: "노후",
  },
  {
    name: "연봉 실수령액 계산기",
    description: "4대 보험과 소득세를 반영해 월 실수령액을 계산합니다.",
    href: "/tools/salary",
    badge: "급여",
  },
  {
    name: "대출 갈아타기 비교기",
    description: "기존 대출과 신규 대출의 이자 절감액과 비용을 계산합니다.",
    href: "/tools/loan-refinance",
    badge: "대출",
  },
  {
    name: "양육비용 계산기",
    description: "출생부터 성인까지 양육비를 단계별로 시뮬레이션합니다.",
    href: "/tools/child-cost",
    badge: "가정",
  },
  {
    name: "부동산 수익률 계산기",
    description: "매입, 임대, 매각 시나리오를 기반으로 ROI를 분석합니다.",
    href: "/tools/real-estate",
    badge: "투자",
  },
  {
    name: "BMI 계산기",
    description: "키와 몸무게로 BMI를 계산하고 체중 범위를 확인합니다.",
    href: "/tools/bmi",
    badge: "건강",
  },
  {
    name: "만 나이 계산기",
    description: "생년월일 기준 만 나이와 다음 생일까지 남은 일수를 보여줍니다.",
    href: "/tools/age",
    badge: "생활",
  },
  {
    name: "부가세 계산기",
    description: "공급가액, VAT, 합계를 상호 변환해 빠르게 계산합니다.",
    href: "/tools/vat",
    badge: "비즈니스",
  },
  {
    name: "환율 계산기",
    description: "주요 통화 간 환율 기준으로 금액을 변환합니다.",
    href: "/tools/exchange-rate",
    badge: "환전",
  },
  {
    name: "스도쿠",
    description: "숫자 중복 규칙을 지키며 9x9 퍼즐을 완성하는 두뇌 게임입니다.",
    href: "/tools/sudoku",
    badge: "퍼즐",
  },
  {
    name: "페그 솔리테어",
    description: "핀 점프 규칙으로 말을 제거해 마지막 1개를 남기는 고전 퍼즐입니다.",
    href: "/tools/peg-solitaire",
    badge: "게임",
  },
  {
    name: "오목",
    description: "15x15 보드에서 2인 또는 AI와 5목 승부를 플레이합니다.",
    href: "/tools/gomoku",
    badge: "보드",
  },
  {
    name: "체스",
    description: "간편 규칙 기반 체스 보드와 기보 기록 기능을 제공합니다.",
    href: "/tools/chess",
    badge: "보드",
  },
  {
    name: "장기",
    description: "배치 선택, AI 대전, 무르기, 사운드 기능을 제공하는 장기 게임입니다.",
    href: "/tools/janggi",
    badge: "보드",
  },
  {
    name: "바둑",
    description: "13x13 보드, AI 대전, 집계산/덤 기능을 제공하는 바둑 게임입니다.",
    href: "/tools/baduk",
    badge: "보드",
  },
];

const boardBadges = new Set(["보드", "게임", "퍼즐"]);
const boardTools = tools.filter((tool) => boardBadges.has(tool.badge));
const utilityTools = tools.filter((tool) => !boardBadges.has(tool.badge));

export default function ToolsPage() {
  return (
    <>
      <Header />
      <main className="tools-shell min-h-screen">
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-8">
            <span className="inline-flex rounded-full bg-[var(--tools-primary)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--tools-primary)]">
              유용한 도구
            </span>
            <h1 className="mt-4 text-3xl font-bold text-[var(--tools-primary-strong)]">
              유용한 도구 허브
            </h1>
            <p className="mt-2 text-[var(--tools-muted)]">
              블로그 본문과 충돌하지 않도록 도구 전용 영역으로 분리했습니다.
            </p>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            <span className="inline-flex rounded-full bg-[var(--tools-accent)]/20 px-3 py-1 text-xs font-bold text-[var(--tools-primary-strong)]">
              카테고리: 계산/생활
            </span>
            <span className="inline-flex rounded-full bg-[var(--tools-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--tools-primary-strong)]">
              카테고리: 보드/게임
            </span>
          </div>

          <h2 className="mb-3 text-lg font-bold text-[var(--tools-primary-strong)]">보드/게임 도구</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boardTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl border border-[var(--tools-border)] bg-[var(--tools-card)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="inline-flex rounded-full bg-[var(--tools-accent)]/15 px-2.5 py-1 text-xs font-bold text-[var(--tools-primary-strong)]">
                  {tool.badge}
                </span>
                <h2 className="mt-3 text-xl font-semibold text-[var(--tools-primary-strong)]">
                  {tool.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--tools-muted)]">
                  {tool.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-[var(--tools-primary)] group-hover:text-[var(--tools-primary-strong)]">
                  바로 사용하기
                </p>
              </Link>
            ))}
          </div>

          <h2 className="mb-3 mt-8 text-lg font-bold text-[var(--tools-primary-strong)]">계산/생활 도구</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {utilityTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl border border-[var(--tools-border)] bg-[var(--tools-card)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="inline-flex rounded-full bg-[var(--tools-accent)]/15 px-2.5 py-1 text-xs font-bold text-[var(--tools-primary-strong)]">
                  {tool.badge}
                </span>
                <h2 className="mt-3 text-xl font-semibold text-[var(--tools-primary-strong)]">
                  {tool.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--tools-muted)]">
                  {tool.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-[var(--tools-primary)] group-hover:text-[var(--tools-primary-strong)]">
                  바로 사용하기
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
