"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";
import { SESSION_OPTIONS } from "@/types";

// 세션 값이 고정 목록에 속하는지 확인하는 헬퍼
function isValidSession(value: string): boolean {
  return (SESSION_OPTIONS as readonly string[]).includes(value);
}

// ─────────────────────────────────────────────────────────────
// 신청곡 생성
// ─────────────────────────────────────────────────────────────
export async function createJamEntry(data: {
  songTitle: string;
  applicantName: string;
  desiredSession: string;
  instrumentName?: string;
  noteUrl?: string;
}) {
  if (!data.songTitle.trim()) throw new Error("곡명은 필수입니다.");
  if (!data.applicantName.trim()) throw new Error("신청자 이름은 필수입니다.");
  if (!isValidSession(data.desiredSession)) throw new Error("유효하지 않은 세션입니다.");
  if (data.desiredSession === "기타 악기" && !data.instrumentName?.trim())
    throw new Error("악기명은 필수입니다.");

  await prisma.jamEntry.create({
    data: {
      songTitle: data.songTitle.trim(),
      applicantName: data.applicantName.trim(),
      desiredSession: data.desiredSession,
      instrumentName:
        data.desiredSession === "기타 악기" ? (data.instrumentName?.trim() ?? null) : null,
      noteUrl: data.noteUrl?.trim() || null,
    },
  });

  revalidatePath("/");
}

// ─────────────────────────────────────────────────────────────
// 신청곡 목록 조회
// 서버 컴포넌트(page.tsx)에서 직접 prisma를 호출하지만,
// 재사용을 위해 함수로도 정의해 둔다.
// ─────────────────────────────────────────────────────────────
export async function getJamEntries() {
  return prisma.jamEntry.findMany({
    include: { additionalParticipants: true },
    orderBy: { createdAt: "asc" },
  });
}

// ─────────────────────────────────────────────────────────────
// 추가 참여 멤버 추가
// ─────────────────────────────────────────────────────────────
export async function addParticipant(
  jamEntryId: string,
  data: {
    name: string;
    session: string;
    instrumentName?: string;
  }
) {
  if (!data.name.trim()) throw new Error("이름은 필수입니다.");
  if (!isValidSession(data.session)) throw new Error("유효하지 않은 세션입니다.");
  if (data.session === "기타 악기" && !data.instrumentName?.trim())
    throw new Error("악기명은 필수입니다.");

  await prisma.additionalParticipant.create({
    data: {
      jamEntryId,
      name: data.name.trim(),
      session: data.session,
      instrumentName:
        data.session === "기타 악기" ? (data.instrumentName?.trim() ?? null) : null,
    },
  });

  revalidatePath("/");
}

// ─────────────────────────────────────────────────────────────
// 원클릭 신청 저장
// ─────────────────────────────────────────────────────────────
export async function createOneClickRequest(data: {
  requesterName: string;
  preferredSession: string;
  instrumentName?: string;
  memo?: string;
}) {
  if (!data.requesterName.trim()) throw new Error("이름은 필수입니다.");
  if (!isValidSession(data.preferredSession)) throw new Error("유효하지 않은 세션입니다.");
  if (data.preferredSession === "기타 악기" && !data.instrumentName?.trim())
    throw new Error("악기명은 필수입니다.");

  await prisma.oneClickRequest.create({
    data: {
      requesterName: data.requesterName.trim(),
      preferredSession: data.preferredSession,
      instrumentName:
        data.preferredSession === "기타 악기"
          ? (data.instrumentName?.trim() ?? null)
          : null,
      memo: data.memo?.trim() || null,
    },
  });

  revalidatePath("/");
}

// ─────────────────────────────────────────────────────────────
// 신청곡 수정
// ─────────────────────────────────────────────────────────────
export async function updateJamEntry(
  id: string,
  data: {
    songTitle: string;
    applicantName: string;
    desiredSession: string;
    instrumentName?: string;
    noteUrl?: string;
  }
) {
  if (!data.songTitle.trim()) throw new Error("곡명은 필수입니다.");
  if (!data.applicantName.trim()) throw new Error("신청자 이름은 필수입니다.");
  if (!isValidSession(data.desiredSession)) throw new Error("유효하지 않은 세션입니다.");
  if (data.desiredSession === "기타 악기" && !data.instrumentName?.trim())
    throw new Error("악기명은 필수입니다.");

  await prisma.jamEntry.update({
    where: { id },
    data: {
      songTitle: data.songTitle.trim(),
      applicantName: data.applicantName.trim(),
      desiredSession: data.desiredSession,
      instrumentName:
        data.desiredSession === "기타 악기" ? (data.instrumentName?.trim() ?? null) : null,
      noteUrl: data.noteUrl?.trim() || null,
    },
  });

  revalidatePath("/");
}

// ─────────────────────────────────────────────────────────────
// 신청곡 삭제 (연결된 additionalParticipants는 Cascade로 함께 삭제됨)
// ─────────────────────────────────────────────────────────────
export async function deleteJamEntry(id: string) {
  await prisma.jamEntry.delete({ where: { id } });
  revalidatePath("/");
}
