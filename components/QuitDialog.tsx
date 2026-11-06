"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onContinue: () => void;
  onQuit: () => void;
};

/** 途中終了の確認画面（アプリのデザインに合わせたモーダル） */
export default function QuitDialog({ open, onContinue, onQuit }: Props) {
  const continueRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // 誤操作を防ぐため、最初は「続ける」にフォーカスを置く
    continueRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onContinue();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onContinue]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      onClick={onContinue}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quit-title"
        aria-describedby="quit-desc"
        className="w-full max-w-md rounded-3xl bg-cream p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="quit-title" className="text-2xl font-bold">
          ストレッチをやめますか？
        </h2>
        <p id="quit-desc" className="mt-3 text-lg text-ink-soft">
          タイマーは一時停止しています。
          <br />
          やめると、最初の画面にもどります。
        </p>
        <div className="mt-6 space-y-3">
          <button
            ref={continueRef}
            type="button"
            onClick={onContinue}
            className="w-full rounded-full bg-sage py-4 text-xl font-bold text-white shadow-md hover:bg-sage-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sage"
          >
            続ける
          </button>
          <button
            type="button"
            onClick={onQuit}
            className="w-full rounded-full border-2 border-clay bg-white py-4 text-xl font-bold text-clay hover:bg-beige/50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-clay"
          >
            やめる
          </button>
        </div>
      </div>
    </div>
  );
}
