import { EasySong } from "@/types";

type Props = {
  songs: EasySong[];
};

export default function EasySongList({ songs }: Props) {
  return (
    <section className="px-4 py-8 bg-zinc-950 border-t border-zinc-700">
      <h2 className="text-lg font-semibold text-gray-100 mb-1">Easy 곡 리스트</h2>
      <p className="text-sm text-gray-400 mb-5">
        곡을 아직 못 정했다면 아래 추천 리스트를 참고해보세요.
      </p>

      <ul className="flex flex-col gap-3">
        {songs.map((song) => (
          <li
            key={song.id}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <span className="font-medium text-gray-100 text-sm">
                  {song.title}
                </span>
                <span className="text-gray-500 text-sm"> — {song.artist}</span>
              </div>
              {song.youtubeUrl && (
                <a
                  href={song.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 underline hover:text-amber-300 shrink-0"
                >
                  유튜브 보기
                </a>
              )}
            </div>
            {song.memo && (
              <p className="mt-1 text-xs text-gray-500">{song.memo}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
