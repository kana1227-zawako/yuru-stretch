"use client";

import { useState } from "react";
import SelectScreen from "@/components/SelectScreen";
import StretchScreen from "@/components/StretchScreen";
import CompleteScreen from "@/components/CompleteScreen";
import type { BodyPartId, Minutes } from "@/lib/stretches";

type Screen = "select" | "stretch" | "complete";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("select");
  const [part, setPart] = useState<BodyPartId | null>(null);
  const [minutes, setMinutes] = useState<Minutes | null>(null);
  // もう一度行うときにタイマーを確実に初期化するためのキー
  const [session, setSession] = useState(0);

  const go = (next: Screen) => {
    setScreen(next);
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="mx-auto w-full max-w-xl px-5 py-8 sm:py-12">
      {screen === "select" && (
        <SelectScreen
          part={part}
          minutes={minutes}
          onPartChange={setPart}
          onMinutesChange={setMinutes}
          onStart={() => {
            setSession((s) => s + 1);
            go("stretch");
          }}
        />
      )}
      {screen === "stretch" && part && minutes && (
        <StretchScreen
          key={session}
          partId={part}
          minutes={minutes}
          onComplete={() => go("complete")}
          onQuit={() => go("select")}
        />
      )}
      {screen === "complete" && part && minutes && (
        <CompleteScreen
          partId={part}
          minutes={minutes}
          onRetry={() => {
            setSession((s) => s + 1);
            go("stretch");
          }}
          onHome={() => go("select")}
        />
      )}
    </main>
  );
}
