"use client";

import { useMemo, useState } from "react";

type RepaymentMethod = "equal-payment" | "equal-principal" | "bullet";

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function LoanInterestCalculator() {
  const [loanManWon, setLoanManWon] = useState(30000);
  const [annualRate, setAnnualRate] = useState(4.5);
  const [years, setYears] = useState(30);
  const [method, setMethod] = useState<RepaymentMethod>("equal-payment");

  const result = useMemo(() => {
    const principal = loanManWon * 10000;
    const totalMonths = years * 12;
    const monthlyRate = annualRate / 100 / 12;

    if (principal <= 0 || totalMonths <= 0 || monthlyRate < 0) {
      return { firstPayment: 0, totalPayment: 0, totalInterest: 0 };
    }

    let totalPayment = 0;
    let totalInterest = 0;
    let firstPayment = 0;

    if (method === "equal-payment") {
      const monthlyPayment =
        (principal * monthlyRate * (1 + monthlyRate) ** totalMonths) /
        ((1 + monthlyRate) ** totalMonths - 1);

      let remain = principal;
      for (let month = 1; month <= totalMonths; month += 1) {
        const interest = remain * monthlyRate;
        const principalPay = monthlyPayment - interest;
        remain -= principalPay;
        totalPayment += monthlyPayment;
        totalInterest += interest;
        if (month === 1) firstPayment = monthlyPayment;
      }
    }

    if (method === "equal-principal") {
      const principalPay = principal / totalMonths;
      let remain = principal;
      for (let month = 1; month <= totalMonths; month += 1) {
        const interest = remain * monthlyRate;
        const payment = principalPay + interest;
        remain -= principalPay;
        totalPayment += payment;
        totalInterest += interest;
        if (month === 1) firstPayment = payment;
      }
    }

    if (method === "bullet") {
      const monthlyInterest = principal * monthlyRate;
      for (let month = 1; month <= totalMonths; month += 1) {
        const payment = month === totalMonths ? monthlyInterest + principal : monthlyInterest;
        totalPayment += payment;
        totalInterest += monthlyInterest;
        if (month === 1) firstPayment = payment;
      }
    }

    return {
      firstPayment: Math.round(firstPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  }, [loanManWon, annualRate, years, method]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">대출이자 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">상환 방식별 월 납입금과 총 이자를 비교할 수 있습니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            대출금(만원)
            <input
              type="number"
              min={0}
              value={loanManWon}
              onChange={(event) => setLoanManWon(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            연 이율(%)
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
            기간(년)
            <input
              type="number"
              min={1}
              value={years}
              onChange={(event) => setYears(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            상환방식
            <select
              value={method}
              onChange={(event) => setMethod(event.target.value as RepaymentMethod)}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            >
              <option value="equal-payment">원리금균등</option>
              <option value="equal-principal">원금균등</option>
              <option value="bullet">만기일시상환</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">첫 회차 납입금</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatWon(result.firstPayment)}</p>
        </div>
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">총 이자</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatWon(result.totalInterest)}</p>
        </div>
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">총 상환액</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatWon(result.totalPayment)}</p>
        </div>
      </div>
    </section>
  );
}
