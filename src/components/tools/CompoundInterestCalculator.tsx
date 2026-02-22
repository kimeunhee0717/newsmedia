"use client";

import { useMemo, useState } from "react";

function toWon(manWon: number) {
  return Math.round(manWon * 10000);
}

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function CompoundInterestCalculator() {
  const [initialManWon, setInitialManWon] = useState(1000);
  const [monthlyManWon, setMonthlyManWon] = useState(50);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(20);

  const result = useMemo(() => {
    const initial = toWon(initialManWon);
    const monthly = toWon(monthlyManWon);
    const totalMonths = years * 12;
    const monthlyRate = annualRate / 100 / 12;

    let balance = initial;
    for (let month = 0; month < totalMonths; month += 1) {
      balance = balance * (1 + monthlyRate) + monthly;
    }

    const totalInvested = initial + monthly * totalMonths;
    const totalInterest = balance - totalInvested;
    const multiple = totalInvested > 0 ? balance / totalInvested : 0;

    return {
      finalAmount: Math.round(balance),
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(totalInterest),
      multiple,
    };
  }, [initialManWon, monthlyManWon, annualRate, years]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">복리 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">부자타임의 핵심 복리 도구를 현재 프로젝트 톤으로 이식했습니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            초기 투자금(만원)
            <input
              type="number"
              min={0}
              value={initialManWon}
              onChange={(event) => setInitialManWon(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            월 적립금(만원)
            <input
              type="number"
              min={0}
              value={monthlyManWon}
              onChange={(event) => setMonthlyManWon(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            연 수익률(%)
            <input
              type="number"
              min={0}
              step={0.1}
              value={annualRate}
              onChange={(event) => setAnnualRate(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            투자 기간(년)
            <input
              type="number"
              min={1}
              value={years}
              onChange={(event) => setYears(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">최종 자산</p>
          <p className="mt-1 text-3xl font-bold text-[var(--tools-primary-strong)]">{formatWon(result.finalAmount)}</p>
          <p className="mt-3 text-sm text-[var(--tools-muted)]">총 투자금: {formatWon(result.totalInvested)}</p>
          <p className="text-sm text-[var(--tools-muted)]">총 이자수익: {formatWon(result.totalInterest)}</p>
        </div>
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">복리 배수</p>
          <p className="mt-1 text-3xl font-bold text-[var(--tools-primary-strong)]">{result.multiple.toFixed(2)}배</p>
          <p className="mt-3 text-sm text-[var(--tools-muted)]">월복리 기준(매월 이자 적용 후 적립)</p>
        </div>
      </div>
    </section>
  );
}
