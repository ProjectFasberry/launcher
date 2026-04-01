// import { invoke } from "@tauri-apps/api/core";

import { reatomComponent } from "@reatom/npm-react"
import { Ctx } from '@reatom/core';
import { tv } from 'tailwind-variants/lite';
import { ReactNode } from 'react';
import { News } from './shared/components/news';
import { AppHeader } from "./shared/components/header";
import { BACKGROUND_IMG } from "./shared/const";
import { Main } from "./shared/components/main";
import { isActiveAtom, type Page, pageAtom } from "./app.model";
import { serverStatus } from "./shared/components/main.model";
import { news } from "./shared/components/news.model";

const buttonVariant = tv({
  base: `flex items-center cursor-pointer justify-center`,
  variants: {
    variant: { default: "text-white/40", active: "text-white" }
  },
  defaultVariants: { variant: "default" }
})

const InternalHeaderItem = reatomComponent<{ t: string, v: Page }>(({ ctx, t, v }) => {
  const variant = ctx.spy(isActiveAtom(v)) ? "active" : "default";

  return (
    <button
      className={buttonVariant({ variant })}
      onClick={() => pageAtom(ctx, v)}
    >
      <p className="uppercase text-2xl font-semibold">{t}</p>
    </button>
  )
}, "InternalHeaderItem")

const ITEMS = [{ t: "Главная", v: "main" }, { t: "Новости", v: "news" }] as const

const InternalHeader = () => {
  return (
    <div className='flex items-center justify-center gap-6 w-full'>
      {ITEMS.map((m) => <InternalHeaderItem key={m.v} {...m} />)}
    </div>
  )
}

const COMPONENTS: Partial<Record<Page, { node: ReactNode, event?: (ctx: Ctx) => void }>> = {
  "main": {
    node: <Main />,
    event: (ctx) => serverStatus(ctx)
  },
  "news": {
    node: <News />,
    event: (ctx) => news.fetch(ctx)
  }
}

pageAtom.onChange((ctx, data) => COMPONENTS[data]?.event?.(ctx))

const InternalContent = reatomComponent(({ ctx }) => 
  COMPONENTS[ctx.spy(pageAtom)]?.node, 
  "InternalContent"
)

const AppBackground = () => {
  return (
    <>
      <div
        style={{ backgroundImage: `url(${BACKGROUND_IMG})` }}
        className="absolute z-[-1] w-full h-full bg-cover bg-center"
      />
      <div className='absolute z-1 bg-linear-to-bl from-black/20 via-black/70 to-black/80 h-full w-full' />
    </>
  )
}

export const App = () => {
  return (
    <div className="relative overflow-hidden flex flex-col w-vw h-dvh">
      <AppBackground />
      <AppHeader />
      <main className="flex flex-col gap-12 items-center w-full min-h-0 relative px-4 z-2 h-full mt-4 overflow-hidden">
        <InternalHeader />
        <InternalContent />
      </main>
    </div>
  );
}