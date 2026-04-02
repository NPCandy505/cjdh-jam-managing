"use client";

import { useState, useTransition } from "react";
import { SESSION_OPTIONS } from "@/types";
import { createOneClickRequest } from "@/lib/actions";

type FormState = {
  requesterName: string;
  preferredSession: string;
  instrumentName: string;
  memo: string;
};

type FormErrors = Partial<Record<"requesterName" | "preferredSession" | "instrumentName", string>>;

export default function OneClickSection() {
  const [form, setForm] = useState<FormState>({
    requesterName: "",
    preferredSession: "",
    instrumentName: "",
    memo: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isOtherInstrument = form.preferredSession === "기타 악기";

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!form.requesterName.trim()) next.requesterName = "이름을 입력해 주세요.";
    if (!form.preferredSession) next.preferredSession = "세션을 선택해 주세요.";
    if (isOtherInstrument && !form.instrumentName.trim())
      next.instrumentName = "악기명을 입력해 주세요.";
    return next;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    if (name === "preferredSession" && value !== "기타 악기") {
      setForm((prev) => ({ ...prev, preferredSession: value, instrumentName: "" }));
      setErrors((prev) => ({ ...prev, preferredSession: undefined, instrumentName: undefined }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    startTransition(async () => {
      await createOneClickRequest({
        requesterName: form.requesterName,
        preferredSession: form.preferredSession,
        instrumentName: form.instrumentName || undefined,
        memo: form.memo || undefined,
      });
      setSubmitted(true);
    });
  }

  function handleReset() {
    setForm({ requesterName: "", preferredSession: "", instrumentName: "", memo: "" });
    setErrors({});
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <section className="px-4 py-8 bg-zinc-900 border-t border-zinc-700">
        <div className="max-w-lg text-center mx-auto py-6">
          <p className="text-2xl mb-2">🎷</p>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">
            딸깍! 신청이 완료되었습니다.
          </h2>
          <p className="text-sm text-gray-400 mb-5">
            호스트의 확인 후 곡을 추천해 드릴게요.
          </p>
          <button
            onClick={handleReset}
            className="rounded-md bg-amber-400 px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-amber-300 transition-colors"
          >
            다시 신청하기
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 bg-zinc-900 border-t border-zinc-700">
      <h2 className="text-lg font-semibold text-gray-100 mb-1">
        곡은 모르겠지만 해보고는 싶다면?
      </h2>
      <p className="text-sm text-gray-400 mb-5">
        해보고는 싶지만 곡을 정하지 못하겠다면, 마법의 버튼을 눌러보세요.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 max-w-lg">
        {/* 참여자 이름 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            이름 <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            name="requesterName"
            value={form.requesterName}
            onChange={handleChange}
            placeholder="예: 신동주"
            className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.requesterName && (
            <p className="mt-1 text-xs text-red-400">{errors.requesterName}</p>
          )}
        </div>

        {/* 세션 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            세션 <span className="text-amber-400">*</span>
          </label>
          <select
            name="preferredSession"
            value={form.preferredSession}
            onChange={handleChange}
            className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">세션을 선택하세요</option>
            {SESSION_OPTIONS.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
          {errors.preferredSession && (
            <p className="mt-1 text-xs text-red-400">{errors.preferredSession}</p>
          )}
        </div>

        {/* 악기명 — "기타 악기" 선택 시에만 표시 */}
        {isOtherInstrument && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              악기명 <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              name="instrumentName"
              value={form.instrumentName}
              onChange={handleChange}
              placeholder="예: 트럼펫, 바이올린"
              className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {errors.instrumentName && (
              <p className="mt-1 text-xs text-red-400">{errors.instrumentName}</p>
            )}
          </div>
        )}

        {/* 비고 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            비고{" "}
            <span className="text-gray-500 font-normal">(선택 · 원하는 스타일 등)</span>
          </label>
          <textarea
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder="예: 쉬운 보사노바를 원해요"
            rows={2}
            className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto rounded-md bg-amber-400 px-6 py-2 text-sm font-semibold text-zinc-900 hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "저장 중…" : "딸-깍"}
        </button>
      </form>
    </section>
  );
}
