import { Ctx } from '@reatom/core';
import { tv } from 'tailwind-variants';
import { News } from './shared/components/news';
import { AppHeader } from "./shared/components/header";
import { BACKGROUND_IMG } from "./shared/const";
import { Main } from "./shared/components/main";
import { isActiveAtom, type Page, pageAtom } from "./app.model";
import { serverStatus } from "./shared/components/main.model";
import { news } from "./shared/components/news.model";
import { useAtom, useCtx } from '@reatom/npm-solid-js';
import { Component, For, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

const buttonVariant = tv({
  base: `flex items-center cursor-pointer justify-center`,
  variants: {
    variant: { default: "text-white/40", active: "text-white" }
  },
  defaultVariants: { variant: "default" }
})

const InternalHeaderItem: Component<{ t: string, v: Page }> = (props) => {
  const ctx = useCtx();
  const [isActive] = useAtom(isActiveAtom(props.v))

  return (
    <button
      class={buttonVariant({ variant: isActive() ? "active" : "default" })}
      onClick={() => pageAtom(ctx, props.v)}
    >
      <p class="uppercase text-2xl font-semibold">{props.t}</p>
    </button>
  )
}

const ITEMS = [{ t: "Главная", v: "main" }, { t: "Новости", v: "news" }] as const

const InternalHeader = () => {
  return (
    <div class="flex items-center justify-center gap-6 w-full">
      <For each={ITEMS}>
        {(item) => <InternalHeaderItem t={item.t} v={item.v} />}
      </For>
    </div>
  )
}

type PageConfig = {
  component: Component;
  event?: (ctx: Ctx) => void;
};

const COMPONENTS: Record<Page, PageConfig> = {
  "main": {
    component: Main,
    event: (ctx) => serverStatus(ctx)
  },
  "news": {
    component: News,
    event: (ctx) => news.fetch(ctx)
  }
}

pageAtom.onChange((ctx, data) => COMPONENTS[data]?.event?.(ctx))

const InternalContent = () => {
  const [page] = useAtom(pageAtom)
  const config = () => COMPONENTS[page()];

  return (
    <Show when={config()} fallback={<div>Not Found</div>}>
      <Dynamic component={config()?.component} />
    </Show>
  );
}

const AppBackground = () => {
  return (
    <>
      <div
        style={{ "background-image": `url(${BACKGROUND_IMG})` }}
        class="absolute z-[-1] w-full h-full bg-cover bg-center"
      />
      <div class='absolute z-1 bg-linear-to-bl from-black/20 via-black/70 to-black/80 h-full w-full' />
    </>
  )
}

export const App = () => {
  return (
    <div class="relative overflow-hidden flex flex-col w-vw h-dvh">
      <AppBackground />
      <AppHeader />
      <main class="flex flex-col gap-12 items-center w-full min-h-0 relative px-4 z-2 h-full mt-4 overflow-hidden">
        <InternalHeader />
        <InternalContent />
      </main>
    </div>
  );
}