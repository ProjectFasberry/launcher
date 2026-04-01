import 'virtual:uno.css'
import '@unocss/reset/tailwind-v4.css'
import "./index.css"

import { render } from 'solid-js/web';
import 'solid-devtools';
import { App } from "./app";
import { createCtx } from "@reatom/core"
import { reatomContext } from '@reatom/npm-solid-js'

async function start() {
  const ctx = createCtx()

  if (import.meta.env.DEV) {
    const { connectLogger } = await import("@reatom/logger")
    connectLogger(ctx)
  }

  render(() => (
    <reatomContext.Provider value={ctx}>
      <App />
    </reatomContext.Provider>
  ), document.getElementById('root')!)
}
start()