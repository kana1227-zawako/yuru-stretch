"use client";

import { BODY_PARTS, GENERAL_CAUTIONS, MINUTES_OPTIONS, type BodyPartId, type Minutes } from "@/lib/stretches";

type Props = {
  part: BodyPartId | null;
  minutes: Minutes | null;
  onPartChange: (p: BodyPartId) => void;
  onMinutesChange: (m: Minutes) => void;
  onStart: () => void;
};

const optionBase =
  "rounded-2xl border-2 px-4 py-4 text-left transition focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sage";
const optionOn = "border-sage bg-sage-light shadow-sm";
const optionOff = "border-beige bg-white hover:border-beige-dark";

export default function SelectScreen({ part, minutes, onPartChange, onMinutesChange, onStart }: Props) {
  const ready = part !== null && minutes !== null;

  return (
    <div className="space-y-8">
      <header className="text-center">
        <p className="text-sm tracking-widest text-ink-soft">YURU STRETCH</p>
        <h1 className="mt-1 text-4xl font-bold tracking-wide">ゆるストレッチ</h1>
        <p className="mt-3 text-lg text-ink-soft">
          えらぶだけで、すぐ始められる。
          <br />
          3分からの、からだほぐし。
        </p>
      </header>

      <section aria-labelledby="part-heading" className="rounded-3xl bg-white/70 p-5 shadow-sm">
        <h2 id="part-heading" className="mb-4 text-xl font-bold">
          <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-beige text-base">1</span>
          ほぐしたい部位
        </h2>
        <div role="radiogroup" aria-labelledby="part-heading" className="grid grid-cols-2 gap-3">
          {BODY_PARTS.map((p) => {
            const selected = part === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onPartChange(p.id)}
                className={`${optionBase} ${selected ? optionOn : optionOff}`}
              >
                <span className="block text-xl font-bold">{p.label}</span>
                <span className="mt-1 block text-sm leading-snug text-ink-soft">{p.description}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="time-heading" className="rounded-3xl bg-white/70 p-5 shadow-sm">
        <h2 id="time-heading" className="mb-4 text-xl font-bold">
          <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-beige text-base">2</span>
          時間
        </h2>
        <div role="radiogroup" aria-labelledby="time-heading" className="grid grid-cols-3 gap-3">
          {MINUTES_OPTIONS.map((m) => {
            const selected = minutes === m;
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onMinutesChange(m)}
                className={`${optionBase} text-center ${selected ? optionOn : optionOff}`}
              >
                <span className="text-3xl font-bold">{m}</span>
                <span className="ml-1 text-lg">分</span>
              </button>
            );
          })}
        </div>
      </section>

      <div>
        <button
          type="button"
          onClick={onStart}
          disabled={!ready}
          className="w-full rounded-full bg-sage py-5 text-2xl font-bold text-white shadow-md transition hover:bg-sage-dark focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:cursor-not-allowed disabled:bg-beige-dark disabled:shadow-none"
        >
          ストレッチをはじめる
        </button>
        {!ready && (
          <p className="mt-3 text-center text-base text-ink-soft" aria-live="polite">
            部位と時間をえらんでください
          </p>
        )}
      </div>

      <section className="rounded-2xl border border-beige-dark bg-beige/60 p-5 text-base">
        <h2 className="mb-2 font-bold">はじめる前に</h2>
        <ul className="list-disc space-y-1 pl-5">
          {GENERAL_CAUTIONS.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-ink-soft">
          ※このアプリは一般的なストレッチの案内です。医療的な効果や治療効果を保証するものではありません。
        </p>
      </section>
    </div>
  );
}
