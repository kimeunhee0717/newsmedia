"use client";

import { useMemo, useState } from "react";

type Mode = "jeonse-to-wolse" | "wolse-to-jeonse";

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function JeonseWolseCalculator() {
  const [mode, setMode] = useState<Mode>("jeonse-to-wolse");
  const [conversionRate, setConversionRate] = useState(4.5);
  const [jeonseMan, setJeonseMan] = useState(30000);
  const [depositMan, setDepositMan] = useState(5000);
  const [wolseDepositMan, setWolseDepositMan] = useState(5000);
  const [monthlyRentMan, setMonthlyRentMan] = useState(80);

  const jeonseToWolse = useMemo(() => {
    const jeonse = jeonseMan * 10000;
    const deposit = depositMan * 10000;
    const rate = conversionRate / 100;
    if (jeonse <= deposit || rate <= 0) return null;
    const monthly = ((jeonse - deposit) * rate) / 12;
    const yearly = monthly * 12;
    return { monthly: Math.round(monthly), yearly: Math.round(yearly), diff: jeonse - deposit };
  }, [jeonseMan, depositMan, conversionRate]);

  const wolseToJeonse = useMemo(() => {
    const deposit = wolseDepositMan * 10000;
    const monthly = monthlyRentMan * 10000;
    const rate = conversionRate / 100;
    if (monthly <= 0 || rate <= 0) return null;
    const converted = (monthly * 12) / rate;
    const total = deposit + converted;
    return {
      converted: Math.round(converted),
      total: Math.round(total),
      yearlyRent: Math.round(monthly * 12),
    };
  }, [wolseDepositMan, monthlyRentMan, conversionRate]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">전월세 전환 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">전세↔월세 전환율로 조건을 빠르게 비교합니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            전환 방향
            <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2">
              <option value="jeonse-to-wolse">전세 → 월세</option>
              <option value="wolse-to-jeonse">월세 → 전세</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            전월세 전환율(%)
            <input type="number" step="0.1" value={conversionRate} onChange={(e) => setConversionRate(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
        </div>

        {mode === "jeonse-to-wolse" ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[var(--tools-muted)]">
              전세금(만원)
              <input type="number" value={jeonseMan} onChange={(e) => setJeonseMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
            </label>
            <label className="text-sm font-semibold text-[var(--tools-muted)]">
              보증금(만원)
              <input type="number" value={depositMan} onChange={(e) => setDepositMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
            </label>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[var(--tools-muted)]">
              현재 보증금(만원)
              <input type="number" value={wolseDepositMan} onChange={(e) => setWolseDepositMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
            </label>
            <label className="text-sm font-semibold text-[var(--tools-muted)]">
              월세(만원)
              <input type="number" value={monthlyRentMan} onChange={(e) => setMonthlyRentMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
            </label>
          </div>
        )}
      </div>

      {mode === "jeonse-to-wolse" ? (
        jeonseToWolse ? (
          <div className="mt-5 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
            <p className="text-sm text-[var(--tools-muted)]">전세 → 월세 결과</p>
            <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">월세 {formatWon(jeonseToWolse.monthly)}</p>
            <p className="mt-2 text-sm text-[var(--tools-muted)]">연 환산 {formatWon(jeonseToWolse.yearly)}</p>
            <p className="text-sm text-[var(--tools-muted)]">전환 대상 금액 {formatWon(jeonseToWolse.diff)}</p>
          </div>
        ) : (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">전세금은 보증금보다 커야 합니다.</p>
        )
      ) : (
        wolseToJeonse && (
          <div className="mt-5 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
            <p className="text-sm text-[var(--tools-muted)]">월세 → 전세 결과</p>
            <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">전세 환산 {formatWon(wolseToJeonse.total)}</p>
            <p className="mt-2 text-sm text-[var(--tools-muted)]">월세 전환분 {formatWon(wolseToJeonse.converted)}</p>
            <p className="text-sm text-[var(--tools-muted)]">연 월세 총액 {formatWon(wolseToJeonse.yearlyRent)}</p>
          </div>
        )
      )}
    </section>
  );
}
