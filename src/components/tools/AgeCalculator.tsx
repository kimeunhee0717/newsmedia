"use client";

import { useMemo, useState } from "react";

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function AgeCalculator() {
  const today = new Date();
  const todayString = formatDate(today);

  const [birthDate, setBirthDate] = useState("1990-01-15");
  const [baseDate, setBaseDate] = useState(todayString);

  const result = useMemo(() => {
    if (!birthDate || !baseDate) return null;
    const birth = new Date(`${birthDate}T00:00:00`);
    const base = new Date(`${baseDate}T00:00:00`);
    if (Number.isNaN(birth.getTime()) || Number.isNaN(base.getTime())) return null;
    if (birth > base) return null;

    let internationalAge = base.getFullYear() - birth.getFullYear();
    const hasBirthdayPassed =
      base.getMonth() > birth.getMonth() ||
      (base.getMonth() === birth.getMonth() && base.getDate() >= birth.getDate());
    if (!hasBirthdayPassed) {
      internationalAge -= 1;
    }

    const yearAge = base.getFullYear() - birth.getFullYear();
    const koreanTraditionalAge = yearAge + 1;
    const daysLived = Math.floor((base.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    let nextBirthday = new Date(base.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= base) {
      nextBirthday = new Date(base.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysToBirthday = Math.ceil((nextBirthday.getTime() - base.getTime()) / (1000 * 60 * 60 * 24));

    return {
      internationalAge,
      yearAge,
      koreanTraditionalAge,
      daysLived,
      daysToBirthday,
      isBirthday: daysToBirthday === 0,
    };
  }, [birthDate, baseDate]);

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">만나이 계산기</h1>
      <p className="mt-2 text-[var(--tools-muted)]">생년월일을 기준으로 현재 나이와 관련 정보를 빠르게 확인할 수 있습니다.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            생년월일
            <input
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 text-base outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
          <label className="text-sm font-semibold text-[var(--tools-muted)]">
            기준일
            <input
              type="date"
              value={baseDate}
              onChange={(event) => setBaseDate(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[var(--tools-border)] px-3 py-2 text-base outline-none focus:border-[var(--tools-primary)]"
            />
          </label>
        </div>
      </div>

      {result && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
            <p className="text-sm text-[var(--tools-muted)]">만나이</p>
            <p className="mt-1 text-3xl font-bold text-[var(--tools-primary-strong)]">{result.internationalAge}세</p>
            <p className="mt-3 text-sm text-[var(--tools-muted)]">연나이: {result.yearAge}세</p>
            <p className="text-sm text-[var(--tools-muted)]">세는나이(전통): {result.koreanTraditionalAge}세</p>
          </div>
          <div className="rounded-2xl border border-[var(--tools-border)] bg-white p-5">
            <p className="text-sm text-[var(--tools-muted)]">살아온 날짜</p>
            <p className="mt-1 text-3xl font-bold text-[var(--tools-primary-strong)]">{result.daysLived.toLocaleString()}일</p>
            <p className="mt-3 text-sm text-[var(--tools-muted)]">
              {result.isBirthday ? "오늘이 생일입니다." : `다음 생일까지 ${result.daysToBirthday}일 남았습니다.`}
            </p>
          </div>
        </div>
      )}

      {!result && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          생년월일은 기준일보다 미래일 수 없습니다.
        </p>
      )}
    </section>
  );
}
