import { atom } from "@reatom/core";

export type Page = "main" | "news";
export const pageAtom = atom<Page>("main")
export const isActiveAtom = (v: Page) => atom((ctx) => v === ctx.spy(pageAtom))