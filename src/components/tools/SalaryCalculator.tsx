"use client";

import { useMemo, useState } from "react";

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function SalaryCalculator() {
  const [annualSalaryMan, setAnnualSalaryMan] = useState(5000);
  const [nonTaxableMonthlyMan, setNonTaxableMonthlyMan] = useState(20);
  const [dependents, setDependents] = useState(1);
  const [children, setChildren] = useState(0);

  const result = useMemo(() => {
    const annual = annualSalaryMan * 10000;
    if (annual <= 0) return null;

    const monthlyGross = annual / 12;
    const annualNonTaxable = nonTaxableMonthlyMan * 10000 * 12;
    const annualTaxable = Math.max(0, annual - annualNonTaxable);
    const monthlyTaxable = annualTaxable / 12;

    const pension = Math.floor(Math.min(monthlyTaxable, 5900000) * 0.045);
    const health = Math.floor(monthlyTaxable * 0.03545);
    const longTerm = Math.floor(health * 0.1281);
    const employment = Math.floor(monthlyTaxable * 0.009);

    let earnedIncomeDeduction = 0;
    if (annualTaxable <= 5000000) earnedIncomeDeduction = annualTaxable * 0.7;
    else if (annualTaxable <= 15000000) earnedIncomeDeduction = 3500000 + (annualTaxable - 5000000) * 0.4;
    else if (annualTaxable <= 45000000) earnedIncomeDeduction = 7500000 + (annualTaxable - 15000000) * 0.15;
    else if (annualTaxable <= 100000000) earnedIncomeDeduction = 12000000 + (annualTaxable - 45000000) * 0.05;
    else earnedIncomeDeduction = 14750000 + (annualTaxable - 100000000) * 0.02;

    const earnedIncome = annualTaxable - earnedIncomeDeduction;
    const personalDeduction = dependents * 1500000;
    const insuranceDeduction = (pension + health + longTerm + employment) * 12;
    const taxBase = Math.max(0, earnedIncome - personalDeduction - insuranceDeduction);

    let annualTax = 0;
    if (taxBase <= 14000000) annualTax = taxBase * 0.06;
    else if (taxBase <= 50000000) annualTax = 840000 + (taxBase - 14000000) * 0.15;
    else if (taxBase <= 88000000) annualTax = 6240000 + (taxBase - 50000000) * 0.24;
    else if (taxBase <= 150000000) annualTax = 15360000 + (taxBase - 88000000) * 0.35;
    else annualTax = 37060000 + (taxBase - 150000000) * 0.38;

    let taxCredit = annualTax <= 1300000 ? annualTax * 0.55 : 715000 + (annualTax - 1300000) * 0.3;
    taxCredit = Math.min(taxCredit, 740000);
    let childCredit = 0;
    if (children === 1) childCredit = 150000;
    if (children === 2) childCredit = 300000;
    if (children >= 3) childCredit = 300000 + (children - 2) * 300000;

    const incomeTaxMonthly = Math.floor(Math.max(0, annualTax - taxCredit - childCredit) / 12);
    const localTaxMonthly = Math.floor(incomeTaxMonthly * 0.1);
    const totalDeduction = pension + health + longTerm + employment + incomeTaxMonthly + localTaxMonthly;
    const monthlyNet = monthlyGross - totalDeduction;

    return {
      monthlyGross: Math.round(monthlyGross),
      monthlyNet: Math.round(monthlyNet),
      annualNet: Math.round(monthlyNet * 12),
      totalDeduction: Math.round(totalDeduction),
      pension,
      health,
      longTerm,
      employment,
      incomeTaxMonthly,
      localTaxMonthly,
    };
  }, [annualSalaryMan, nonTaxableMonthlyMan, dependents, children]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">연봉 실수령액 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">4대 보험과 소득세를 반영한 월 실수령액 추정치입니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">연봉(만원)<input type="number" value={annualSalaryMan} onChange={(e) => setAnnualSalaryMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">월 비과세(만원)<input type="number" value={nonTaxableMonthlyMan} onChange={(e) => setNonTaxableMonthlyMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">부양가족 수<input type="number" min={1} value={dependents} onChange={(e) => setDependents(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">자녀 수(20세 이하)<input type="number" min={0} value={children} onChange={(e) => setChildren(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
        </div>
      </div>

      {result && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
            <p className="text-sm text-[var(--tools-muted)]">월 실수령액</p>
            <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatWon(result.monthlyNet)}</p>
            <p className="mt-2 text-sm text-[var(--tools-muted)]">연 실수령액: {formatWon(result.annualNet)}</p>
          </div>
          <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
            <p className="text-sm text-[var(--tools-muted)]">월 공제 합계</p>
            <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatWon(result.totalDeduction)}</p>
            <p className="mt-2 text-sm text-[var(--tools-muted)]">국민연금 {formatWon(result.pension)} / 건강보험 {formatWon(result.health)}</p>
            <p className="text-sm text-[var(--tools-muted)]">장기요양 {formatWon(result.longTerm)} / 고용보험 {formatWon(result.employment)}</p>
            <p className="text-sm text-[var(--tools-muted)]">소득세+지방세 {formatWon(result.incomeTaxMonthly + result.localTaxMonthly)}</p>
          </div>
        </div>
      )}
    </section>
  );
}
