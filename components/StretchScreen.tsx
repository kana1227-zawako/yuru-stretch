"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QuitDialog from "@/components/QuitDialog";
import { buildMenu, getBodyPart, type BodyPartId, type Minutes } from "@/lib/stretches";

type Status = "ready" | "running" | "paused";

type Props = {
  partId: BodyPartId;
  minutes: Minutes;
  onComplete: () => void;
  onQuit: () => void;
};

function formatTime(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function StretchScreen({ partId, minutes, onComplete, onQuit }: Props) {
  const part = getBodyPart(partId);
  const steps = useMemo(() => buildMenu(partId, minutes), [partId, minutes]);

  const [index, setIndex] = useState(0);
  const [remainingMs, setRemainingMs] = useState(steps[0].seconds * 1000);
  const [status, setStatus] = useState<Status>("ready");
  const [soundOn, setSoundOn] = useState(true);
  const [quitOpen, setQuitOpen] = useState(false);

  const indexRef = useRef(0);
  const endAtRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const soundOnRef = useRef(soundOn);
  const audioRef = useRef<AudioContext | null>(null);
  // 確認画面を開いたときにタイマーが動いていたか（「続ける」で再開するため）
  const resumeAfterQuitCancelRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  // 切り替わりの合図音（やさしいチャイム）
  const chime = useCallback((times = 1) => {
    const ctx = audioRef.current;
    if (!ctx || !soundOnRef.current) return;
    for (let i = 0; i < times; i++) {
      const t = ctx.currentTime + i * 0.35;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    }
  }, []);

  const ensureAudio = () => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctor) audioRef.current = new Ctor();
    }
    audioRef.current?.resume().catch(() => {});
  };

  const goTo = useCallback(
    (next: number) => {
      indexRef.current = next;
      const ms = steps[next].seconds * 1000;
      endAtRef.current = Date.now() + ms;
      setIndex(next);
      setRemainingMs(ms);
    },
    [steps],
  );

  // タイマー本体：終了時刻との差で計算するので、処理の遅れで時間がずれない
  useEffect(() => {
    if (status !== "running") return;
    const id = window.setInterval(() => {
      const now = Date.now();
      let left = endAtRef.current - now;
      if (left > 0) {
        setRemainingMs(left);
        return;
      }
      // 画面が裏に回っていた場合なども考え、経過分だけステップを進める
      let next = indexRef.current;
      while (left <= 0) {
        next += 1;
        if (next >= steps.length) {
          window.clearInterval(id);
          chime(3);
          onCompleteRef.current();
          return;
        }
        left += steps[next].seconds * 1000;
      }
      indexRef.current = next;
      endAtRef.current = now + left;
      setIndex(next);
      setRemainingMs(left);
      chime(1);
    }, 200);
    return () => window.clearInterval(id);
  }, [status, steps, chime]);

  const start = () => {
    ensureAudio();
    endAtRef.current = Date.now() + remainingMs;
    setStatus("running");
  };

  const pause = () => {
    setRemainingMs(Math.max(0, endAtRef.current - Date.now()));
    setStatus("paused");
  };

  const reset = () => {
    indexRef.current = 0;
    setIndex(0);
    setRemainingMs(steps[0].seconds * 1000);
    setStatus("ready");
  };

  const skip = (delta: 1 | -1) => {
    const next = index + delta;
    if (next < 0) return;
    if (next >= steps.length) {
      onComplete();
      return;
    }
    goTo(next);
  };

  // 一度もスタートしていない（またはリセット直後の）状態なら、確認なしで戻る
  const isInProgress = status !== "ready" || index > 0 || remainingMs < steps[0].seconds * 1000;

  const requestQuit = () => {
    if (!isInProgress) {
      onQuit();
      return;
    }
    resumeAfterQuitCancelRef.current = status === "running";
    if (status === "running") pause();
    setQuitOpen(true);
  };

  const cancelQuit = useCallback(() => {
    setQuitOpen(false);
    if (resumeAfterQuitCancelRef.current) {
      resumeAfterQuitCancelRef.current = false;
      // 一時停止した残り時間から再開（確認中は一時停止しているので remainingMs は変わらない）
      endAtRef.current = Date.now() + remainingMs;
      setStatus("running");
    }
  }, [remainingMs]);

  const confirmQuit = () => {
    resumeAfterQuitCancelRef.current = false;
    setQuitOpen(false);
    onQuit();
  };

  const step = steps[index];
  const nextStep = steps[index + 1];
  const stepTotalMs = step.seconds * 1000;
  const stepProgress = 1 - remainingMs / stepTotalMs;
  const totalRemainingMs = remainingMs + steps.slice(index + 1).reduce((sum, s) => sum + s.seconds * 1000, 0);
  const totalMs = minutes * 60 * 1000;
  const overallProgress = 1 - totalRemainingMs / totalMs;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={requestQuit}
          className="rounded-full border-2 border-beige-dark bg-white px-5 py-2 text-lg font-bold hover:bg-beige/50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-sage"
        >
          ✕ やめる
        </button>
        <button
          type="button"
          onClick={() => setSoundOn((v) => !v)}
          aria-pressed={soundOn}
          className="rounded-full border border-beige-dark bg-white px-4 py-2 text-base"
        >
          合図の音：{soundOn ? "オン" : "オフ"}
        </button>
      </div>

      {/* 全体の進み具合 */}
      <div>
        <div className="mb-1 flex justify-between text-base text-ink-soft">
          <span>
            {part.label}・{minutes}分コース
          </span>
          <span>
            {index + 1} / {steps.length}
          </span>
        </div>
        <div
          className="h-3 overflow-hidden rounded-full bg-beige"
          role="progressbar"
          aria-label="全体の進み具合"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(overallProgress * 100)}
        >
          <div className="h-full rounded-full bg-sage transition-[width] duration-200" style={{ width: `${overallProgress * 100}%` }} />
        </div>
        <p className="mt-1 text-right text-base text-ink-soft">のこり合計 {formatTime(totalRemainingMs)}</p>
      </div>

      <article className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-beige px-3 py-1">{step.posture}</span>
          {step.round > 1 && <span className="rounded-full bg-sage-light px-3 py-1">{step.round}周目</span>}
        </div>

        <h1 className="mt-3 text-3xl font-bold" aria-live="polite">
          {step.name}
          {step.side && (
            <span className="ml-2 inline-block rounded-lg bg-clay px-2 py-0.5 align-middle text-xl text-white">{step.side}</span>
          )}
        </h1>

        {/* タイマー */}
        <div className="my-6 text-center">
          <p className="text-base text-ink-soft">
            {status === "ready" ? "準備ができたらスタート" : status === "paused" ? "一時停止中" : "のこり時間"}
          </p>
          <p
            className={`text-7xl font-bold tabular-nums tracking-wider ${status === "paused" ? "text-ink-soft" : ""}`}
            role="timer"
            aria-label={`のこり ${formatTime(remainingMs)}`}
          >
            {formatTime(remainingMs)}
          </p>
          <div className="mx-auto mt-3 h-2 max-w-xs overflow-hidden rounded-full bg-beige">
            <div className="h-full rounded-full bg-clay/80 transition-[width] duration-200" style={{ width: `${stepProgress * 100}%` }} />
          </div>
          <p className="mt-2 text-base text-ink-soft">
            {step.seconds}秒{step.side ? `（${step.side}側）` : ""}
            {step.reps ? `・${step.reps}` : ""}
          </p>
        </div>

        {/* 操作ボタン */}
        <div className="grid grid-cols-2 gap-3">
          {status === "running" ? (
            <button
              type="button"
              onClick={pause}
              className="col-span-2 rounded-full bg-ink py-5 text-2xl font-bold text-white shadow-md hover:bg-ink/90"
            >
              一時停止
            </button>
          ) : (
            <button
              type="button"
              onClick={start}
              className="col-span-2 rounded-full bg-sage py-5 text-2xl font-bold text-white shadow-md hover:bg-sage-dark"
            >
              {status === "ready" ? "スタート" : "再開"}
            </button>
          )}
          <button
            type="button"
            onClick={() => skip(-1)}
            disabled={index === 0}
            className="rounded-full border-2 border-beige-dark bg-white py-3 text-lg disabled:opacity-40"
          >
            ‹ 前へ
          </button>
          <button
            type="button"
            onClick={() => skip(1)}
            className="rounded-full border-2 border-beige-dark bg-white py-3 text-lg"
          >
            次へ ›
          </button>
          <button
            type="button"
            onClick={reset}
            className="col-span-2 rounded-full py-2 text-lg text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            リセット（最初から）
          </button>
          <button
            type="button"
            onClick={requestQuit}
            className="col-span-2 rounded-full border-2 border-clay bg-white py-3 text-lg font-bold text-clay hover:bg-beige/50"
          >
            ストレッチをやめる
          </button>
        </div>
      </article>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-bold">やり方</h2>
        <ol className="space-y-3 text-lg">
          {step.instructions.map((text, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage-light text-base font-bold">
                {i + 1}
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
        <div className="mt-5 rounded-2xl border-l-4 border-clay bg-beige/60 p-4 text-base">
          <p className="font-bold">注意</p>
          <p>{step.caution}</p>
          <p className="mt-1">痛みが出たら、すぐに中止してください。</p>
        </div>
      </section>

      {nextStep && (
        <p className="text-center text-base text-ink-soft">
          つぎ：{nextStep.name}
          {nextStep.side ? `（${nextStep.side}）` : ""}
        </p>
      )}

      <QuitDialog open={quitOpen} onContinue={cancelQuit} onQuit={confirmQuit} />
    </div>
  );
}
