"use client";

import { useMemo, useState } from "react";

type Market = "kospi" | "kosdaq" | "us";

const taxRate: Record<Market, number> = {
  kospi: 0.0018,
  kosdaq: 0.0018,
  us: 0,
};

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function StockReturnCalculator() {
  const [market, setMarket] = useState<Market>("kospi");
  const [buyPrice, setBuyPrice] = useState(50000);
  const [sellPrice, setSellPrice] = useState(65000);
  const [quantity, setQuantity] = useState(100);
  const [commissionPct, setCommissionPct] = useState(0.015);

  const result = useMemo(() => {
    if (buyPrice <= 0 || sellPrice <= 0 || quantity <= 0) return null;
    const commission = commissionPct / 100;
    const totalBuy = buyPrice * quantity;
    const totalSell = sellPrice * quantity;
    const buyCommission = totalBuy * commission;
    const sellCommission = totalSell * commission;
    const transactionTax = totalSell * taxRate[market];
    const grossProfit = totalSell - totalBuy;

    let capitalGainTax = 0;
    if (market === "us" && grossProfit > 0) {
      const taxBase = Math.max(0, grossProfit - buyCommission - sellCommission - 2500000);
      capitalGainTax = taxBase * 0.22;
    }

    const netProfit = grossProfit - buyCommission - sellCommission - transactionTax - capitalGainTax;
    const netRate = (netProfit / (totalBuy + buyCommission)) * 100;

    return {
      totalBuy: Math.round(totalBuy),
      totalSell: Math.round(totalSell),
      grossProfit: Math.round(grossProfit),
      netProfit: Math.round(netProfit),
      netRate,
      commission: Math.round(buyCommission + sellCommission),
      transactionTax: Math.round(transactionTax),
      capitalGainTax: Math.round(capitalGainTax),
    };
  }, [market, buyPrice, sellPrice, quantity, commissionPct]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">주식 수익률 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">수수료/거래세/해외양도세를 반영한 순수익을 계산합니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            시장
            <select value={market} onChange={(e) => setMarket(e.target.value as Market)} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2">
              <option value="kospi">KOSPI</option>
              <option value="kosdaq">KOSDAQ</option>
              <option value="us">미국주식</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            수량(주)
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            매수가(원)
            <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            매도가(원)
            <input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)] sm:col-span-2">
            수수료(%)
            <input type="number" step="0.001" value={commissionPct} onChange={(e) => setCommissionPct(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2" />
          </label>
        </div>
      </div>

      {result && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
            <p className="text-sm text-[var(--tools-muted)]">매매 요약</p>
            <p className="mt-2 text-sm text-[var(--tools-muted)]">매수: <strong className="text-[var(--tools-primary-strong)]">{formatWon(result.totalBuy)}</strong></p>
            <p className="text-sm text-[var(--tools-muted)]">매도: <strong className="text-[var(--tools-primary-strong)]">{formatWon(result.totalSell)}</strong></p>
            <p className="text-sm text-[var(--tools-muted)]">수수료: {formatWon(result.commission)}</p>
            <p className="text-sm text-[var(--tools-muted)]">거래세: {formatWon(result.transactionTax)}</p>
            {market === "us" && <p className="text-sm text-[var(--tools-muted)]">양도세(추정): {formatWon(result.capitalGainTax)}</p>}
          </div>
          <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
            <p className="text-sm text-[var(--tools-muted)]">수익</p>
            <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">{result.netProfit >= 0 ? "+" : ""}{formatWon(result.netProfit)}</p>
            <p className="mt-2 text-sm text-[var(--tools-muted)]">순수익률: {result.netProfit >= 0 ? "+" : ""}{result.netRate.toFixed(2)}%</p>
            <p className="text-sm text-[var(--tools-muted)]">총손익(세전): {formatWon(result.grossProfit)}</p>
          </div>
        </div>
      )}
    </section>
  );
}
