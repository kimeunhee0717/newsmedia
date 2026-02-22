"use client";

import { useMemo, useState } from "react";

type Mode = "supply" | "vat" | "total";

const modeLabel: Record<Mode, string> = {
  supply: "공급가액",
  vat: "부가세",
  total: "합계",
};

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function VatCalculator() {
  const [mode, setMode] = useState<Mode>("total");
  const [amount, setAmount] = useState(110000);
  const [vatRate, setVatRate] = useState(10);

  const result = useMemo(() => {
    const rate = vatRate / 100;
    let supply = 0;
    let vat = 0;
    let total = 0;

    if (mode === "supply") {
      supply = amount;
      vat = supply * rate;
      total = supply + vat;
    }

    if (mode === "vat") {
      vat = amount;
      supply = rate === 0 ? 0 : vat / rate;
      total = supply + vat;
    }

    if (mode === "total") {
      total = amount;
      supply = rate === 0 ? total : total / (1 + rate);
      vat = total - supply;
    }

    return {
      supply: Math.round(supply),
      vat: Math.round(vat),
      total: Math.round(total),
    };
  }, [mode, amount, vatRate]);

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">부가세 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">공급가액, VAT, 합계를 서로 변환해서 계산합니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-2 sm:grid-cols-3">
          {(Object.keys(modeLabel) as Mode[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                mode === item ? "bg-[var(--tools-primary)] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {modeLabel[item]}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-sm font-semibold text-[var(--tools-muted)]">
          {modeLabel[mode]} 입력
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 text-base outline-none focus:border-[var(--tools-primary)]"
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-[var(--tools-muted)]">
          VAT 세율(%)
          <input
            type="number"
            min={0}
            max={100}
            value={vatRate}
            onChange={(event) => setVatRate(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 text-base outline-none focus:border-[var(--tools-primary)]"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">공급가액</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatWon(result.supply)}</p>
        </div>
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">부가세</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatWon(result.vat)}</p>
        </div>
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">합계</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{formatWon(result.total)}</p>
        </div>
      </div>
    </section>
  );
}
