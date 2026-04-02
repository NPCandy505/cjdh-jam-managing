// 희망 세션 고정 목록
// 드롭다운에서 이 배열을 그대로 사용하면 오타를 방지할 수 있다
export const SESSION_OPTIONS = [
  "보컬",
  "키보드",
  "기타",
  "베이스",
  "드럼",
  "색소폰",
  "기타 악기",
] as const;

// SESSION_OPTIONS 배열의 값만 허용하는 타입
export type Session = (typeof SESSION_OPTIONS)[number];

// 추가 참여 멤버 한 명의 정보 (이름 + 세션)
export type AdditionalParticipant = {
  name: string;
  session: Session;
  instrumentName?: string; // "기타 악기" 선택 시 악기명
};

// 곡 신청 한 건의 데이터
export type JamEntry = {
  id: string;
  songTitle: string;         // 곡명 (필수)
  applicantName: string;     // 신청자 (필수)
  desiredSession: Session;   // 신청자 희망 세션 (필수)
  instrumentName?: string;   // "기타 악기" 선택 시 악기명 (선택)
  additionalParticipants: AdditionalParticipant[]; // 추가 참여 멤버 목록 (없으면 빈 배열)
  noteUrl?: string;          // 비고 - 주로 유튜브 링크 (선택)
  createdAt: string;         // 신청 시각 (ISO 8601 문자열)
};

// easy 곡 리스트 항목 하나
export type EasySong = {
  id: string;
  title: string;             // 곡명
  artist: string;            // 가수명
  youtubeUrl?: string;       // 유튜브 또는 참고 링크 (선택)
  memo?: string;             // 간단 메모 (선택)
};

// 원클릭 신청 한 건의 데이터
export type OneClickRequest = {
  id: string;
  requesterName: string;     // 참여자 이름 (필수)
  preferredSession: Session; // 희망 세션 (필수)
  memo?: string;             // 비고 (선택)
  createdAt: string;         // 신청 시각 (ISO 8601 문자열)
};
