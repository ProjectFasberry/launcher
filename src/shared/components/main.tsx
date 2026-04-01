import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { listen } from "@tauri-apps/api/event";
import { tv } from "tailwind-variants";
import { Icon } from "../ui/icon";
import { dwnldState, serverStatus, startPlay } from "./main.model";

const ServerStatus = reatomComponent(({ ctx }) => {
  useUpdate(() => serverStatus(ctx), []);

  const data = ctx.spy(serverStatus.dataAtom);

  return (
    <div className="">
      <p className="text-xl font-semibold">
        Сейчас играет {data?.proxy.online ?? 0} игроков
      </p>
    </div>
  )
}, "ServerStatus")

const playButtonVariants = tv({
  base: `w-fit bg-green-600 rounded-xl duration-200 gap-2 disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed
   ease-linear flex items-center justify-center px-16 py-2`
})

const PlayButton = reatomComponent(({ ctx }) => {
  const isDownloading = ctx.spy(dwnldState.isActive);

  return (
    <button
      disabled={isDownloading}
      className={playButtonVariants()}
      onClick={() => startPlay(ctx)}
    >
      {isDownloading && <Icon name="sprite:loader-2" className="w-5 h-5 animate-spin duration-200" />}
      <p className="text-xl font-semibold uppercase">
        {isDownloading ? 'Загрузка...' : 'Играть'}
      </p>
    </button>
  )
}, "PlayButton")

const PercentLine = ({ percent }: { percent: number }) => {
  return (
    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
      <div
        className="bg-green-500 h-full transition-all duration-200 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

const DownloadResult = reatomComponent(({ ctx }) => {
  const isDownloading = ctx.spy(dwnldState.isActive);
  const percent = ctx.spy(dwnldState.percent);
  const msg = ctx.spy(dwnldState.msg);

  useUpdate(() => {
    let unlisten: any;

    async function setupListener() {
      unlisten = await listen('download-progress', (event) => {
        const { message, percentage } = event.payload as { message: string, percentage: number };

        dwnldState.msg(ctx, message);
        dwnldState.percent(ctx, percentage);
      });
    }

    setupListener();

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  if (!isDownloading) return null;

  return (
    <div className="w-full flex flex-col gap-2 transition-all duration-300">
      <p className="text-sm text-gray-300 animate-pulse">{msg}</p>
      <PercentLine percent={percent} />
    </div>
  )
}, "DownloadResult")

export const Main = () => {
  return (
    <div className="flex flex-col gap-8 w-[80%] h-full justify-end pb-12">
      <DownloadResult />
      <ServerStatus />
      <PlayButton />
    </div>
  )
}