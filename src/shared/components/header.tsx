import { getCurrentWindow } from "@tauri-apps/api/window";

const appWindow = getCurrentWindow();

const Logotype = () => {
  return (
    <a
      aria-label="Перейти на главную"
      href="/"
      class="flex h-full w-fit items-center gap-2"
    >
      <img src="/favicon.ico" width={40} height={40} alt="" class="min-w-10 w-10 max-h-10 min-h-10" />
      <p class="font-[PIXY] text-white self-end text-3xl">
        Fasberry
      </p>
    </a>
  )
}

export const AppHeader = () => {
  return (
    <header
      data-tauri-drag-region
      class="sticky top-4 h-12 min-h-12 max-h-12 z-10 flex items-center justify-between w-full px-4"
    >
      <Logotype />
      <div class='flex items-center justify-between gap-2'>
        <div class='flex bg-white/10 rounded-3xl hover:bg-white/20 text-[14px] px-3 py-1 cursor-pointer font-semibold text-white'>
          <p>Настройки</p>
        </div>
        <div
          class="flex bg-white/10 rounded-3xl overflow-hidden *:hover:bg-white/20 text-[14px] font-semibold *:cursor-pointer
          text-white items-center justify-between *:px-2 *:first:pl-3 *:py-1 *:last:pr-3 *:last:hover:bg-red-500"
        >
          <button onClick={() => appWindow.minimize()}>—</button>
          <button onClick={() => appWindow.toggleMaximize()}>▢</button>
          <button onClick={() => appWindow.close()}>✕</button>
        </div>
      </div>
    </header>
  )
}