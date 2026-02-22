"use client";

import { useMemo, useState } from "react";

type Category = {
  label: string;
  min: number;
  max: number;
  color: string;
};

const categories: Category[] = [
  { label: "저체중", min: 0, max: 18.5, color: "#3b82f6" },
  { label: "정상", min: 18.5, max: 23, color: "#16a34a" },
  { label: "과체중", min: 23, max: 25, color: "#f59e0b" },
  { label: "비만", min: 25, max: 30, color: "#f97316" },
  { label: "고도비만", min: 30, max: Number.POSITIVE_INFINITY, color: "#dc2626" },
];

export function BmiCalculator() {
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);

  const result = useMemo(() => {
    if (heightCm <= 0 || weightKg <= 0) return null;

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const category = categories.find((item) => bmi >= item.min && bmi < item.max) ?? categories[0];
    const normalMin = 18.5 * heightM * heightM;
    const normalMax = 22.9 * heightM * heightM;

    return {
      bmi,
      category,
      normalMin,
      normalMax,
    };
  }, [heightCm, weightKg]);

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">BMI 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">키와 몸무게 입력만으로 BMI와 체중 범위를 간단히 확인할 수 있습니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            키(cm)
            <input
              type="number"
              min={100}
              max={250}
              value={heightCm}
              onChange={(event) => setHeightCm(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 text-base outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            몸무게(kg)
            <input
              type="number"
              min={20}
              max={300}
              value={weightKg}
              onChange={(event) => setWeightKg(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 text-base outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
        </div>
      </div>

      {result && (
        <div className="mt-5 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">현재 BMI</p>
          <p className="mt-1 text-4xl font-bold" style={{ color: result.category.color }}>
            {result.bmi.toFixed(1)}
          </p>
          <p className="mt-2 inline-flex rounded-full px-3 py-1 text-sm font-bold text-white" style={{ backgroundColor: result.category.color }}>
            {result.category.label}
          </p>
          <p className="mt-4 text-sm text-[var(--tools-muted)]">
            정상 체중 범위: {result.normalMin.toFixed(1)}kg ~ {result.normalMax.toFixed(1)}kg
          </p>
        </div>
      )}
    </section>
  );
}
