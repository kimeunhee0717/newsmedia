"use client";

import { useMemo, useState } from "react";

type PensionType = "national" | "personal";

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function PensionCalculator() {
  const [type, setType] = useState<PensionType>("national");

  const [currentAge, setCurrentAge] = useState(35);
  const [monthlySalaryMan, setMonthlySalaryMan] = useState(300);
  const [joinedYears, setJoinedYears] = useState(10);
  const [retireAge, setRetireAge] = useState(60);

  const [personalMonthlyMan, setPersonalMonthlyMan] = useState(30);
  const [personalRate, setPersonalRate] = useState(4);
  const [payYears, setPayYears] = useState(25);
  const [receiveYears, setReceiveYears] = useState(20);

  const national = useMemo(() => {
    const salary = monthlySalaryMan * 10000;
    const remainYears = Math.max(0, retireAge - currentAge);
    const totalYears = joinedYears + remainYears;
    const startAge = 65;
    if (salary <= 0 || totalYears < 10) {
      return { monthly: 0, yearly: 0, totalYears, startAge };
    }
    const aValue = 2860000;
    const cappedSalary = Math.min(Math.max(salary, 370000), 5900000);
    const replacementPerYear = 0.012;
    const monthly = ((aValue + cappedSalary) / 2) * totalYears * replacementPerYear;
    return { monthly: Math.round(monthly), yearly: Math.round(monthly * 12), totalYears, startAge };
  }, [monthlySalaryMan, retireAge, currentAge, joinedYears]);

  const personal = useMemo(() => {
    const monthly = personalMonthlyMan * 10000;
    const monthlyRate = personalRate / 100 / 12;
    const totalPayMonths = payYears * 12;
    const totalReceiveMonths = receiveYears * 12;
    let balance = 0;
    for (let i = 0; i < totalPayMonths; i += 1) {
      balance = (balance + monthly) * (1 + monthlyRate);
    }
    const invested = monthly * totalPayMonths;
    const receiveRate = monthlyRate * 0.7;
    const monthlyPension =
      receiveRate > 0
        ? (balance * (receiveRate * (1 + receiveRate) ** totalReceiveMonths)) /
          ((1 + receiveRate) ** totalReceiveMonths - 1)
        : balance / Math.max(1, totalReceiveMonths);

    return {
      invested: Math.round(invested),
      balance: Math.round(balance),
      profit: Math.round(balance - invested),
      monthlyPension: Math.round(monthlyPension),
      startAge: currentAge + payYears,
    };
  }, [personalMonthlyMan, personalRate, payYears, receiveYears, currentAge]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">연금 수령액 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">국민연금 예상액과 개인연금 시뮬레이션을 비교합니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <label className="text-sm font-semibold text-[var(--tools-muted)]">
          연금 유형
          <select
            value={type}
            onChange={(event) => setType(event.target.value as PensionType)}
            className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2"
          >
            <option value="national">국민연금</option>
            <option value="personal">개인연금</option>
          </select>
        </label>

        {type === "national" ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[var(--tools-muted)]">
              현재 나이
              <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
            </label>
            <label className="text-sm font-semibold text-[var(--tools-muted)]">
              월 소득(만원)
              <input type="number" value={monthlySalaryMan} onChange={(e) => setMonthlySalaryMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
            </label>
            <label className="text-sm font-semibold text-[var(--tools-muted)]">
              가입연수(년)
              <input type="number" value={joinedYears} onChange={(e) => setJoinedYears(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
            </label>
            <label className="text-sm font-semibold text-[var(--tools-muted)]">
              은퇴 나이
              <input type="number" value={retireAge} onChange={(e) => setRetireAge(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
            </label>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[var(--tools-muted)]">
              월 납입금(만원)
              <input type="number" value={personalMonthlyMan} onChange={(e) => setPersonalMonthlyMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
            </label>
            <label className="text-sm font-semibold text-[var(--tools-muted)]">
              연 수익률(%)
              <input type="number" value={personalRate} onChange={(e) => setPersonalRate(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
            </label>
            <label className="text-sm font-semibold text-[var(--tools-muted)]">
              납입 기간(년)
              <input type="number" value={payYears} onChange={(e) => setPayYears(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
            </label>
            <label className="text-sm font-semibold text-[var(--tools-muted)]">
              수령 기간(년)
              <input type="number" value={receiveYears} onChange={(e) => setReceiveYears(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
            </label>
          </div>
        )}
      </div>

      {type === "national" ? (
        <div className="mt-5 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">국민연금 예상</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">월 {formatWon(national.monthly)}</p>
          <p className="mt-2 text-sm text-[var(--tools-muted)]">연 {formatWon(national.yearly)}</p>
          <p className="text-sm text-[var(--tools-muted)]">총 가입연수 {national.totalYears}년, 수령 시작 {national.startAge}세</p>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">개인연금 시뮬레이션</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">월 {formatWon(personal.monthlyPension)}</p>
          <p className="mt-2 text-sm text-[var(--tools-muted)]">총 납입 {formatWon(personal.invested)}</p>
          <p className="text-sm text-[var(--tools-muted)]">운용수익 {formatWon(personal.profit)}</p>
          <p className="text-sm text-[var(--tools-muted)]">수령 시작 나이 {personal.startAge}세</p>
        </div>
      )}
    </section>
  );
}
