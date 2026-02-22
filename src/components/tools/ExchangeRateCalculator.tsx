"use client";

import { useMemo, useState } from "react";

type Currency = {
  code: string;
  name: string;
  rateToKRW: number;
  perHundred?: boolean;
};

const currencies: Currency[] = [
  { code: "KRW", name: "대한민국 원", rateToKRW: 1 },
  { code: "USD", name: "미국 달러", rateToKRW: 1380 },
  { code: "EUR", name: "유로", rateToKRW: 1500 },
  { code: "JPY", name: "일본 엔", rateToKRW: 920, perHundred: true },
  { code: "CNY", name: "중국 위안", rateToKRW: 190 },
  { code: "GBP", name: "영국 파운드", rateToKRW: 1750 },
  { code: "CHF", name: "스위스 프랑", rateToKRW: 1570 },
  { code: "CAD", name: "캐나다 달러", rateToKRW: 1000 },
  { code: "AUD", name: "호주 달러", rateToKRW: 890 },
  { code: "HKD", name: "홍콩 달러", rateToKRW: 177 },
  { code: "SGD", name: "싱가포르 달러", rateToKRW: 1030 },
  { code: "THB", name: "태국 바트", rateToKRW: 40 },
  { code: "VND", name: "베트남 동", rateToKRW: 5.5, perHundred: true },
  { code: "TWD", name: "대만 달러", rateToKRW: 43 },
  { code: "PHP", name: "필리핀 페소", rateToKRW: 24 },
];

function getEffectiveRateToKRW(currency: Currency) {
  return currency.perHundred ? currency.rateToKRW / 100 : currency.rateToKRW;
}

function formatNumber(value: number, digits = 2) {
  if (Math.abs(value) >= 1) {
    return value.toLocaleString("ko-KR", {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    });
  }

  return value.toFixed(6);
}

export function ExchangeRateCalculator() {
  const [fromCode, setFromCode] = useState("USD");
  const [toCode, setToCode] = useState("KRW");
  const [amount, setAmount] = useState(1000);

  const from = currencies.find((currency) => currency.code === fromCode) ?? currencies[0];
  const to = currencies.find((currency) => currency.code === toCode) ?? currencies[0];

  const result = useMemo(() => {
    const fromRate = getEffectiveRateToKRW(from);
    const toRate = getEffectiveRateToKRW(to);
    const rate = fromRate / toRate;
    const converted = amount * rate;

    return {
      converted,
      rate,
      reverseRate: toRate / fromRate,
    };
  }, [amount, from, to]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">환율 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">
        주요 통화 기준 환율로 금액을 빠르게 변환합니다.
      </p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            보내는 통화
            <select
              value={fromCode}
              onChange={(event) => setFromCode(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            받는 통화
            <select
              value={toCode}
              onChange={(event) => setToCode(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold text-[var(--tools-muted)] sm:col-span-2">
            금액
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2"
            />
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">변환 결과</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">
            {formatNumber(result.converted)} {to.code}
          </p>
          <p className="mt-2 text-sm text-[var(--tools-muted)]">
            1 {from.code} = {formatNumber(result.rate, 4)} {to.code}
          </p>
          <p className="text-sm text-[var(--tools-muted)]">
            1 {to.code} = {formatNumber(result.reverseRate, 4)} {from.code}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">주요 통화 기준 환율</p>
          <div className="mt-2 max-h-48 space-y-1 overflow-auto text-sm text-[var(--tools-muted)]">
            {currencies
              .filter((currency) => currency.code !== "KRW")
              .map((currency) => (
                <p key={currency.code}>
                  {currency.perHundred ? "100" : "1"} {currency.code} ={" "}
                  <strong className="text-[var(--tools-primary-strong)]">
                    {currency.rateToKRW.toLocaleString("ko-KR")} KRW
                  </strong>
                </p>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
