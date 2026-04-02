import { EasySong, Genre } from "@/types";

type Props = {
  songs: EasySong[];
};

const GENRE_STYLE: Record<Genre, { label: string; className: string }> = {
  swing: { label: "Swing",  className: "bg-blue-900 text-blue-200 border border-blue-700" },
  bossa: { label: "Bossa",  className: "bg-green-900 text-green-200 border border-green-700" },
  funk:  { label: "Funk",   className: "bg-orange-900 text-orange-200 border border-orange-700" },
};

export default function EasySongList({ songs }: Props) {
  return (
    <section className="px-4 py-8 bg-zinc-950 border-t border-zinc-700">
      <h2 className="text-lg font-semibold text-gray-100 mb-1">Easy 곡 리스트</h2>
      <p className="text-sm text-gray-400 mb-5">
        곡을 아직 못 정했다면 아래 추천 리스트를 참고해보세요.
      </p>

      <ul className="flex flex-col gap-3">
        {songs.map((song) => {
          const genre = GENRE_STYLE[song.genre];
          return (
            <li
              key={song.id}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-gray-100 text-sm">
                  {song.title}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {song.youtubeUrl && (
                    <a
                      href={song.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-400 underline hover:text-amber-300"
                    >
                      유튜브 보기
                    </a>
                  )}
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${genre.className}`}
                  >
                    {genre.label}
                  </span>
                </div>
              </div>
              {song.memo && (
                <p className="mt-1 text-xs text-gray-500">{song.memo}</p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
