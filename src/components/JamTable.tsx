"use client";

import React, { useState, useTransition, useRef, useEffect } from "react";
import { JamEntry, SESSION_OPTIONS } from "@/types";
import { addParticipant, updateJamEntry, deleteJamEntry } from "@/lib/actions";

type Props = {
  entries: JamEntry[];
};

type ParticipantForm = {
  name: string;
  session: string;
  instrumentName: string;
};

type EditForm = {
  songTitle: string;
  applicantName: string;
  desiredSession: string;
  instrumentName: string;
  noteUrl: string;
};

type ParticipantErrors = Partial<Record<keyof ParticipantForm, string>>;
type EditErrors = Partial<Record<keyof EditForm, string>>;

export default function JamTable({ entries }: Props) {
  // 추가 참여 폼
  const [activeParticipantId, setActiveParticipantId] = useState<string | null>(null);
  const [participantForm, setParticipantForm] = useState<ParticipantForm>({ name: "", session: "", instrumentName: "" });
  const [participantErrors, setParticipantErrors] = useState<ParticipantErrors>({});
  const [isParticipantPending, startParticipantTransition] = useTransition();

  // 수정/삭제 패널 (행 클릭으로 열림)
  const [activePanelId, setActivePanelId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ songTitle: "", applicantName: "", desiredSession: "", instrumentName: "", noteUrl: "" });
  const [editErrors, setEditErrors] = useState<EditErrors>({});
  const [isEditPending, startEditTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletePending, startDeleteTransition] = useTransition();

  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  const isParticipantOther = participantForm.session === "기타 악기";
  const isEditOther = editForm.desiredSession === "기타 악기";

  // 패널 바깥 클릭 시 닫기
  useEffect(() => {
    if (!activePanelId) return;
    function onPointerDown(e: PointerEvent) {
      if (tbodyRef.current && !tbodyRef.current.contains(e.target as Node)) {
        setActivePanelId(null);
        setShowDeleteConfirm(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [activePanelId]);

  // 참여 폼 바깥 클릭 시 닫기
  useEffect(() => {
    if (!activeParticipantId) return;
    function onPointerDown(e: PointerEvent) {
      if (tbodyRef.current && !tbodyRef.current.contains(e.target as Node)) {
        setActiveParticipantId(null);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [activeParticipantId]);

  // ── 행 클릭 (수정/삭제 패널) ─────────────────────────────────

  function handleRowClick(entry: JamEntry) {
    if (activePanelId === entry.id) {
      setActivePanelId(null);
      setShowDeleteConfirm(false);
      return;
    }
    setActivePanelId(entry.id);
    setActiveParticipantId(null);
    setShowDeleteConfirm(false);
    setEditForm({
      songTitle: entry.songTitle,
      applicantName: entry.applicantName,
      desiredSession: entry.desiredSession,
      instrumentName: entry.instrumentName ?? "",
      noteUrl: entry.noteUrl ?? "",
    });
    setEditErrors({});
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name === "desiredSession" && value !== "기타 악기") {
      setEditForm((prev) => ({ ...prev, desiredSession: value, instrumentName: "" }));
      setEditErrors((prev) => ({ ...prev, desiredSession: undefined, instrumentName: undefined }));
      return;
    }
    setEditForm((prev) => ({ ...prev, [name]: value }));
    if (editErrors[name as keyof EditForm]) {
      setEditErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleEditSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: EditErrors = {};
    if (!editForm.songTitle.trim()) next.songTitle = "곡명을 입력해 주세요.";
    if (!editForm.applicantName.trim()) next.applicantName = "신청자 이름을 입력해 주세요.";
    if (!editForm.desiredSession) next.desiredSession = "희망 세션을 선택해 주세요.";
    if (isEditOther && !editForm.instrumentName.trim()) next.instrumentName = "악기명을 입력해 주세요.";
    if (Object.keys(next).length > 0) {
      setEditErrors(next);
      return;
    }
    startEditTransition(async () => {
      await updateJamEntry(activePanelId!, {
        songTitle: editForm.songTitle,
        applicantName: editForm.applicantName,
        desiredSession: editForm.desiredSession,
        instrumentName: editForm.instrumentName || undefined,
        noteUrl: editForm.noteUrl || undefined,
      });
      setActivePanelId(null);
    });
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteJamEntry(activePanelId!);
      setActivePanelId(null);
      setShowDeleteConfirm(false);
    });
  }

  // ── 추가 참여 폼 ──────────────────────────────────────────────

  function openParticipantForm(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (activeParticipantId === id) {
      setActiveParticipantId(null);
      return;
    }
    setActiveParticipantId(id);
    setActivePanelId(null);
    setParticipantForm({ name: "", session: "", instrumentName: "" });
    setParticipantErrors({});
  }

  function handleParticipantChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name === "session" && value !== "기타 악기") {
      setParticipantForm((prev) => ({ ...prev, session: value, instrumentName: "" }));
      setParticipantErrors((prev) => ({ ...prev, session: undefined, instrumentName: undefined }));
      return;
    }
    setParticipantForm((prev) => ({ ...prev, [name]: value }));
    if (participantErrors[name as keyof ParticipantForm]) {
      setParticipantErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleParticipantSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: ParticipantErrors = {};
    if (!participantForm.name.trim()) next.name = "이름을 입력해 주세요.";
    if (!participantForm.session) next.session = "세션을 선택해 주세요.";
    if (isParticipantOther && !participantForm.instrumentName.trim())
      next.instrumentName = "악기명을 입력해 주세요.";
    if (Object.keys(next).length > 0) {
      setParticipantErrors(next);
      return;
    }
    startParticipantTransition(async () => {
      await addParticipant(activeParticipantId!, {
        name: participantForm.name.trim(),
        session: participantForm.session,
        instrumentName: isParticipantOther ? participantForm.instrumentName.trim() : undefined,
      });
      setActiveParticipantId(null);
    });
  }

  // ─────────────────────────────────────────────────────────────

  return (
    <section className="px-4 py-8 bg-zinc-950">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">신청 현황</h2>
      {entries.length === 0 ? (
        <p className="text-gray-500 text-sm">아직 신청된 곡이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-700">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-zinc-800 text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">곡명</th>
                <th className="px-4 py-3 whitespace-nowrap">신청자</th>
                <th className="px-4 py-3 whitespace-nowrap">희망 세션</th>
                <th className="px-4 py-3 whitespace-nowrap">추가 참여 멤버</th>
                <th className="px-4 py-3 whitespace-nowrap">비고</th>
                <th className="px-4 py-3 whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody ref={tbodyRef} className="divide-y divide-zinc-700">
              {entries.map((entry) => (
                <React.Fragment key={entry.id}>
                  {/* 데이터 행 — 클릭 시 수정/삭제 패널 토글 */}
                  <tr
                    onClick={() => handleRowClick(entry)}
                    className={`transition-colors cursor-pointer ${
                      activePanelId === entry.id
                        ? "bg-zinc-700"
                        : "bg-zinc-900 hover:bg-zinc-800"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-100 whitespace-nowrap">
                      {entry.songTitle}
                    </td>
                    <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                      {entry.applicantName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-amber-400/10 text-amber-400 border border-amber-400/20">
                        {entry.desiredSession === "기타 악기" && entry.instrumentName
                          ? entry.instrumentName
                          : entry.desiredSession}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {entry.additionalParticipants.length > 0
                        ? entry.additionalParticipants
                            .map((p) =>
                              p.session === "기타 악기" && p.instrumentName
                                ? `${p.name}(${p.instrumentName})`
                                : `${p.name}(${p.session})`
                            )
                            .join(", ")
                        : null}
                    </td>
                    <td className="px-4 py-3">
                      {entry.noteUrl ? (
                        /^https?:\/\//.test(entry.noteUrl) ? (
                          <a
                            href={entry.noteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-amber-400 underline hover:text-amber-300 whitespace-nowrap"
                          >
                            링크
                          </a>
                        ) : (
                          <span className="text-gray-400">{entry.noteUrl}</span>
                        )
                      ) : null}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={(e) => openParticipantForm(e, entry.id)}
                        className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                          activeParticipantId === entry.id
                            ? "bg-zinc-600 text-gray-300"
                            : "bg-amber-400/10 text-amber-400 border border-amber-400/20 hover:bg-amber-400/20"
                        }`}
                      >
                        {activeParticipantId === entry.id ? "닫기" : "참가"}
                      </button>
                    </td>
                  </tr>

                  {/* 수정/삭제 패널 행 */}
                  {activePanelId === entry.id && (
                    <tr key={`${entry.id}-panel`} className="bg-zinc-800 border-t border-zinc-600">
                      <td colSpan={6} className="px-4 py-4">
                        <form onSubmit={handleEditSubmit} noValidate className="flex flex-col gap-3">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex flex-col gap-1 flex-1">
                              <label className="text-xs font-medium text-gray-400">
                                곡명 <span className="text-amber-400">*</span>
                              </label>
                              <input
                                type="text"
                                name="songTitle"
                                value={editForm.songTitle}
                                onChange={handleEditChange}
                                className="rounded-md border border-zinc-600 bg-zinc-700 px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                              />
                              {editErrors.songTitle && (
                                <p className="text-xs text-red-400">{editErrors.songTitle}</p>
                              )}
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                              <label className="text-xs font-medium text-gray-400">
                                신청자 <span className="text-amber-400">*</span>
                              </label>
                              <input
                                type="text"
                                name="applicantName"
                                value={editForm.applicantName}
                                onChange={handleEditChange}
                                className="rounded-md border border-zinc-600 bg-zinc-700 px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                              />
                              {editErrors.applicantName && (
                                <p className="text-xs text-red-400">{editErrors.applicantName}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-medium text-gray-400">
                                희망 세션 <span className="text-amber-400">*</span>
                              </label>
                              <select
                                name="desiredSession"
                                value={editForm.desiredSession}
                                onChange={handleEditChange}
                                className="rounded-md border border-zinc-600 bg-zinc-700 px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                              >
                                <option value="">세션 선택</option>
                                {SESSION_OPTIONS.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              {editErrors.desiredSession && (
                                <p className="text-xs text-red-400">{editErrors.desiredSession}</p>
                              )}
                            </div>
                            {isEditOther && (
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium text-gray-400">
                                  악기명 <span className="text-amber-400">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="instrumentName"
                                  value={editForm.instrumentName}
                                  onChange={handleEditChange}
                                  placeholder="예: 트럼펫"
                                  className="rounded-md border border-zinc-600 bg-zinc-700 px-3 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 w-32"
                                />
                                {editErrors.instrumentName && (
                                  <p className="text-xs text-red-400">{editErrors.instrumentName}</p>
                                )}
                              </div>
                            )}
                            <div className="flex flex-col gap-1 flex-1">
                              <label className="text-xs font-medium text-gray-400">비고</label>
                              <input
                                type="text"
                                name="noteUrl"
                                value={editForm.noteUrl}
                                onChange={handleEditChange}
                                placeholder="https://youtube.com/... 또는 메모"
                                className="rounded-md border border-zinc-600 bg-zinc-700 px-3 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                              />
                            </div>
                          </div>

                          {/* 저장/삭제 버튼 영역 */}
                          {!showDeleteConfirm ? (
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="submit"
                                disabled={isEditPending}
                                className="rounded-md bg-amber-400 px-4 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isEditPending ? "저장 중…" : "저장"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setActivePanelId(null)}
                                className="rounded-md bg-zinc-700 px-4 py-1.5 text-xs font-semibold text-gray-300 hover:bg-zinc-600 transition-colors"
                              >
                                취소
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="ml-auto rounded-md bg-red-500/10 px-4 py-1.5 text-xs font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                              >
                                삭제
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 pt-1">
                              <p className="text-sm text-gray-300">
                                <span className="font-semibold text-gray-100">{entry.songTitle}</span> 신청을 삭제할까요? 이 작업은 되돌릴 수 없습니다.
                              </p>
                              <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeletePending}
                                className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                              >
                                {isDeletePending ? "삭제 중…" : "삭제 확인"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="rounded-md bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-zinc-600 transition-colors whitespace-nowrap"
                              >
                                취소
                              </button>
                            </div>
                          )}
                        </form>
                      </td>
                    </tr>
                  )}

                  {/* 추가 참여 폼 행 */}
                  {activeParticipantId === entry.id && (
                    <tr key={`${entry.id}-participant`} className="bg-zinc-800 border-t border-zinc-600">
                      <td colSpan={6} className="px-4 py-4">
                        <form
                          onSubmit={handleParticipantSubmit}
                          noValidate
                          className="flex flex-col sm:flex-row sm:items-end gap-3"
                        >
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-400">
                              이름 <span className="text-amber-400">*</span>
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={participantForm.name}
                              onChange={handleParticipantChange}
                              placeholder="예: 홍길동"
                              className="rounded-md border border-zinc-600 bg-zinc-700 px-3 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 w-36"
                            />
                            {participantErrors.name && (
                              <p className="text-xs text-red-400">{participantErrors.name}</p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-400">
                              세션 <span className="text-amber-400">*</span>
                            </label>
                            <select
                              name="session"
                              value={participantForm.session}
                              onChange={handleParticipantChange}
                              className="rounded-md border border-zinc-600 bg-zinc-700 px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            >
                              <option value="">세션 선택</option>
                              {SESSION_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            {participantErrors.session && (
                              <p className="text-xs text-red-400">{participantErrors.session}</p>
                            )}
                          </div>
                          {isParticipantOther && (
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-medium text-gray-400">
                                악기명 <span className="text-amber-400">*</span>
                              </label>
                              <input
                                type="text"
                                name="instrumentName"
                                value={participantForm.instrumentName}
                                onChange={handleParticipantChange}
                                placeholder="예: 트럼펫"
                                className="rounded-md border border-zinc-600 bg-zinc-700 px-3 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 w-28"
                              />
                              {participantErrors.instrumentName && (
                                <p className="text-xs text-red-400">{participantErrors.instrumentName}</p>
                              )}
                            </div>
                          )}
                          <button
                            type="submit"
                            disabled={isParticipantPending}
                            className="rounded-md bg-amber-400 px-4 py-1.5 text-xs font-semibold text-zinc-900 hover:bg-amber-300 transition-colors self-end disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isParticipantPending ? "저장 중…" : "추가"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
