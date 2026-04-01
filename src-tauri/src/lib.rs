mod commands;

pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .plugin(prevent_default())
    .invoke_handler(tauri::generate_handler![commands::play_action])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

fn prevent_default() -> tauri::plugin::TauriPlugin<tauri::Wry> {
  use tauri_plugin_prevent_default::Flags;

  let mut builder = tauri_plugin_prevent_default::Builder::new();

  if cfg!(debug_assertions) {
    builder = builder.with_flags(Flags::DEV_TOOLS | Flags::RELOAD);
  } else {
    builder = builder.with_flags(Flags::all());
  }

  builder.build()
}
