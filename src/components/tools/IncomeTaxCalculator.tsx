"use client";

import { useMemo, useState } from "react";

type Bracket = {
  from: number;
  to: number;
  rate: number;
};

const brackets: Bracket[] = [
  { from: 0, to: 1400, rate: 6 },
  { from: 1400, to: 5000, rate: 15 },
  { from: 5000, to: 8800, rate: 24 },
  { from: 8800, to: 15000, rate: 35 },
  { from: 15000, to: 30000, rate: 38 },
  { from: 30000, to: 50000, rate: 40 },
  { from: 50000, to: 100000, rate: 42 },
  { from: 100000, to: Number.POSITIVE_INFINITY, rate: 45 },
];

function formatManWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}만원`;
}

function calcIncomeTax(taxableIncomeMan: number) {
  if (taxableIncomeMan <= 0) return 0;
  let remain = taxableIncomeMan;
  let tax = 0;

  for (const bracket of brackets) {
    if (remain <= 0) break;
    const slice = Math.min(remain, bracket.to - bracket.from);
    if (slice > 0) {
      tax += slice * (bracket.rate / 100);
      remain -= slice;
    }
  }

  return Math.round(tax);
}

export function IncomeTaxCalculator() {
  const [revenueMan, setRevenueMan] = useState(5000);
  const [expenseRate, setExpenseRate] = useState(64.1);
  const [personalDeductionMan, setPersonalDeductionMan] = useState(150);
  const [additionalDeductionMan, setAdditionalDeductionMan] = useState(0);
  const [prepaidTaxMan, setPrepaidTaxMan] = useState(0);

  const result = useMemo(() => {
    const expenses = revenueMan * (expenseRate / 100);
    const income = revenueMan - expenses;
    const taxable = Math.max(0, income - personalDeductionMan - additionalDeductionMan);
    const incomeTax = calcIncomeTax(taxable);
    const localTax = Math.round(incomeTax * 0.1);
    const totalTax = incomeTax + localTax;
    const netTax = totalTax - prepaidTaxMan;
    const effectiveRate = revenueMan > 0 ? (totalTax / revenueMan) * 100 : 0;

    return {
      expenses: Math.round(expenses),
      income: Math.round(income),
      taxable: Math.round(taxable),
      incomeTax,
      localTax,
      totalTax,
      netTax: Math.round(netTax),
      effectiveRate,
    };
  }, [revenueMan, expenseRate, personalDeductionMan, additionalDeductionMan, prepaidTaxMan]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">종합소득세 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">간편 추정용 계산기이며 실제 신고세액과는 차이가 있을 수 있습니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            연 수입금액(만원)
            <input type="number" value={revenueMan} onChange={(e) => setRevenueMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            경비율(%)
            <input type="number" step="0.1" value={expenseRate} onChange={(e) => setExpenseRate(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            인적공제(만원)
            <input type="number" value={personalDeductionMan} onChange={(e) => setPersonalDeductionMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            추가공제(만원)
            <input type="number" value={additionalDeductionMan} onChange={(e) => setAdditionalDeductionMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)] sm:col-span-2">
            기납부세액(만원)
            <input type="number" value={prepaidTaxMan} onChange={(e) => setPrepaidTaxMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">과세표준</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatManWon(result.taxable)}</p>
          <p className="mt-2 text-sm text-[var(--tools-muted)]">소득금액: {formatManWon(result.income)}</p>
          <p className="text-sm text-[var(--tools-muted)]">필요경비: {formatManWon(result.expenses)}</p>
        </div>
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">세금 결과</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatManWon(result.totalTax)}</p>
          <p className="mt-2 text-sm text-[var(--tools-muted)]">소득세: {formatManWon(result.incomeTax)}</p>
          <p className="text-sm text-[var(--tools-muted)]">지방소득세: {formatManWon(result.localTax)}</p>
          <p className="text-sm text-[var(--tools-muted)]">실효세율: {result.effectiveRate.toFixed(1)}%</p>
          <p className="text-sm text-[var(--tools-muted)]">{result.netTax >= 0 ? "추가 납부" : "환급 예상"}: {formatManWon(Math.abs(result.netTax))}</p>
        </div>
      </div>
    </section>
  );
}
