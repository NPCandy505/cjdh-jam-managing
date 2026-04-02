import { JamEntry, EasySong } from "@/types";

export const sampleJamEntries: JamEntry[] = [
  {
    id: "1",
    songTitle: "Autumn Leaves",
    applicantName: "김재즈",
    desiredSession: "기타",
    additionalParticipants: [
      { name: "이피아노", session: "키보드" },
      { name: "박드럼", session: "드럼" },
    ],
    noteUrl: "https://www.youtube.com/watch?v=r-Z8KuwI7Gc",
    createdAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "2",
    songTitle: "So What",
    applicantName: "최베이스",
    desiredSession: "베이스",
    additionalParticipants: [],
    createdAt: "2026-04-01T11:00:00Z",
  },
  {
    id: "3",
    songTitle: "Take Five",
    applicantName: "정보컬",
    desiredSession: "보컬",
    additionalParticipants: [{ name: "강색소폰", session: "색소폰" }],
    createdAt: "2026-04-01T12:00:00Z",
  },
];

export const sampleEasySongs: EasySong[] = [
  {
    id: "1",
    title: "All of me",
    artist: "Jazz Standard",
  },
  {
    id: "2",
    title: "Bye bye blackbird",
    artist: "Jazz Standard",
  },
  {
    id: "3",
    title: "Days of wine and roses",
    artist: "Jazz Standard",
  },
  {
    id: "4",
    title: "Foggy day",
    artist: "Jazz Standard",
  },
  {
    id: "5",
    title: "It could happen to you",
    artist: "Jazz Standard",
  },
  {
    id: "6",
    title: "Just friends",
    artist: "Jazz Standard",
  },
  {
    id: "7",
    title: "On the sunny side of street",
    artist: "Jazz Standard",
  },
  {
    id: "8",
    title: "St. Thomas",
    artist: "Sonny Rollins",
  },
];
