"use client";

import { useMemo, useState } from "react";

type ProductType = "deposit" | "savings";
type InterestType = "simple" | "compound";
type TaxType = "normal" | "preferential" | "exempt";

const taxRateMap: Record<TaxType, number> = {
  normal: 0.154,
  preferential: 0.095,
  exempt: 0,
};

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function SavingsCalculator() {
  const [productType, setProductType] = useState<ProductType>("savings");
  const [amountManWon, setAmountManWon] = useState(50);
  const [annualRate, setAnnualRate] = useState(3.5);
  const [months, setMonths] = useState(12);
  const [interestType, setInterestType] = useState<InterestType>("simple");
  const [taxType, setTaxType] = useState<TaxType>("normal");

  const result = useMemo(() => {
    const amount = amountManWon * 10000;
    const monthlyRate = annualRate / 100 / 12;
    const taxRate = taxRateMap[taxType];

    if (amount <= 0 || months <= 0 || monthlyRate < 0) {
      return { totalPrincipal: 0, grossInterest: 0, tax: 0, netInterest: 0, maturity: 0 };
    }

    let totalPrincipal = 0;
    let grossInterest = 0;

    if (productType === "deposit") {
      totalPrincipal = amount;
      if (interestType === "simple") {
        grossInterest = totalPrincipal * (annualRate / 100) * (months / 12);
      } else {
        grossInterest = totalPrincipal * (1 + monthlyRate) ** months - totalPrincipal;
      }
    } else {
      totalPrincipal = amount * months;
      if (interestType === "simple") {
        for (let month = 1; month <= months; month += 1) {
          grossInterest += amount * (annualRate / 100) * ((months - month + 1) / 12);
        }
      } else {
        let balance = 0;
        for (let month = 1; month <= months; month += 1) {
          balance = (balance + amount) * (1 + monthlyRate);
        }
        grossInterest = balance - totalPrincipal;
      }
    }

    const tax = grossInterest * taxRate;
    const netInterest = grossInterest - tax;
    const maturity = totalPrincipal + netInterest;

    return {
      totalPrincipal: Math.round(totalPrincipal),
      grossInterest: Math.round(grossInterest),
      tax: Math.round(tax),
      netInterest: Math.round(netInterest),
      maturity: Math.round(maturity),
    };
  }, [amountManWon, annualRate, months, productType, interestType, taxType]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">적금/예금 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">상품 유형, 복리 여부, 세금 조건을 바꿔 만기 수령액을 비교합니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            상품 유형
            <select
              value={productType}
              onChange={(event) => setProductType(event.target.value as ProductType)}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            >
              <option value="savings">적금(매월 납입)</option>
              <option value="deposit">예금(일시 예치)</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            {productType === "deposit" ? "예치금(만원)" : "월 납입금(만원)"}
            <input
              type="number"
              min={0}
              value={amountManWon}
              onChange={(event) => setAmountManWon(Number(event.target.value))}
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
            기간(개월)
            <input
              type="number"
              min={1}
              value={months}
              onChange={(event) => setMonths(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            이자 방식
            <select
              value={interestType}
              onChange={(event) => setInterestType(event.target.value as InterestType)}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            >
              <option value="simple">단리</option>
              <option value="compound">복리</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            세금
            <select
              value={taxType}
              onChange={(event) => setTaxType(event.target.value as TaxType)}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            >
              <option value="normal">일반과세(15.4%)</option>
              <option value="preferential">세금우대(9.5%)</option>
              <option value="exempt">비과세(0%)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">만기 수령액(세후)</p>
          <p className="mt-1 text-3xl font-bold text-[var(--tools-primary-strong)]">{formatWon(result.maturity)}</p>
          <p className="mt-3 text-sm text-[var(--tools-muted)]">원금: {formatWon(result.totalPrincipal)}</p>
          <p className="text-sm text-[var(--tools-muted)]">세후 이자: {formatWon(result.netInterest)}</p>
        </div>
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">세전/세금</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">세전 이자 {formatWon(result.grossInterest)}</p>
          <p className="mt-3 text-sm text-[var(--tools-muted)]">이자세금: {formatWon(result.tax)}</p>
        </div>
      </div>
    </section>
  );
}
