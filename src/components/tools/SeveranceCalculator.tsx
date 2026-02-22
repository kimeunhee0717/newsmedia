"use client";

import { useMemo, useState } from "react";

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function SeveranceCalculator() {
  const [startDate, setStartDate] = useState("2020-03-01");
  const [endDate, setEndDate] = useState("2026-02-28");
  const [baseSalaryMan, setBaseSalaryMan] = useState(300);
  const [fixedAllowanceMan, setFixedAllowanceMan] = useState(20);
  const [annualBonusMan, setAnnualBonusMan] = useState(600);
  const [unusedLeaveDays, setUnusedLeaveDays] = useState(5);

  const result = useMemo(() => {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return null;
    }

    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const baseSalary = baseSalaryMan * 10000;
    const fixedAllowance = fixedAllowanceMan * 10000;
    const annualBonus = annualBonusMan * 10000;
    const monthlyTotal = baseSalary + fixedAllowance;

    const last3MonthsSalary = monthlyTotal * 3;
    const dailyOrdinary = monthlyTotal / 26.125;
    const bonusFor3Months = (annualBonus / 12) * 3;
    const leaveFor3Months = (unusedLeaveDays * dailyOrdinary / 12) * 3;
    const avgBase = last3MonthsSalary + bonusFor3Months + leaveFor3Months;
    const dailyAverage = avgBase / 91;
    const dailyWage = Math.max(dailyAverage, dailyOrdinary);
    const severance = dailyWage * 30 * (totalDays / 365);

    return {
      totalDays,
      dailyWage: Math.round(dailyWage),
      severance: Math.round(severance),
    };
  }, [startDate, endDate, baseSalaryMan, fixedAllowanceMan, annualBonusMan, unusedLeaveDays]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">퇴직금 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">입사/퇴사일과 급여 정보를 기준으로 예상 퇴직금을 계산합니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            입사일
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            퇴사일
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            월 기본급(만원)
            <input type="number" value={baseSalaryMan} onChange={(e) => setBaseSalaryMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            월 고정수당(만원)
            <input type="number" value={fixedAllowanceMan} onChange={(e) => setFixedAllowanceMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            연간 상여금(만원)
            <input type="number" value={annualBonusMan} onChange={(e) => setAnnualBonusMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            미사용 연차(일)
            <input type="number" value={unusedLeaveDays} onChange={(e) => setUnusedLeaveDays(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
        </div>
      </div>

      {result ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
            <p className="text-sm text-[var(--tools-muted)]">총 재직일수</p>
            <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{result.totalDays.toLocaleString()}일</p>
            <p className="mt-3 text-sm text-[var(--tools-muted)]">1일 평균임금: {formatWon(result.dailyWage)}</p>
          </div>
          <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
            <p className="text-sm text-[var(--tools-muted)]">예상 퇴직금</p>
            <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatWon(result.severance)}</p>
          </div>
        </div>
      ) : (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">날짜 입력을 확인해주세요.</p>
      )}
    </section>
  );
}
