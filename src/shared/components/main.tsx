import { listen } from "@tauri-apps/api/event";
import { tv } from "tailwind-variants";
import { Icon } from "../ui/icon";
import { dwnldState, serverStatus, startPlay } from "./main.model";
import { useAtom, useCtx } from "@reatom/npm-solid-js";
import { Component, onCleanup, onMount } from "solid-js";

const ServerStatus = () => {
  const ctx = useCtx();

  onMount(() => {
    serverStatus(ctx)
  })

  const [data] = useAtom(serverStatus.dataAtom)

  return (
    <div class="">
      <p class="text-xl font-semibold">
        Сейчас играет {data()?.proxy.online ?? 0} игроков
      </p>
    </div>
  )
}

const playButtonVariants = tv({
  base: `w-fit bg-green-600 rounded-xl duration-200 gap-2 
    disabled:pointer-events-none disabled:opacity-60 disabled:cursor-not-allowed
    ease-linear flex items-center justify-center px-16 py-2`
})

const PlayButton = () => {
  const ctx = useCtx()
  const [isDownloading] = useAtom(dwnldState.isActive)

  return (
    <button
      class={playButtonVariants()}
      onClick={() => startPlay(ctx)}
      disabled={isDownloading()}
    >
      {isDownloading() && <Icon name="sprite:loader-2" class="w-5 h-5 animate-spin duration-200" />}
      <p class="text-xl font-semibold uppercase">
        {isDownloading() ? 'Загрузка...' : 'Играть'}
      </p>
    </button>
  )
}

const PercentLine: Component<{ percent: number }> = (props) => {
  return (
    <div class="w-full bg-black/40 h-2 rounded-full overflow-hidden">
      <div
        class="bg-green-500 h-full transition-all duration-200 ease-out"
        style={{ width: `${props.percent}%` }}
      />
    </div>
  )
}

const DownloadResult = () => {
  const [isDownloading] = useAtom(dwnldState.isActive)
  const [percent] = useAtom(dwnldState.percent)
  const [msg] = useAtom(dwnldState.msg)
  const ctx = useCtx();

  onMount(() => {
    let unlisten: (() => void) | undefined;

    async function setupListener() {
      unlisten = await listen('download-progress', (event) => {
        const { message, percentage } = event.payload as { message: string, percentage: number };

        dwnldState.msg(ctx, message);
        dwnldState.percent(ctx, percentage);
      });
    }

    setupListener();

    onCleanup(() => {
      if (unlisten) unlisten();
    });
  });

  if (!isDownloading()) return null;

  return (
    <div class="w-full flex flex-col gap-2 transition-all duration-300">
      <p class="text-sm text-gray-300 animate-pulse">{msg()}</p>
      <PercentLine percent={percent()} />
    </div>
  )
}

export const Main = () => {
  return (
    <div class="flex flex-col gap-8 w-[80%] h-full justify-end pb-12">
      <DownloadResult />
      <ServerStatus />
      <PlayButton />
    </div>
  )
}