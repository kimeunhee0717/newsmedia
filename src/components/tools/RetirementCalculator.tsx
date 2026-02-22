"use client";

import { useMemo, useState } from "react";

function formatManWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}만원`;
}

export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(35);
  const [retireAge, setRetireAge] = useState(55);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [monthlyLivingMan, setMonthlyLivingMan] = useState(300);
  const [inflation, setInflation] = useState(3);
  const [investReturn, setInvestReturn] = useState(5);
  const [currentSavingMan, setCurrentSavingMan] = useState(5000);
  const [monthlySavingMan, setMonthlySavingMan] = useState(100);
  const [pensionMonthlyMan, setPensionMonthlyMan] = useState(80);

  const result = useMemo(() => {
    const yearsToRetire = Math.max(0, retireAge - currentAge);
    const retirementYears = Math.max(0, lifeExpectancy - retireAge);
    const inflationRate = inflation / 100;
    const investRate = investReturn / 100;
    const realRate = investRate - inflationRate;
    const monthlyRealRate = realRate / 12;
    const monthlyInvestRate = investRate / 12;

    const inflatedLiving = monthlyLivingMan * (1 + inflationRate) ** yearsToRetire;
    const inflatedPension = pensionMonthlyMan * (1 + inflationRate) ** yearsToRetire;

    const retirementMonths = retirementYears * 12;
    const needPV =
      monthlyRealRate === 0
        ? inflatedLiving * retirementMonths
        : (inflatedLiving * (1 - (1 + monthlyRealRate) ** -retirementMonths)) / monthlyRealRate;
    const pensionPV =
      monthlyRealRate === 0
        ? inflatedPension * retirementMonths
        : (inflatedPension * (1 - (1 + monthlyRealRate) ** -retirementMonths)) / monthlyRealRate;
    const netNeeded = Math.max(0, needPV - pensionPV);

    const futureCurrent = currentSavingMan * (1 + investRate) ** yearsToRetire;
    const saveMonths = yearsToRetire * 12;
    const futureMonthly =
      monthlyInvestRate === 0
        ? monthlySavingMan * saveMonths
        : (monthlySavingMan * ((1 + monthlyInvestRate) ** saveMonths - 1)) / monthlyInvestRate;
    const totalAtRetire = futureCurrent + futureMonthly;
    const shortage = netNeeded - totalAtRetire;

    const additionalMonthly =
      shortage <= 0
        ? 0
        : monthlyInvestRate === 0
        ? shortage / Math.max(1, saveMonths)
        : (shortage * monthlyInvestRate) / ((1 + monthlyInvestRate) ** saveMonths - 1);

    return {
      yearsToRetire,
      retirementYears,
      inflatedLiving: Math.round(inflatedLiving),
      netNeeded: Math.round(netNeeded),
      totalAtRetire: Math.round(totalAtRetire),
      shortage: Math.round(shortage),
      isSufficient: shortage <= 0,
      additionalMonthly: Math.round(additionalMonthly),
    };
  }, [
    currentAge,
    retireAge,
    lifeExpectancy,
    monthlyLivingMan,
    inflation,
    investReturn,
    currentSavingMan,
    monthlySavingMan,
    pensionMonthlyMan,
  ]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">노후자금 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">은퇴 시점의 필요자금과 현재 저축 계획의 부족분을 계산합니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">현재 나이<input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">은퇴 나이<input type="number" value={retireAge} onChange={(e) => setRetireAge(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">기대수명<input type="number" value={lifeExpectancy} onChange={(e) => setLifeExpectancy(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">은퇴 후 생활비(월, 만원)<input type="number" value={monthlyLivingMan} onChange={(e) => setMonthlyLivingMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">물가상승률(%)<input type="number" step="0.1" value={inflation} onChange={(e) => setInflation(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">투자수익률(%)<input type="number" step="0.1" value={investReturn} onChange={(e) => setInvestReturn(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">현재 자산(만원)<input type="number" value={currentSavingMan} onChange={(e) => setCurrentSavingMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">월 저축액(만원)<input type="number" value={monthlySavingMan} onChange={(e) => setMonthlySavingMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
          <label className="text-sm font-semibold text-[var(--tools-muted)] sm:col-span-2">예상 연금(월, 만원)<input type="number" value={pensionMonthlyMan} onChange={(e) => setPensionMonthlyMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" /></label>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">노후 필요자금(연금 반영 후)</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatManWon(result.netNeeded)}</p>
          <p className="mt-2 text-sm text-[var(--tools-muted)]">은퇴까지 {result.yearsToRetire}년, 은퇴 후 {result.retirementYears}년</p>
          <p className="text-sm text-[var(--tools-muted)]">은퇴시점 생활비: {formatManWon(result.inflatedLiving)}/월</p>
        </div>
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">은퇴 시점 예상자산</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatManWon(result.totalAtRetire)}</p>
          <p className="mt-2 text-sm text-[var(--tools-muted)]">{result.isSufficient ? "목표 달성 가능" : "자금 부족"}</p>
          <p className="text-sm text-[var(--tools-muted)]">
            {result.isSufficient
              ? `여유자금 ${formatManWon(Math.abs(result.shortage))}`
              : `부족자금 ${formatManWon(result.shortage)}`}
          </p>
          {!result.isSufficient && (
            <p className="text-sm text-[var(--tools-muted)]">추가 필요 저축: {formatManWon(result.additionalMonthly)}/월</p>
          )}
        </div>
      </div>
    </section>
  );
}
