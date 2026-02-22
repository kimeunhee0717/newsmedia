"use client";

import { useMemo, useState } from "react";

type FuelType = "gasoline" | "diesel" | "lpg" | "electric" | "hybrid";

const avgFuelPrice: Record<FuelType, number> = {
  gasoline: 1650,
  diesel: 1500,
  lpg: 1000,
  electric: 300,
  hybrid: 1650,
};

function formatManWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}만원`;
}

function calcAutoTaxMan(cc: number, isElectric: boolean, carAge: number): number {
  if (isElectric) return 13;

  let baseTax = 0;
  if (cc <= 1000) baseTax = cc * 80;
  else if (cc <= 1600) baseTax = cc * 140;
  else baseTax = cc * 200;

  const eduTax = baseTax * 0.3;
  let total = baseTax + eduTax;
  if (carAge >= 3) {
    const discount = Math.min((carAge - 2) * 5, 50);
    total *= 1 - discount / 100;
  }
  return Math.round(total / 10000);
}

export function CarCostCalculator() {
  const [fuelType, setFuelType] = useState<FuelType>("gasoline");
  const [engineCc, setEngineCc] = useState(2000);
  const [efficiency, setEfficiency] = useState(12);
  const [carAge, setCarAge] = useState(3);
  const [carPriceMan, setCarPriceMan] = useState(3000);
  const [monthlyKm, setMonthlyKm] = useState(1500);
  const [fuelPrice, setFuelPrice] = useState(avgFuelPrice.gasoline);
  const [insuranceMan, setInsuranceMan] = useState(8);
  const [maintenanceYearlyMan, setMaintenanceYearlyMan] = useState(50);
  const [parkingMan, setParkingMan] = useState(10);
  const [tollMan, setTollMan] = useState(3);
  const [washMan, setWashMan] = useState(2);

  const result = useMemo(() => {
    const monthlyFuelUse = efficiency > 0 ? monthlyKm / efficiency : 0;
    const monthlyFuelCostMan = (monthlyFuelUse * fuelPrice) / 10000;
    const monthlyAutoTaxMan = calcAutoTaxMan(engineCc, fuelType === "electric", carAge) / 12;
    const monthlyDepreciationMan = (() => {
      let value = carPriceMan;
      for (let y = 0; y < carAge; y += 1) {
        value *= y === 0 ? 0.7 : 0.8;
      }
      return (value * 0.2) / 12;
    })();
    const monthlyMaintenanceMan = maintenanceYearlyMan / 12;
    const monthlyEtcMan = parkingMan + tollMan + washMan;

    const monthlyTotal =
      monthlyFuelCostMan +
      monthlyAutoTaxMan +
      monthlyDepreciationMan +
      insuranceMan +
      monthlyMaintenanceMan +
      monthlyEtcMan;

    const yearlyTotal = monthlyTotal * 12;
    const costPerKmWon = monthlyKm > 0 ? (monthlyTotal * 10000) / monthlyKm : 0;

    return {
      monthlyFuelCostMan,
      monthlyTotal,
      yearlyTotal,
      costPerKmWon,
    };
  }, [
    monthlyKm,
    efficiency,
    fuelPrice,
    engineCc,
    fuelType,
    carAge,
    carPriceMan,
    insuranceMan,
    maintenanceYearlyMan,
    parkingMan,
    tollMan,
    washMan,
  ]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">자동차 유지비 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">연료비, 세금, 감가, 보험, 기타비용을 합산합니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            연료
            <select
              value={fuelType}
              onChange={(e) => {
                const type = e.target.value as FuelType;
                setFuelType(type);
                setFuelPrice(avgFuelPrice[type]);
              }}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2"
            >
              <option value="gasoline">가솔린</option>
              <option value="diesel">디젤</option>
              <option value="lpg">LPG</option>
              <option value="electric">전기</option>
              <option value="hybrid">하이브리드</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            월 주행거리(km)
            <input type="number" value={monthlyKm} onChange={(e) => setMonthlyKm(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            연비(km/L, 전기는 km/kWh)
            <input type="number" step="0.1" value={efficiency} onChange={(e) => setEfficiency(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            연료단가(원)
            <input type="number" value={fuelPrice} onChange={(e) => setFuelPrice(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            배기량(cc)
            <input type="number" value={engineCc} onChange={(e) => setEngineCc(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            차량가격(만원)
            <input type="number" value={carPriceMan} onChange={(e) => setCarPriceMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            차량연식(년)
            <input type="number" value={carAge} onChange={(e) => setCarAge(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            보험료(월, 만원)
            <input type="number" value={insuranceMan} onChange={(e) => setInsuranceMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            정비비(연, 만원)
            <input type="number" value={maintenanceYearlyMan} onChange={(e) => setMaintenanceYearlyMan(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            주차+통행+세차(월, 만원)
            <input type="number" value={parkingMan + tollMan + washMan} onChange={(e) => {
              const total = Number(e.target.value);
              const split = total / 3;
              setParkingMan(split);
              setTollMan(split);
              setWashMan(split);
            }} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">월 총 유지비</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatManWon(result.monthlyTotal)}</p>
          <p className="mt-2 text-sm text-[var(--tools-muted)]">월 연료비: {formatManWon(result.monthlyFuelCostMan)}</p>
        </div>
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">연간 유지비</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatManWon(result.yearlyTotal)}</p>
          <p className="mt-2 text-sm text-[var(--tools-muted)]">km당 비용: {Math.round(result.costPerKmWon).toLocaleString("ko-KR")}원</p>
        </div>
      </div>
    </section>
  );
}
