"use client";

import { useMemo, useState } from "react";

type Method = "equal_payment" | "equal_principal" | "bullet";

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function buildSchedule(balanceMan: number, rate: number, months: number, method: Method) {
  const balance = balanceMan * 10000;
  const monthlyRate = rate / 100 / 12;
  const rows: { payment: number; interest: number }[] = [];
  let remain = balance;

  for (let m = 1; m <= months; m += 1) {
    const interest = remain * monthlyRate;
    let principal = 0;
    let payment = 0;
    if (method === "equal_payment") {
      if (monthlyRate === 0) {
        payment = balance / months;
        principal = payment;
      } else {
        payment = (balance * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
        principal = payment - interest;
      }
    } else if (method === "equal_principal") {
      principal = balance / months;
      payment = principal + interest;
    } else {
      principal = m === months ? balance : 0;
      payment = interest + principal;
    }
    remain = Math.max(0, remain - principal);
    rows.push({ payment, interest });
  }
  return rows;
}

export function LoanRefinanceCalculator() {
  const [currentBalanceMan, setCurrentBalanceMan] = useState(30000);
  const [currentRate, setCurrentRate] = useState(5.5);
  const [currentMonths, setCurrentMonths] = useState(240);
  const [currentMethod, setCurrentMethod] = useState<Method>("equal_payment");

  const [newRate, setNewRate] = useState(3.8);
  const [newMonths, setNewMonths] = useState(240);
  const [newMethod, setNewMethod] = useState<Method>("equal_payment");

  const [earlyRepayFeeRate, setEarlyRepayFeeRate] = useState(1.2);
  const [stampTaxMan, setStampTaxMan] = useState(15);
  const [mortgageFeeMan, setMortgageFeeMan] = useState(50);
  const [otherFeeMan, setOtherFeeMan] = useState(10);

  const result = useMemo(() => {
    const cur = buildSchedule(currentBalanceMan, currentRate, currentMonths, currentMethod);
    const next = buildSchedule(currentBalanceMan, newRate, newMonths, newMethod);

    const curMonthly = cur[0]?.payment ?? 0;
    const nextMonthly = next[0]?.payment ?? 0;
    const curInterest = cur.reduce((sum, r) => sum + r.interest, 0);
    const nextInterest = next.reduce((sum, r) => sum + r.interest, 0);
    const interestSaved = curInterest - nextInterest;

    const refinanceCost =
      currentBalanceMan * 10000 * (earlyRepayFeeRate / 100) +
      (stampTaxMan + mortgageFeeMan + otherFeeMan) * 10000;

    const netSaved = interestSaved - refinanceCost;
    const monthlySaved = curMonthly - nextMonthly;
    const breakEvenMonths = monthlySaved > 0 ? Math.ceil(refinanceCost / monthlySaved) : -1;

    return {
      curMonthly: Math.round(curMonthly),
      nextMonthly: Math.round(nextMonthly),
      interestSaved: Math.round(interestSaved),
      refinanceCost: Math.round(refinanceCost),
      netSaved: Math.round(netSaved),
      monthlySaved: Math.round(monthlySaved),
      breakEvenMonths,
    };
  }, [
    currentBalanceMan,
    currentRate,
    currentMonths,
    currentMethod,
    newRate,
    newMonths,
    newMethod,
    earlyRepayFeeRate,
    stampTaxMan,
    mortgageFeeMan,
    otherFeeMan,
  ]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">대출 갈아타기 비교기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">기존 대출과 신규 대출 조건을 비교해 순절감액을 계산합니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">대출 잔액(만원)<input type="number" value={currentBalanceMan} onChange={(e) => setCurrentBalanceMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">기존 금리(%)<input type="number" step="0.1" value={currentRate} onChange={(e) => setCurrentRate(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">기존 잔여기간(개월)<input type="number" value={currentMonths} onChange={(e) => setCurrentMonths(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">기존 상환방식
            <select value={currentMethod} onChange={(e) => setCurrentMethod(e.target.value as Method)} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2">
              <option value="equal_payment">원리금균등</option>
              <option value="equal_principal">원금균등</option>
              <option value="bullet">만기일시</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">신규 금리(%)<input type="number" step="0.1" value={newRate} onChange={(e) => setNewRate(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">신규 기간(개월)<input type="number" value={newMonths} onChange={(e) => setNewMonths(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">신규 상환방식
            <select value={newMethod} onChange={(e) => setNewMethod(e.target.value as Method)} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2">
              <option value="equal_payment">원리금균등</option>
              <option value="equal_principal">원금균등</option>
              <option value="bullet">만기일시</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">중도상환수수료율(%)<input type="number" step="0.1" value={earlyRepayFeeRate} onChange={(e) => setEarlyRepayFeeRate(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">인지세(만원)<input type="number" value={stampTaxMan} onChange={(e) => setStampTaxMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">근저당설정비(만원)<input type="number" value={mortgageFeeMan} onChange={(e) => setMortgageFeeMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">기타비용(만원)<input type="number" value={otherFeeMan} onChange={(e) => setOtherFeeMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">월 상환액 비교</p>
          <p className="mt-2 text-sm text-[var(--tools-muted)]">기존: {formatWon(result.curMonthly)}</p>
          <p className="text-sm text-[var(--tools-muted)]">신규: {formatWon(result.nextMonthly)}</p>
          <p className="text-sm text-[var(--tools-muted)]">월 절감액: {result.monthlySaved >= 0 ? "+" : ""}{formatWon(result.monthlySaved)}</p>
        </div>
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">총 비용/절감</p>
          <p className="mt-2 text-sm text-[var(--tools-muted)]">이자 절감: {formatWon(result.interestSaved)}</p>
          <p className="text-sm text-[var(--tools-muted)]">갈아타기 비용: {formatWon(result.refinanceCost)}</p>
          <p className="text-sm text-[var(--tools-muted)]">순절감: {result.netSaved >= 0 ? "+" : ""}{formatWon(result.netSaved)}</p>
          <p className="text-sm text-[var(--tools-muted)]">손익분기: {result.breakEvenMonths > 0 ? `${result.breakEvenMonths}개월` : "해당 없음"}</p>
        </div>
      </div>
    </section>
  );
}
