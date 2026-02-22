"use client";

import { useMemo, useState } from "react";

type Position = { row: number; col: number };
type Move = { from: Position; over: Position; to: Position };

const SIZE = 7;

const validCells = new Set(
  [
    [0, 2], [0, 3], [0, 4],
    [1, 2], [1, 3], [1, 4],
    [2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6],
    [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6],
    [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6],
    [5, 2], [5, 3], [5, 4],
    [6, 2], [6, 3], [6, 4],
  ].map(([r, c]) => `${r}-${c}`),
);

function initialBoard() {
  return Array.from({ length: SIZE }, (_, row) =>
    Array.from({ length: SIZE }, (_, col) => {
      if (!validCells.has(`${row}-${col}`)) return -1;
      if (row === 3 && col === 3) return 0;
      return 1;
    }),
  );
}

function cloneBoard(board: number[][]) {
  return board.map((row) => [...row]);
}

function getMoves(board: number[][], row: number, col: number): Move[] {
  if (board[row][col] !== 1) return [];
  const directions = [
    { dr: -2, dc: 0 },
    { dr: 2, dc: 0 },
    { dr: 0, dc: -2 },
    { dr: 0, dc: 2 },
  ];

  return directions
    .map(({ dr, dc }) => {
      const to = { row: row + dr, col: col + dc };
      const over = { row: row + dr / 2, col: col + dc / 2 };
      return { from: { row, col }, over, to };
    })
    .filter((move) => {
      const { to, over } = move;
      if (to.row < 0 || to.row >= SIZE || to.col < 0 || to.col >= SIZE) return false;
      return board[to.row][to.col] === 0 && board[over.row][over.col] === 1;
    });
}

export function PegSolitaireGame() {
  const [board, setBoard] = useState<number[][]>(initialBoard());
  const [selected, setSelected] = useState<Position | null>(null);
  const [history, setHistory] = useState<Move[]>([]);

  const validTargets = useMemo(() => {
    if (!selected) return [];
    return getMoves(board, selected.row, selected.col).map((move) => move.to);
  }, [board, selected]);

  const remaining = useMemo(
    () => board.flat().filter((cell) => cell === 1).length,
    [board],
  );

  const hasAnyMove = useMemo(() => {
    for (let r = 0; r < SIZE; r += 1) {
      for (let c = 0; c < SIZE; c += 1) {
        if (getMoves(board, r, c).length > 0) return true;
      }
    }
    return false;
  }, [board]);

  const clickCell = (row: number, col: number) => {
    const value = board[row][col];
    if (value === -1) return;

    if (value === 1) {
      setSelected((prev) => (prev?.row === row && prev?.col === col ? null : { row, col }));
      return;
    }

    if (value === 0 && selected) {
      const move = getMoves(board, selected.row, selected.col).find(
        (candidate) => candidate.to.row === row && candidate.to.col === col,
      );
      if (!move) return;

      const next = cloneBoard(board);
      next[move.from.row][move.from.col] = 0;
      next[move.over.row][move.over.col] = 0;
      next[move.to.row][move.to.col] = 1;
      setBoard(next);
      setHistory((prev) => [...prev, move]);
      setSelected(null);
    }
  };

  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;

    const next = cloneBoard(board);
    next[last.from.row][last.from.col] = 1;
    next[last.over.row][last.over.col] = 1;
    next[last.to.row][last.to.col] = 0;
    setBoard(next);
    setHistory((prev) => prev.slice(0, -1));
    setSelected(null);
  };

  const reset = () => {
    setBoard(initialBoard());
    setHistory([]);
    setSelected(null);
  };

  const status = remaining === 1 ? "클리어" : hasAnyMove ? "진행 중" : "막힘";

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--tools-primary-strong)]">페그 솔리테어</h1>
      <p className="mt-2 text-[var(--tools-muted)]">
        핀을 점프해서 제거하고 마지막에 1개만 남기세요.
      </p>

      <div className="mt-6 rounded-2xl border border-[var(--tools-border)] bg-white p-4 sm:p-6">
        <div className="mx-auto grid w-fit grid-cols-7 gap-2 rounded-2xl bg-slate-800 p-4">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isSelected = selected?.row === r && selected?.col === c;
              const isTarget = validTargets.some((target) => target.row === r && target.col === c);
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  onClick={() => clickCell(r, c)}
                  className={[
                    "h-10 w-10 rounded-full transition sm:h-12 sm:w-12",
                    cell === -1 ? "invisible" : "",
                    cell === 1 ? "bg-[var(--tools-primary)] shadow-md hover:brightness-110" : "bg-slate-500",
                    isSelected ? "ring-4 ring-amber-300" : "",
                    isTarget ? "ring-4 ring-emerald-300" : "",
                  ].join(" ")}
                />
              );
            }),
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-[var(--tools-accent)]/20 px-3 py-1 text-sm font-semibold text-[var(--tools-primary-strong)]">
            남은 핀: {remaining}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
            상태: {status}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={undo}
            className="rounded-lg border border-[var(--tools-border)] px-4 py-2 text-sm font-semibold text-[var(--tools-muted)] transition hover:bg-slate-50"
          >
            한 수 되돌리기
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-[var(--tools-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--tools-primary-strong)]"
          >
            새 게임
          </button>
        </div>
      </div>
    </section>
  );
}
