import { reatomAsync, withCache, withDataAtom, withErrorAtom, withStatusesAtom } from "@reatom/async"
import { client } from "../lib/client"
import { atom } from "@reatom/core"
import { invoke } from "@tauri-apps/api/core"
import { withAssign } from "@reatom/primitives"

type StatusPayload = {
  status: string,
  online: number,
  max: number,
  players: string[]
}
type Status = {
  proxy: StatusPayload,
  servers: {
    [key: string]: StatusPayload
  }
}

export const serverStatus = reatomAsync(async (ctx) => {
  const res = await ctx.schedule(() =>
    client("server/status").json<WrapRes<Status>>()
  )

  if ("error" in res) throw new Error(res.error)

  return res.data
}, "serverStatus").pipe(
  withDataAtom(), 
  withStatusesAtom(), 
  withCache({ swr: false })
)

export const dwnldState = atom(null, "dwnldState").pipe(
  withAssign((_, name) => ({
    msg: atom('Готов к запуску', `${name}.msg`),
    isActive: atom((ctx) => ctx.spy(startPlay.statusesAtom).isPending, `${name}.isActive`),
    percent: atom(0, `${name}.percent`)
  }))
)

export const startPlay = reatomAsync(async () => {
  await invoke('play_action', { nickname: 'Belkin' });
}, "startPlay").pipe(
  withStatusesAtom(), 
  withErrorAtom()
)