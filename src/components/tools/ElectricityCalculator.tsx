"use client";

import { useMemo, useState } from "react";

type Season = "summer" | "other";

type Tier = {
  from: number;
  to: number;
  baseFee: number;
  unitPrice: number;
};

const summerTiers: Tier[] = [
  { from: 0, to: 300, baseFee: 730, unitPrice: 112.0 },
  { from: 300, to: 450, baseFee: 1260, unitPrice: 206.6 },
  { from: 450, to: Number.POSITIVE_INFINITY, baseFee: 6060, unitPrice: 299.3 },
];

const otherTiers: Tier[] = [
  { from: 0, to: 200, baseFee: 730, unitPrice: 112.0 },
  { from: 200, to: 400, baseFee: 1260, unitPrice: 206.6 },
  { from: 400, to: Number.POSITIVE_INFINITY, baseFee: 6060, unitPrice: 299.3 },
];

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function calculate(kwh: number, season: Season) {
  const tiers = season === "summer" ? summerTiers : otherTiers;
  const climateRate = 9.0;
  const fuelAdjRate = 5.0;

  let baseFee = 0;
  for (const tier of tiers) {
    if (kwh > tier.from) baseFee = tier.baseFee;
  }

  let energyCharge = 0;
  for (const tier of tiers) {
    if (kwh <= tier.from) break;
    const usage = Math.min(kwh, tier.to) - tier.from;
    if (usage > 0) {
      energyCharge += usage * tier.unitPrice;
    }
  }

  const climateCharge = kwh * climateRate;
  const fuelAdj = kwh * fuelAdjRate;
  const subtotal = baseFee + energyCharge + climateCharge + fuelAdj;
  const vat = Math.floor((subtotal * 0.1) / 10) * 10;
  const fund = Math.floor((subtotal * 0.037) / 10) * 10;
  const total = Math.floor((subtotal + vat + fund) / 10) * 10;

  return {
    baseFee: Math.round(baseFee),
    energyCharge: Math.round(energyCharge),
    climateCharge: Math.round(climateCharge),
    fuelAdj: Math.round(fuelAdj),
    vat: Math.round(vat),
    fund: Math.round(fund),
    total: Math.round(total),
  };
}

export function ElectricityCalculator() {
  const [kwh, setKwh] = useState(350);
  const [season, setSeason] = useState<Season>("other");

  const result = useMemo(() => calculate(kwh, season), [kwh, season]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">전기요금 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">2024 주택용 누진제 기준으로 예상 요금을 계산합니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            적용 시즌
            <select value={season} onChange={(e) => setSeason(e.target.value as Season)} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2">
              <option value="other">기타(9~6월)</option>
              <option value="summer">하계(7~8월)</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            사용량(kWh)
            <input type="number" min={0} value={kwh} onChange={(e) => setKwh(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">예상 전기요금</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatWon(result.total)}</p>
        </div>
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">요금 구성</p>
          <p className="mt-2 text-sm text-[var(--tools-muted)]">기본요금: {formatWon(result.baseFee)}</p>
          <p className="text-sm text-[var(--tools-muted)]">전력량요금: {formatWon(result.energyCharge)}</p>
          <p className="text-sm text-[var(--tools-muted)]">기후환경요금: {formatWon(result.climateCharge)}</p>
          <p className="text-sm text-[var(--tools-muted)]">연료비조정액: {formatWon(result.fuelAdj)}</p>
          <p className="text-sm text-[var(--tools-muted)]">VAT+기금: {formatWon(result.vat + result.fund)}</p>
        </div>
      </div>
    </section>
  );
}
