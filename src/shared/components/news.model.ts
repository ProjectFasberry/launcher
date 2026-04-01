import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { atom } from "@reatom/core"
import { withAssign } from "@reatom/primitives"
import { client } from "../lib/client"

export const newsState = atom(null, "newsState").pipe(
  withAssign((_, name) => ({
    inView: atom(false, `${name}.inView`)
  }))
)
export const news = atom(null, "news").pipe(
  withAssign((_, name) => ({
    fetch: reatomAsync(async (ctx) => {
      const res = await ctx.schedule(() =>
        client("shared/news/list").json<WrapRes<{ data: any[], meta: any }>>()
      )

      if ("error" in res) throw new Error(res.error)

      return res.data
    }, `${name}.fetch`).pipe(
      withDataAtom(),
      withCache({ swr: false }),
      withStatusesAtom()
    )
  }))
)
