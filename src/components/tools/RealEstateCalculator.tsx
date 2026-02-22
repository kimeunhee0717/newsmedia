"use client";

import { useMemo, useState } from "react";

type Scenario = {
  name: string;
  loanRatio: number;
  loanRate: number;
  depositMan: number;
  monthlyRentMan: number;
  monthlyCostMan: number;
  holdingYears: number;
  appreciationRate: number;
};

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

export function RealEstateCalculator() {
  const [purchasePriceMan, setPurchasePriceMan] = useState(30000);
  const [acquisitionTaxRate, setAcquisitionTaxRate] = useState(1.1);
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      name: "시나리오 A",
      loanRatio: 60,
      loanRate: 4.5,
      depositMan: 5000,
      monthlyRentMan: 80,
      monthlyCostMan: 30,
      holdingYears: 5,
      appreciationRate: 3,
    },
    {
      name: "시나리오 B",
      loanRatio: 40,
      loanRate: 4.5,
      depositMan: 15000,
      monthlyRentMan: 30,
      monthlyCostMan: 30,
      holdingYears: 5,
      appreciationRate: 3,
    },
  ]);

  const results = useMemo(() => {
    const price = purchasePriceMan * 10000;
    const tax = price * (acquisitionTaxRate / 100);

    return scenarios.map((scenario) => {
      const loan = price * (scenario.loanRatio / 100);
      const deposit = scenario.depositMan * 10000;
      const realInvestment = price + tax - loan - deposit;

      const yearlyRent = scenario.monthlyRentMan * 10000 * 12;
      const yearlyInterest = loan * (scenario.loanRate / 100);
      const yearlyHolding = scenario.monthlyCostMan * 10000 * 12;
      const yearlyNet = yearlyRent - yearlyInterest - yearlyHolding;

      const expectedSale = price * (1 + scenario.appreciationRate / 100) ** scenario.holdingYears;
      const capitalGain = expectedSale - price;
      const totalProfit = yearlyNet * scenario.holdingYears + capitalGain;

      const rentalYield = realInvestment > 0 ? (yearlyNet / realInvestment) * 100 : 0;
      const totalRoi = realInvestment > 0 ? (totalProfit / realInvestment) * 100 : 0;
      const annualizedRoi =
        realInvestment > 0
          ? ((1 + totalProfit / realInvestment) ** (1 / Math.max(1, scenario.holdingYears)) - 1) * 100
          : 0;

      return {
        realInvestment: Math.round(realInvestment),
        yearlyNet: Math.round(yearlyNet),
        rentalYield,
        totalProfit: Math.round(totalProfit),
        totalRoi,
        annualizedRoi,
        monthlyCashflow: Math.round(yearlyNet / 12),
      };
    });
  }, [purchasePriceMan, acquisitionTaxRate, scenarios]);

  const updateScenario = (index: number, patch: Partial<Scenario>) => {
    setScenarios((prev) => prev.map((scenario, idx) => (idx === index ? { ...scenario, ...patch } : scenario)));
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">부동산 수익률 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">2개 시나리오를 동시에 비교해 수익률과 현금흐름을 확인합니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">매입가(만원)<input type="number" value={purchasePriceMan} onChange={(e) => setPurchasePriceMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">취득세율(%)<input type="number" step="0.1" value={acquisitionTaxRate} onChange={(e) => setAcquisitionTaxRate(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {scenarios.map((scenario, index) => (
          <div key={index} className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
            <input value={scenario.name} onChange={(e) => updateScenario(index, { name: e.target.value })} className="w-full text-base font-semibold text-[var(--tools-primary-strong)] outline-none" />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-[var(--tools-muted)]">대출비율(%)<input type="number" value={scenario.loanRatio} onChange={(e) => updateScenario(index, { loanRatio: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-[var(--tools-border)] px-2 py-1.5" /></label>
              <label className="text-xs font-semibold text-[var(--tools-muted)]">대출금리(%)<input type="number" step="0.1" value={scenario.loanRate} onChange={(e) => updateScenario(index, { loanRate: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-[var(--tools-border)] px-2 py-1.5" /></label>
              <label className="text-xs font-semibold text-[var(--tools-muted)]">보증금(만원)<input type="number" value={scenario.depositMan} onChange={(e) => updateScenario(index, { depositMan: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-[var(--tools-border)] px-2 py-1.5" /></label>
              <label className="text-xs font-semibold text-[var(--tools-muted)]">월세(만원)<input type="number" value={scenario.monthlyRentMan} onChange={(e) => updateScenario(index, { monthlyRentMan: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-[var(--tools-border)] px-2 py-1.5" /></label>
              <label className="text-xs font-semibold text-[var(--tools-muted)]">월비용(만원)<input type="number" value={scenario.monthlyCostMan} onChange={(e) => updateScenario(index, { monthlyCostMan: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-[var(--tools-border)] px-2 py-1.5" /></label>
              <label className="text-xs font-semibold text-[var(--tools-muted)]">보유기간(년)<input type="number" value={scenario.holdingYears} onChange={(e) => updateScenario(index, { holdingYears: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-[var(--tools-border)] px-2 py-1.5" /></label>
              <label className="text-xs font-semibold text-[var(--tools-muted)] sm:col-span-2">연 시세상승률(%)<input type="number" step="0.1" value={scenario.appreciationRate} onChange={(e) => updateScenario(index, { appreciationRate: Number(e.target.value) })} className="mt-1 w-full rounded-lg border border-[var(--tools-border)] px-2 py-1.5" /></label>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <p className="text-sm font-semibold text-[var(--tools-muted)]">비교 결과</p>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {results.map((result, index) => (
            <div key={index} className="rounded-xl bg-[var(--tools-bg-end)] p-4">
              <p className="text-sm font-bold text-[var(--tools-primary-strong)]">{scenarios[index].name}</p>
              <p className="mt-1 text-sm text-[var(--tools-muted)]">실투자금: {formatWon(result.realInvestment)}</p>
              <p className="text-sm text-[var(--tools-muted)]">월 현금흐름: {result.monthlyCashflow >= 0 ? "+" : ""}{formatWon(result.monthlyCashflow)}</p>
              <p className="text-sm text-[var(--tools-muted)]">임대수익률: {formatPercent(result.rentalYield)}</p>
              <p className="text-sm text-[var(--tools-muted)]">총순수익: {formatWon(result.totalProfit)}</p>
              <p className="text-sm text-[var(--tools-muted)]">총 ROI: {formatPercent(result.totalRoi)}</p>
              <p className="text-sm text-[var(--tools-muted)]">연평균 ROI: {formatPercent(result.annualizedRoi)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
