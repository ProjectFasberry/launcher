import 'virtual:uno.css'
import '@unocss/reset/tailwind-v4.css'
import "./index.css"

import ReactDOM from "react-dom/client";
import { App } from "./app";
import { createCtx } from "@reatom/core"
import { reatomContext } from '@reatom/npm-react'

const ctx = createCtx()

if (import.meta.env.DEV) {
  await import("@reatom/logger").then(({ connectLogger }) => connectLogger(ctx))
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <reatomContext.Provider value={ctx}>
    <App />
  </reatomContext.Provider>
);