"use client";

import { getBodyPart, type BodyPartId, type Minutes } from "@/lib/stretches";

type Props = {
  partId: BodyPartId;
  minutes: Minutes;
  onRetry: () => void;
  onHome: () => void;
};

export default function CompleteScreen({ partId, minutes, onRetry, onHome }: Props) {
  const part = getBodyPart(partId);

  return (
    <div className="space-y-8 pt-6 text-center">
      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-sage-light text-6xl" aria-hidden>
        🌿
      </div>
      <div>
        <h1 className="text-3xl font-bold">おつかれさまでした</h1>
        <p className="mt-4 text-lg">
          {part.label}の{minutes}分ストレッチが完了しました。
        </p>
        <p className="mt-2 text-lg text-ink-soft">
          お水を一口飲んで、ひと息つきましょう。
          <br />
          無理なく、続けていけたら十分です。
        </p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onRetry}
          className="w-full rounded-full bg-sage py-5 text-2xl font-bold text-white shadow-md hover:bg-sage-dark"
        >
          もう一度行う
        </button>
        <button
          type="button"
          onClick={onHome}
          className="w-full rounded-full border-2 border-beige-dark bg-white py-4 text-xl font-bold hover:bg-beige/50"
        >
          メイン画面へ戻る
        </button>
      </div>
    </div>
  );
}
