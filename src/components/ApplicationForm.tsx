"use client";

import { useState, useTransition } from "react";
import { SESSION_OPTIONS } from "@/types";
import { createJamEntry } from "@/lib/actions";

type FormState = {
  songTitle: string;
  applicantName: string;
  desiredSession: string;
  instrumentName: string;
  noteUrl: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function ApplicationForm() {
  const [form, setForm] = useState<FormState>({
    songTitle: "",
    applicantName: "",
    desiredSession: "",
    instrumentName: "",
    noteUrl: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();

  const isOtherInstrument = form.desiredSession === "기타 악기";

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!form.songTitle.trim()) next.songTitle = "곡명을 입력해 주세요.";
    if (!form.applicantName.trim()) next.applicantName = "신청자 이름을 입력해 주세요.";
    if (!form.desiredSession) next.desiredSession = "희망 세션을 선택해 주세요.";
    if (isOtherInstrument && !form.instrumentName.trim())
      next.instrumentName = "악기명을 입력해 주세요.";
    return next;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    // 세션이 "기타 악기"에서 다른 값으로 바뀌면 악기명을 초기화한다
    if (name === "desiredSession" && value !== "기타 악기") {
      setForm((prev) => ({ ...prev, desiredSession: value, instrumentName: "" }));
      setErrors((prev) => ({ ...prev, desiredSession: undefined, instrumentName: undefined }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
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
      await createJamEntry({
        songTitle: form.songTitle,
        applicantName: form.applicantName,
        desiredSession: form.desiredSession,
        instrumentName: form.instrumentName || undefined,
        noteUrl: form.noteUrl || undefined,
      });
      setForm({ songTitle: "", applicantName: "", desiredSession: "", instrumentName: "", noteUrl: "" });
    });
  }

  return (
    <section className="px-4 py-8 bg-zinc-900 border-t border-zinc-700">
      <h2 className="text-lg font-semibold text-gray-100 mb-1">곡 신청하기</h2>
      <p className="text-sm text-gray-400 mb-5">
        신청할 곡을 셋리스트에 올리세요. 곡을 정하지 못하겠다면 하단의 Easy 곡 리스트를 참고하세요.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 max-w-lg">
        {/* 곡명 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            곡명 <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            name="songTitle"
            value={form.songTitle}
            onChange={handleChange}
            placeholder="예: Autumn Leaves"
            className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.songTitle && (
            <p className="mt-1 text-xs text-red-400">{errors.songTitle}</p>
          )}
        </div>

        {/* 신청자 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            신청자 <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            name="applicantName"
            value={form.applicantName}
            onChange={handleChange}
            placeholder="예: 신동주"
            className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {errors.applicantName && (
            <p className="mt-1 text-xs text-red-400">{errors.applicantName}</p>
          )}
        </div>

        {/* 희망 세션 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            희망 세션 <span className="text-amber-400">*</span>
          </label>
          <select
            name="desiredSession"
            value={form.desiredSession}
            onChange={handleChange}
            className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="" className="text-gray-500">세션을 선택하세요</option>
            {SESSION_OPTIONS.map((session) => (
              <option key={session} value={session}>
                {session}
              </option>
            ))}
          </select>
          {errors.desiredSession && (
            <p className="mt-1 text-xs text-red-400">{errors.desiredSession}</p>
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
            <span className="text-gray-500 font-normal">(선택 · 유튜브 링크만 첨부할 시 하이퍼링크가 생성됩니다)</span>
          </label>
          <input
            type="text"
            name="noteUrl"
            value={form.noteUrl}
            onChange={handleChange}
            placeholder="https://youtube.com/... 또는 메모"
            className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* 추가 참여 멤버 안내 */}
        <p className="text-xs text-gray-500">
          추가 참여 멤버는 신청 후 표에서 별도로 추가할 수 있습니다.
        </p>

        <button
          type="submit"
          disabled={isPending}
          className="w-full sm:w-auto rounded-md bg-amber-400 px-6 py-2 text-sm font-semibold text-zinc-900 hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "저장 중…" : "신청 추가"}
        </button>
      </form>
    </section>
  );
}
