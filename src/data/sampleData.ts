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
  // Swing
  { id: "1",  title: "Alice in Wonderland", artist: "Jazz Standard", genre: "swing" },
  { id: "2",  title: "All of Me",           artist: "Jazz Standard", genre: "swing" },
  { id: "3",  title: "Autumn Leaves",       artist: "Jazz Standard", genre: "swing" },
  { id: "4",  title: "Beautiful Love",      artist: "Jazz Standard", genre: "swing" },
  { id: "5",  title: "Blues",               artist: "Jazz Standard", genre: "swing" },
  { id: "6",  title: "Fly Me to the Moon",  artist: "Jazz Standard", genre: "swing" },
  { id: "7",  title: "A Foggy Day",         artist: "Jazz Standard", genre: "swing" },
  { id: "8",  title: "I Should Care",       artist: "Jazz Standard", genre: "swing" },
  { id: "9",  title: "Just Friends",        artist: "Jazz Standard", genre: "swing" },
  { id: "10", title: "Night and Day",       artist: "Jazz Standard", genre: "swing" },
  { id: "11", title: "Satin Doll",          artist: "Jazz Standard", genre: "swing" },
  // Bossa Nova
  { id: "12", title: "Blue Bossa",          artist: "Jazz Standard", genre: "bossa" },
  { id: "13", title: "So Nice (Summer Samba)", artist: "Marcos Valle", genre: "bossa" },
  // Funk
  { id: "14", title: "Sunny",              artist: "Bobby Hebb",    genre: "funk" },
  { id: "15", title: "Just the Two of Us", artist: "Grover Washington Jr.", genre: "funk" },
];
