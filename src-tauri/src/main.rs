#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;
use std::time::Duration;

use serde::Serialize;

#[derive(Serialize)]
struct NativeResponse {
    status: u16,
    headers: HashMap<String, String>,
    body: String,
}

#[tauri::command]
async fn native_request(
    url: String,
    method: String,
    headers: HashMap<String, String>,
    body: Option<String>,
) -> Result<NativeResponse, String> {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(25))
        .connect_timeout(Duration::from_secs(20))
        .redirect(reqwest::redirect::Policy::limited(5))
        .http1_only()
        .build()
        .map_err(|error| error.to_string())?;

    let method = reqwest::Method::from_bytes(method.as_bytes()).map_err(|error| error.to_string())?;
    let mut request = client.request(method, &url);
    for (key, value) in headers {
        request = request.header(key, value);
    }
    if let Some(body) = body {
        request = request.body(body);
    }

    let response = request.send().await.map_err(|error| error.to_string())?;
    let status = response.status().as_u16();
    let mut header_map = HashMap::new();
    for (key, value) in response.headers().iter() {
        let name = key.as_str().to_string();
        let text = value.to_str().unwrap_or("").to_string();
        header_map
            .entry(name)
            .and_modify(|existing: &mut String| {
                existing.push_str(", ");
                existing.push_str(&text);
            })
            .or_insert(text);
    }
    let body = response.text().await.map_err(|error| error.to_string())?;
    Ok(NativeResponse {
        status,
        headers: header_map,
        body,
    })
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![native_request])
        .run(tauri::generate_context!())
        .expect("자리톡을 실행하지 못했습니다.");
}
