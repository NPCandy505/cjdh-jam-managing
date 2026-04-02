import HeroSection from "@/components/HeroSection";
import JamTable from "@/components/JamTable";
import ApplicationForm from "@/components/ApplicationForm";
import EasySongList from "@/components/EasySongList";
import OneClickSection from "@/components/OneClickSection";
import { sampleEasySongs } from "@/data/sampleData";
import { getJamEntries } from "@/lib/actions";
import { JamEntry, Session } from "@/types";

export default async function Home() {
  // DB에서 신청곡 목록을 가져온다. additionalParticipants도 함께 포함한다.
  const raw = await getJamEntries();

  // Prisma 모델 타입 → 컴포넌트가 기대하는 JamEntry 타입으로 변환한다.
  const entries: JamEntry[] = raw.map((e: (typeof raw)[number]) => ({
    id: e.id,
    songTitle: e.songTitle,
    applicantName: e.applicantName,
    desiredSession: e.desiredSession as Session,
    ...(e.instrumentName ? { instrumentName: e.instrumentName } : {}),
    additionalParticipants: e.additionalParticipants.map(
      (p: (typeof e.additionalParticipants)[number]) => ({
        name: p.name,
        session: p.session as Session,
        ...(p.instrumentName ? { instrumentName: p.instrumentName } : {}),
      })
    ),
    noteUrl: e.noteUrl ?? undefined,
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <main className="max-w-2xl mx-auto w-full bg-zinc-950">
      {/* A. 상단 소개 영역 */}
      <HeroSection />

      {/* B. 신청 현황 표 — DB 데이터 사용 */}
      <JamTable entries={entries} />

      {/* C. 신청 추가 폼 */}
      <ApplicationForm />

      {/* D. easy 곡 리스트 — 정적 데이터 유지 */}
      <EasySongList songs={sampleEasySongs} />

      {/* E. 원클릭 신청 */}
      <OneClickSection />
    </main>
  );
}
