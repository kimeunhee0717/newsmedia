"use client";

import { useMemo, useState } from "react";

type Stage = {
  age: number;
  label: string;
  stage: string;
  food: number;
  clothing: number;
  medical: number;
  education: number;
  childcare: number;
  etc: number;
};

const baseData: Stage[] = [
  { age: 0, label: "신생아", stage: "영아기", food: 120, clothing: 60, medical: 80, education: 0, childcare: 120, etc: 100 },
  { age: 1, label: "1세", stage: "영아기", food: 100, clothing: 50, medical: 60, education: 0, childcare: 140, etc: 80 },
  { age: 2, label: "2세", stage: "영아기", food: 100, clothing: 50, medical: 50, education: 0, childcare: 140, etc: 80 },
  { age: 3, label: "3세", stage: "유아기", food: 100, clothing: 50, medical: 40, education: 50, childcare: 120, etc: 70 },
  { age: 4, label: "4세", stage: "유아기", food: 100, clothing: 50, medical: 40, education: 80, childcare: 120, etc: 70 },
  { age: 5, label: "5세", stage: "유아기", food: 100, clothing: 50, medical: 40, education: 80, childcare: 120, etc: 70 },
  { age: 6, label: "6세", stage: "유아기", food: 100, clothing: 50, medical: 40, education: 100, childcare: 100, etc: 70 },
  { age: 7, label: "초1", stage: "초등", food: 120, clothing: 50, medical: 30, education: 150, childcare: 60, etc: 80 },
  { age: 10, label: "초4", stage: "초등", food: 130, clothing: 60, medical: 30, education: 250, childcare: 50, etc: 90 },
  { age: 13, label: "중1", stage: "중등", food: 150, clothing: 70, medical: 30, education: 350, childcare: 0, etc: 120 },
  { age: 16, label: "고1", stage: "고등", food: 160, clothing: 80, medical: 30, education: 450, childcare: 0, etc: 150 },
  { age: 19, label: "대1", stage: "대학", food: 150, clothing: 80, medical: 30, education: 800, childcare: 0, etc: 200 },
  { age: 22, label: "대4", stage: "대학", food: 150, clothing: 80, medical: 30, education: 800, childcare: 0, etc: 200 },
];

function formatManWon(value: number) {
  if (Math.abs(value) >= 10000) {
    const eok = Math.floor(value / 10000);
    const man = Math.round(value % 10000);
    return man > 0 ? `${eok.toLocaleString("ko-KR")}억 ${man.toLocaleString("ko-KR")}만원` : `${eok.toLocaleString("ko-KR")}억원`;
  }
  return `${Math.round(value).toLocaleString("ko-KR")}만원`;
}

export function ChildCostCalculator() {
  const [children, setChildren] = useState(1);
  const [inflation, setInflation] = useState(3);
  const [multiplier, setMultiplier] = useState(1);
  const [untilAge, setUntilAge] = useState(22);

  const result = useMemo(() => {
    const yearly = baseData
      .filter((item) => item.age <= untilAge)
      .map((item) => {
        const inf = (1 + inflation / 100) ** item.age;
        const total =
          (item.food + item.clothing + item.medical + item.education + item.childcare + item.etc) *
          inf *
          multiplier *
          children;
        return {
          ...item,
          total: Math.round(total),
        };
      });

    const total = yearly.reduce((sum, item) => sum + item.total, 0);
    const monthlyAvg = total / Math.max(1, (untilAge + 1) * 12);

    const stageTotals = Array.from(new Set(yearly.map((item) => item.stage))).map((stage) => ({
      stage,
      total: yearly.filter((item) => item.stage === stage).reduce((sum, item) => sum + item.total, 0),
    }));

    return {
      yearly,
      total,
      monthlyAvg,
      stageTotals,
    };
  }, [children, inflation, multiplier, untilAge]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">자녀비용 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">출생부터 대학까지 예상 양육비를 단계별로 계산합니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">자녀 수<input type="number" min={1} value={children} onChange={(e) => setChildren(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">계산 종료 나이<input type="number" min={0} max={22} value={untilAge} onChange={(e) => setUntilAge(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">물가상승률(%)<input type="number" step="0.1" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">생활수준 배율<input type="number" step="0.1" min={0.1} value={multiplier} onChange={(e) => setMultiplier(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">총 예상비용(0~{untilAge}세)</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatManWon(result.total)}</p>
          <p className="mt-2 text-sm text-[var(--tools-muted)]">월평균 {formatManWon(result.monthlyAvg)}</p>
        </div>
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">단계별 비용</p>
          {result.stageTotals.map((stage) => (
            <p key={stage.stage} className="mt-1 text-sm text-[var(--tools-muted)]">
              {stage.stage}: <strong className="text-[var(--tools-primary-strong)]">{formatManWon(stage.total)}</strong>
            </p>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <p className="text-sm font-semibold text-[var(--tools-muted)]">연령 포인트</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {result.yearly.map((item) => (
            <div key={item.age} className="rounded-lg bg-[var(--tools-bg-end)] px-3 py-2 text-sm text-[var(--tools-muted)]">
              {item.label} ({item.stage}): <strong className="text-[var(--tools-primary-strong)]">{formatManWon(item.total)}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
