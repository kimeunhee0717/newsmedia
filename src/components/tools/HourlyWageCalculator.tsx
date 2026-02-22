"use client";

import { useMemo, useState } from "react";

type InputMode = "hourly" | "daily" | "monthly" | "yearly";

const modeLabel: Record<InputMode, string> = {
  hourly: "시급",
  daily: "일급",
  monthly: "월급",
  yearly: "연봉",
};

function formatWon(value: number) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

export function HourlyWageCalculator() {
  const [mode, setMode] = useState<InputMode>("hourly");
  const [value, setValue] = useState(10030);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [includeWeeklyHoliday, setIncludeWeeklyHoliday] = useState(true);
  const [referenceHourly, setReferenceHourly] = useState(10030);

  const result = useMemo(() => {
    const weeklyBaseHours = hoursPerDay * daysPerWeek;
    const weeklyHolidayHours = includeWeeklyHoliday && weeklyBaseHours >= 15 ? hoursPerDay : 0;
    const weeklyTotalHours = weeklyBaseHours + weeklyHolidayHours;
    const monthlyHours = weeklyTotalHours * (365 / 7 / 12);

    let hourly = 0;
    if (mode === "hourly") hourly = value;
    if (mode === "daily") hourly = hoursPerDay > 0 ? value / hoursPerDay : 0;
    if (mode === "monthly") hourly = monthlyHours > 0 ? value / monthlyHours : 0;
    if (mode === "yearly") hourly = monthlyHours > 0 ? value / (monthlyHours * 12) : 0;

    const daily = hourly * hoursPerDay;
    const monthly = hourly * monthlyHours;
    const yearly = monthly * 12;
    const diff = hourly - referenceHourly;

    return {
      hourly: Math.round(hourly),
      daily: Math.round(daily),
      monthly: Math.round(monthly),
      yearly: Math.round(yearly),
      monthlyHours: Math.round(monthlyHours * 10) / 10,
      diff: Math.round(diff),
      meetReference: hourly >= referenceHourly,
    };
  }, [mode, value, hoursPerDay, daysPerWeek, includeWeeklyHoliday, referenceHourly]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">시급/월급 변환 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">시급, 일급, 월급, 연봉을 상호 변환하고 기준 시급과 비교합니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            입력 방식
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as InputMode)}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            >
              <option value="hourly">시급</option>
              <option value="daily">일급</option>
              <option value="monthly">월급</option>
              <option value="yearly">연봉</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            {modeLabel[mode]} 입력(원)
            <input
              type="number"
              min={0}
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            1일 근무시간
            <input
              type="number"
              min={1}
              max={24}
              value={hoursPerDay}
              onChange={(event) => setHoursPerDay(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            주 근무일수
            <input
              type="number"
              min={1}
              max={7}
              value={daysPerWeek}
              onChange={(event) => setDaysPerWeek(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            기준 시급(원)
            <input
              type="number"
              min={0}
              value={referenceHourly}
              onChange={(event) => setReferenceHourly(Number(event.target.value))}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
          <label className="flex items-center gap-2 pt-8 text-sm font-semibold text-[var(--tools-muted)]">
            <input
              type="checkbox"
              checked={includeWeeklyHoliday}
              onChange={(event) => setIncludeWeeklyHoliday(event.target.checked)}
              className="h-4 w-4"
            />
            주휴수당 반영
          </label>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">변환 결과</p>
          <p className="mt-2 text-sm text-[var(--tools-muted)]">시급: <strong className="text-[var(--tools-primary-strong)]">{formatWon(result.hourly)}</strong></p>
          <p className="text-sm text-[var(--tools-muted)]">일급: <strong className="text-[var(--tools-primary-strong)]">{formatWon(result.daily)}</strong></p>
          <p className="text-sm text-[var(--tools-muted)]">월급: <strong className="text-[var(--tools-primary-strong)]">{formatWon(result.monthly)}</strong></p>
          <p className="text-sm text-[var(--tools-muted)]">연봉: <strong className="text-[var(--tools-primary-strong)]">{formatWon(result.yearly)}</strong></p>
          <p className="mt-3 text-sm text-[var(--tools-muted)]">월 환산 근로시간: {result.monthlyHours}시간</p>
        </div>
        <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
          <p className="text-sm text-[var(--tools-muted)]">기준 시급 비교</p>
          <p className="mt-1 text-2xl font-bold text-[var(--tools-primary-strong)]">
            {result.meetReference ? "기준 이상" : "기준 미달"}
          </p>
          <p className="mt-3 text-sm text-[var(--tools-muted)]">
            차이: {result.diff >= 0 ? "+" : ""}
            {formatWon(result.diff)}
          </p>
        </div>
      </div>
    </section>
  );
}
