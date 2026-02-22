"use client";

import { useMemo, useState } from "react";

const puzzle = [
  [0, 0, 0, 2, 6, 0, 7, 0, 1],
  [6, 8, 0, 0, 7, 0, 0, 9, 0],
  [1, 9, 0, 0, 0, 4, 5, 0, 0],
  [8, 2, 0, 1, 0, 0, 0, 4, 0],
  [0, 0, 4, 6, 0, 2, 9, 0, 0],
  [0, 5, 0, 0, 0, 3, 0, 2, 8],
  [0, 0, 9, 3, 0, 0, 0, 7, 4],
  [0, 4, 0, 0, 5, 0, 0, 3, 6],
  [7, 0, 3, 0, 1, 8, 0, 0, 0],
];

const solution = [
  [4, 3, 5, 2, 6, 9, 7, 8, 1],
  [6, 8, 2, 5, 7, 1, 4, 9, 3],
  [1, 9, 7, 8, 3, 4, 5, 6, 2],
  [8, 2, 6, 1, 9, 5, 3, 4, 7],
  [3, 7, 4, 6, 8, 2, 9, 1, 5],
  [9, 5, 1, 7, 4, 3, 6, 2, 8],
  [5, 1, 9, 3, 2, 6, 8, 7, 4],
  [2, 4, 8, 9, 5, 7, 1, 3, 6],
  [7, 6, 3, 4, 1, 8, 2, 5, 9],
];

const SIZE = 9;

function cloneBoard(board: number[][]) {
  return board.map((row) => [...row]);
}

function isFixed(row: number, col: number) {
  return puzzle[row][col] !== 0;
}

function hasConflict(board: number[][], row: number, col: number) {
  const value = board[row][col];
  if (value === 0) return false;

  for (let i = 0; i < SIZE; i += 1) {
    if (i !== col && board[row][i] === value) return true;
    if (i !== row && board[i][col] === value) return true;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r += 1) {
    for (let c = boxCol; c < boxCol + 3; c += 1) {
      if ((r !== row || c !== col) && board[r][c] === value) return true;
    }
  }

  return false;
}

export function SudokuGame() {
  const [board, setBoard] = useState<number[][]>(cloneBoard(puzzle));
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);

  const completed = useMemo(
    () => board.every((row, r) => row.every((value, c) => value === solution[r][c])),
    [board],
  );

  const setValue = (value: number) => {
    if (!selected) return;
    const { row, col } = selected;
    if (isFixed(row, col)) return;
    const next = cloneBoard(board);
    next[row][col] = value;
    setBoard(next);
  };

  const reset = () => {
    setBoard(cloneBoard(puzzle));
    setSelected(null);
  };

  const fillSolution = () => {
    setBoard(cloneBoard(solution));
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">스도쿠</h1>
      <p className="mt-2 text-[var(--tools-muted)]">칸을 선택한 뒤 숫자를 눌러 퍼즐을 완성하세요.</p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-4 sm:p-6">
        <div className="mx-auto grid w-fit grid-cols-9 gap-0.5 rounded-xl bg-[var(--tools-border)] p-1">
          {board.map((row, r) =>
            row.map((value, c) => {
              const fixed = isFixed(r, c);
              const conflict = hasConflict(board, r, c);
              const selectedCell = selected?.row === r && selected?.col === c;

              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => setSelected({ row: r, col: c })}
                  className={[
                    "h-10 w-10 border text-sm font-semibold sm:h-12 sm:w-12 sm:text-base",
                    fixed
                      ? "bg-slate-100 text-slate-800"
                      : conflict
                        ? "bg-rose-50 text-rose-700"
                        : "bg-white text-[var(--tools-primary-strong)]",
                    selectedCell ? "ring-2 ring-[var(--tools-primary)]" : "",
                    (c + 1) % 3 === 0 && c !== 8 ? "border-r-2 border-r-slate-500" : "border-slate-200",
                    (r + 1) % 3 === 0 && r !== 8 ? "border-b-2 border-b-slate-500" : "",
                  ].join(" ")}
                >
                  {value === 0 ? "" : value}
                </button>
              );
            }),
          )}
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setValue(num)}
              className="h-10 w-10 rounded-lg border border-[var(--tools-border)] bg-[var(--tools-accent)]/20 font-semibold text-[var(--tools-primary-strong)] transition hover:bg-[var(--tools-accent)]/40"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setValue(0)}
            className="rounded-lg border border-[var(--tools-border)] px-3 text-sm font-semibold text-[var(--tools-muted)] transition hover:bg-slate-50"
          >
            지우기
          </button>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-[var(--tools-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--tools-primary-strong)]"
          >
            새 게임
          </button>
          <button
            type="button"
            onClick={fillSolution}
            className="rounded-lg border border-[var(--tools-border)] px-4 py-2 text-sm font-semibold text-[var(--tools-muted)] transition hover:bg-slate-50"
          >
            정답 보기
          </button>
        </div>

        {completed && (
          <p className="mt-4 text-center text-sm font-semibold text-emerald-700">
            퍼즐 완료! 잘하셨습니다.
          </p>
        )}
      </div>
    </section>
  );
}
