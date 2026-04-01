use serde::Serialize;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use tauri::{AppHandle, Emitter};

#[derive(Clone, Serialize)]
struct ProgressPayload {
  message: String,
  percentage: f64,
}

const FOLDER_NAME: &str = ".fasberry";
const RESOURCEPACK_NAME: &str = "pack";

fn get_game_dir() -> PathBuf {
  if let Some(home) = directories::BaseDirs::new() {
    let mut path = home.config_dir().to_path_buf();
    path.push(FOLDER_NAME);
    path
  } else {
    PathBuf::from(FOLDER_NAME)
  }
}

async fn download_resource_pack(app: &AppHandle, url: &str, game_dir: &Path) -> Result<(), String> {
  let rp_path = game_dir
    .join("resourcepacks")
    .join(format!("{}.zip", RESOURCEPACK_NAME));

  app
    .emit(
      "download-progress",
      ProgressPayload {
        message: "Connecting with server...".into(),
        percentage: 20.0,
      },
    )
    .ok();

  fs::create_dir_all(rp_path.parent().unwrap()).map_err(|e| e.to_string())?;

  if rp_path.exists() {
    return Ok(());
  }

  let response = reqwest::get(url).await.map_err(|e| e.to_string())?;
  let total_size = response.content_length().unwrap_or(1);

  if !response.status().is_success() {
    return Err(format!("Server error: {}", response.status()));
  }

  let mut bytes = Vec::new();
  let mut stream = response.bytes_stream();

  use futures_util::StreamExt;

  while let Some(item) = stream.next().await {
    let chunk = item.map_err(|e| e.to_string())?;
    bytes.extend_from_slice(&chunk);

    let progress = (bytes.len() as f64 / total_size as f64) * 100.0;

    app
      .emit(
        "download-progress",
        ProgressPayload {
          message: format!("Donwloading: {:.2}%", progress),
          percentage: progress,
        },
      )
      .ok();
  }

  fs::write(&rp_path, bytes).map_err(|e| format!("File saving error: {}", e))?;

  Ok(())
}

fn setup_resource_pack(game_dir: &Path) {
  let options_path = game_dir.join("options.txt");

  let mut options = fs::read_to_string(&options_path).unwrap_or_else(|_| "resourcePacks:[]".into());

  if !options.contains("FasberryPack.zip") {
    options = options.replace(
      "resourcePacks:[",
      "resourcePacks:[\"file/FasberryPack.zip\",",
    );
    if let Err(e) = fs::write(&options_path, options) {
      println!("{}", e);
    }
  }
}

const RP_URL: &str = "https://volume.fasberry.fun/static/resourcepack/v1/generated.zip";

#[tauri::command]
pub async fn play_action(app: AppHandle, nickname: String) -> Result<(), String> {
  let game_dir = get_game_dir();

  app
    .emit(
      "download-progress",
      ProgressPayload {
        message: "Processing folders...".into(),
        percentage: 5.0,
      },
    )
    .ok();

  fs::create_dir_all(&game_dir).map_err(|e| e.to_string())?;

  download_resource_pack(&app, RP_URL, &game_dir).await?;

  app
    .emit(
      "download-progress",
      ProgressPayload {
        message: "Launch game...".into(),
        percentage: 100.0,
      },
    )
    .ok();

  setup_resource_pack(&game_dir);

  let status = Command::new("java")
    .current_dir(&game_dir)
    .arg("-Xmx2G")
    .arg("-Djava.library.path=natives")
    .arg("-cp")
    .arg("bin/client.jar;libs/*")
    .arg("net.minecraft.client.main.Main")
    .args(["--username", &nickname])
    .args(["--version", "1.20.1"])
    .args(["--gameDir", game_dir.to_str().unwrap()])
    .args(["--assetsDir", "assets"])
    .args(["--assetIndex", "1.20"])
    .spawn();

  match status {
    Ok(_) => Ok(()),
    Err(e) => {
      let err_msg: String = format!("{}", e);
      println!("{}", err_msg);
      Err(err_msg)
    }
  }
}
