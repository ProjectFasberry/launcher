import 'virtual:uno.css'
import '@unocss/reset/tailwind-v4.css'
import "./index.css"

import ReactDOM from "react-dom/client";
import { App } from "./app";

import { createCtx } from "@reatom/core"
import { reatomContext } from '@reatom/npm-react'

async function start() {
  const ctx = createCtx()

  if (import.meta.env.DEV) {
    const { connectLogger } = await import("@reatom/logger")
    connectLogger(ctx)
  }

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <reatomContext.Provider value={ctx}>
      <App />
    </reatomContext.Provider>
  );
}

start();