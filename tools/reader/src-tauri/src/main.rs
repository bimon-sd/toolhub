#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use tauri::WebviewWindowBuilder;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiResponse {
    pub success: bool,
    pub message: Option<String>,
    pub path: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Settings {
    api_key: Option<String>,
    region: Option<String>,
    use_edge: Option<bool>,
    use_azure: Option<bool>,
}

impl Default for Settings {
    fn default() -> Self {
        Self {
            api_key: None,
            region: Some("eastus".to_string()),
            use_edge: Some(true),
            use_azure: Some(true),
        }
    }
}

// 检查是否是新安装（通过版本标记文件）
fn is_new_installation(config_dir: &PathBuf) -> bool {
    const CURRENT_VERSION: &str = "1.0.0";
    let version_file = config_dir.join(".version");
    
    if !version_file.exists() {
        return true;
    }
    
    match std::fs::read_to_string(&version_file) {
        Ok(version) => version.trim() != CURRENT_VERSION,
        Err(_) => true,
    }
}

// 标记已安装版本
fn mark_installed(config_dir: &PathBuf) -> Result<(), String> {
    const CURRENT_VERSION: &str = "1.0.0";
    let version_file = config_dir.join(".version");
    std::fs::write(&version_file, CURRENT_VERSION).map_err(|e| e.to_string())
}

fn get_settings(app: &AppHandle) -> Settings {
    let config_dir = app.path().app_config_dir().unwrap_or_else(|_| PathBuf::from("."));
    let settings_path = config_dir.join("settings.json");
    
    log::info!("Loading settings from: {}", settings_path.display());
    
    // 如果是新安装，清空 API Key 但保留其他设置
    if is_new_installation(&config_dir) {
        log::info!("New installation detected, clearing API key for security");
        
        // 尝试读取旧设置
        let mut settings = if settings_path.exists() {
            match std::fs::read_to_string(&settings_path) {
                Ok(settings_str) => {
                    serde_json::from_str::<Settings>(&settings_str).unwrap_or_default()
                }
                Err(_) => Settings::default(),
            }
        } else {
            Settings::default()
        };
        
        // 清空 API Key（安全考虑）
        settings.api_key = None;
        
        // 保存清理后的设置
        let _ = save_settings_to_file(app, &settings);
        let _ = mark_installed(&config_dir);
        
        return settings;
    }
    
    let settings_str = std::fs::read_to_string(&settings_path).unwrap_or_default();
    if settings_str.is_empty() {
        log::warn!("Settings file not found or empty, using defaults");
        return Settings::default();
    }
    
    match serde_json::from_str::<Settings>(&settings_str) {
        Ok(settings) => {
            let api_key_nonempty = settings.api_key.as_ref().map(|k| !k.is_empty()).unwrap_or(false);
    log::info!("Settings loaded: api_key exists={}, use_edge={:?}", 
                api_key_nonempty,
                settings.use_edge);
            settings
        }
        Err(e) => {
            log::error!("Failed to parse settings: {}, using defaults", e);
            Settings::default()
        }
    }
}

fn save_settings_to_file(app: &AppHandle, settings: &Settings) -> Result<(), String> {
    let config_dir = app.path().app_config_dir().map_err(|e| e.to_string())?;
    
    // 确保配置目录存在
    if !config_dir.exists() {
        std::fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    }
    
    let settings_path = config_dir.join("settings.json");
    let settings_json = serde_json::to_string_pretty(settings).map_err(|e| e.to_string())?;
    std::fs::write(&settings_path, settings_json).map_err(|e| e.to_string())
}

fn escape_xml(s: &str) -> String {
    s.replace('&', "&amp;")
     .replace('<', "&lt;")
     .replace('>', "&gt;")
     .replace('"', "&quot;")
     .replace('\'', "&apos;")
}

#[cfg(windows)]
fn run_hidden_command(script: &str) -> Result<String, String> {
    use std::process::Command;
    use std::os::windows::process::CommandExt;
    
    const CREATE_NO_WINDOW: u32 = 0x08000000;

    let output = Command::new("powershell")
        .args(["-NoProfile", "-NonInteractive", "-Command", script])
        .creation_flags(CREATE_NO_WINDOW)
        .output()
        .map_err(|e| format!("Failed to run command: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();
    
    log::debug!("Command stdout: {}", stdout);
    if !stderr.is_empty() {
        log::debug!("Command stderr: {}", stderr);
    }

    if output.status.success() {
        Ok(stdout)
    } else {
        Err(format!("Command failed with exit code: {:?}, stderr: {}", output.status.code(), stderr))
    }
}

#[cfg(not(windows))]
fn run_hidden_command(script: &str) -> Result<String, String> {
    use std::process::Command;
    let output = Command::new("sh")
        .args(["-c", script])
        .output()
        .map_err(|e| format!("Failed to run command: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
async fn generate_speech(
    app: AppHandle,
    text: String,
    filename: String,
    voice: String,
    velocity: f64,
    save_path: String,
) -> Result<ApiResponse, String> {
    log::info!("Generating speech: voice={}, velocity={}, savePath='{}'", voice, velocity, save_path);
    log::info!("Received save_path length: {}, content: {:?}", save_path.len(), save_path);

    if text.trim().is_empty() {
        return Ok(ApiResponse {
            success: false,
            message: Some("Please enter some text".to_string()),
            path: None,
        });
    }

    let save_dir = if !save_path.is_empty() {
        PathBuf::from(&save_path)
    } else {
        dirs::download_dir().unwrap_or_else(|| PathBuf::from("."))
    };
    
    // 确保保存目录存在
    if !save_dir.exists() {
        log::info!("Creating save directory: {}", save_dir.display());
        std::fs::create_dir_all(&save_dir)
            .map_err(|e| format!("Failed to create save directory: {}", e))?;
    }
    
    let settings = get_settings(&app);
    let api_key = settings.api_key.unwrap_or_default();
    let region = settings.region.unwrap_or_else(|| "eastus".to_string());
    let use_edge = settings.use_edge.unwrap_or(true);
    let use_azure = settings.use_azure.unwrap_or(true);

    let output_path = save_dir.join(format!("{}.wav", filename));
    
    // 先尝试 Azure TTS（如果开关开启且有 API Key）
    if use_azure && !api_key.is_empty() {
        match call_azure_tts(&text, &voice, velocity, &output_path, &api_key, &region) {
            Ok(_) => {
                log::info!("Audio saved to: {}", output_path.display());
                return Ok(ApiResponse {
                    success: true,
                    message: Some("Speech generated successfully!".to_string()),
                    path: Some(output_path.to_string_lossy().to_string()),
                });
            }
            Err(e) => {
                log::warn!("Azure TTS failed: {}, trying Edge TTS...", e);
                if !use_edge {
                    return Ok(ApiResponse {
                        success: false,
                        message: Some(e),
                        path: None,
                    });
                }
            }
        }
    } else if !use_azure {
        log::info!("Azure TTS disabled by user, using Edge TTS only");
    } else {
        log::warn!("Azure API key is empty, using Edge TTS");
    }

    // Edge TTS 备用
    match call_edge_tts(&text, &voice, velocity, &output_path) {
        Ok(_) => {
            log::info!("Edge TTS audio saved to: {}", output_path.display());
            Ok(ApiResponse {
                success: true,
                message: Some("Speech generated successfully! (via Edge TTS)".to_string()),
                path: Some(output_path.to_string_lossy().to_string()),
            })
        }
        Err(e) => {
            log::error!("Edge TTS failed: {}", e);
            let error_msg = if !api_key.is_empty() {
                format!("Azure TTS failed, Edge TTS also failed: {}", e)
            } else {
                format!("Edge TTS failed (no Azure API key configured): {}", e)
            };
            Ok(ApiResponse {
                success: false,
                message: Some(error_msg),
                path: None,
            })
        }
    }
}

fn call_azure_tts(text: &str, voice: &str, rate: f64, output_path: &PathBuf, api_key: &str, region: &str) -> Result<(), String> {
    let rate_percent = ((rate - 1.0) * 100.0).round() as i32;
    let rate_str = if rate_percent >= 0 {
        format!("+{}%", rate_percent)
    } else {
        format!("{}%", rate_percent)
    };

    let escaped_text = escape_xml(text);

    let ps_script = format!(r#"
$headers = @{{
    'Ocp-Apim-Subscription-Key' = '{}'
    'Content-Type' = 'application/ssml+xml'
    'X-Microsoft-OutputFormat' = 'riff-24khz-16bit-mono-pcm'
}}

$ssml = @"
<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
    <voice name='{}'>
        <prosody rate='{}'>
            {}
        </prosody>
    </voice>
</speak>
"@

$uri = 'https://{}.tts.speech.microsoft.com/cognitiveservices/v1'
$body = [System.Text.Encoding]::UTF8.GetBytes($ssml)
Invoke-WebRequest -Uri $uri -Method Post -Headers $headers -Body $body -OutFile '{}' -ErrorAction Stop
Write-Output 'SUCCESS'
"#,
        api_key,
        voice,
        rate_str,
        escaped_text.replace("\n", " "),
        region,
        output_path.to_string_lossy()
    );

    run_hidden_command(&ps_script).map(|_| ())
}

// 获取打包的 Python 解释器路径
fn get_python_exe_path() -> Result<PathBuf, String> {
    let exe_path = std::env::current_exe().map_err(|e| format!("Cannot get exe path: {}", e))?;
    let exe_dir = exe_path.parent().ok_or("Cannot get exe directory")?;
    log::info!("Exe path: {}, dir: {}", exe_path.display(), exe_dir.display());

    // 候选路径列表 - 根据实际打包结构调整
    let candidates = vec![
        // NSIS 安装包：exe 同级目录下的 python（实际观察到的位置）
        exe_dir.join("python").join("python.exe"),
        // Tauri resources 目录（某些打包方式）
        exe_dir.join("resources").join("python").join("python.exe"),
        // 开发模式：src-tauri/python
        exe_dir.join("..").join("..").join("python").join("python.exe"),
    ];

    for candidate in &candidates {
        if candidate.exists() {
            log::info!("Found Python at: {}", candidate.display());
            return Ok(candidate.clone());
        }
    }

    // 动态扫描 exe 同级目录下所有子目录，查找 python.exe
    if let Ok(entries) = std::fs::read_dir(exe_dir) {
        for entry in entries.filter_map(|e| e.ok()) {
            let path = entry.path();
            if path.is_dir() {
                let python_exe = path.join("python.exe");
                if python_exe.exists() {
                    log::info!("Found Python via dynamic scan at: {}", python_exe.display());
                    return Ok(python_exe);
                }
            }
        }
    }

    // 打包后必须找到嵌入式 Python，不再回退到系统 Python
    let tried_paths: Vec<String> = candidates.iter().map(|p| p.display().to_string()).collect();
    Err(format!("未找到内置 Python，请重新安装 G-Reader。尝试过的路径: {}", tried_paths.join(", ")))
}

fn call_edge_tts(text: &str, voice: &str, rate: f64, output_path: &PathBuf) -> Result<(), String> {
    use std::process::Command;
    #[cfg(windows)]
    use std::os::windows::process::CommandExt;
    #[cfg(windows)]
    const CREATE_NO_WINDOW: u32 = 0x08000000;

    let rate_percent = ((rate - 1.0) * 100.0).round() as i32;
    let rate_str = if rate_percent >= 0 {
        format!("+{}%", rate_percent)
    } else {
        format!("{}%", rate_percent)
    };

    // 获取打包的 Python 解释器
    let python_exe = get_python_exe_path()
        .map_err(|e| format!("Python not found: {}. Please reinstall G-Reader.", e))?;
    log::info!("Using Python: {}", python_exe.display());

    // 将文本写入临时文件以避免命令行编码问题
    let temp_dir = std::env::temp_dir();
    // 使用时间戳+进程ID+随机数确保唯一性
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis();
    let temp_text_file = temp_dir.join(format!("greader_text_{}_{}.txt", std::process::id(), timestamp));
    std::fs::write(&temp_text_file, text)
        .map_err(|e| format!("Failed to write temp file: {}", e))?;

    // 确保临时文件在函数结束时被清理
    let _temp_file_cleanup = temp_text_file.clone();

    // 获取路径字符串
    let temp_text_path = temp_text_file.to_string_lossy().to_string();
    let output_path_str = output_path.to_string_lossy().to_string();

    // 构建 Python 脚本
    let py_script = format!(
        "import asyncio, edge_tts\nimport sys\nimport traceback\n\ntry:\n    text = open(r'{}', 'r', encoding='utf-8').read()\n    \n    async def main():\n        c = edge_tts.Communicate(text, '{}', rate='{}')\n        await c.save(r'{}')\n    \n    asyncio.run(main())\n    print('EDGE_TTS_SUCCESS')\n    \nexcept Exception as e:\n    print('EDGE_TTS_ERROR:' + str(e))\n    traceback.print_exc()\n    sys.exit(1)",
        temp_text_path, voice, rate_str, output_path_str
    );

    log::info!("Running Edge TTS: voice={}, output={}", voice, output_path_str);

    // 直接调用 Python，不通过 PowerShell
    let mut cmd = Command::new(&python_exe);
    cmd.args(["-c", &py_script]);
    #[cfg(windows)]
    cmd.creation_flags(CREATE_NO_WINDOW);

    let output = cmd.output()
        .map_err(|e| format!("Failed to run Python '{}': {}. Check if antivirus blocked it.", python_exe.display(), e))?;

    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();

    // 清理临时文件
    match std::fs::remove_file(&temp_text_file) {
        Ok(_) => log::debug!("Temp file cleaned: {}", temp_text_file.display()),
        Err(e) => log::warn!("Failed to clean temp file {}: {}", temp_text_file.display(), e),
    }

    if output.status.success() {
        if stdout.trim().contains("EDGE_TTS_SUCCESS") {
            if output_path.exists() {
                match std::fs::metadata(output_path) {
                    Ok(metadata) if metadata.len() > 0 => {
                        log::info!("Edge TTS success: {} ({} bytes)", output_path.display(), metadata.len());
                        return Ok(());
                    }
                    Ok(_) => {
                        let msg = "Output file was created but is empty".to_string();
                        log::error!("{}", msg);
                        return Err(msg);
                    }
                    Err(e) => {
                        let msg = format!("Failed to verify output file: {}", e);
                        log::error!("{}", msg);
                        return Err(msg);
                    }
                }
            } else {
                let msg = "Output file was not created".to_string();
                log::error!("{}", msg);
                return Err(msg);
            }
        } else {
            // Python 脚本执行成功但没有输出成功标志
            let msg = format!("Edge TTS script executed but failed. stdout: {}, stderr: {}", stdout, stderr);
            log::error!("{}", msg);
            return Err(msg);
        }
    } else {
        // Python 脚本执行失败
        let error_detail = if stderr.contains("EDGE_TTS_ERROR:") {
            stderr.split("EDGE_TTS_ERROR:").last().unwrap_or("Unknown error").trim().to_string()
        } else if !stderr.is_empty() {
            stderr.trim().to_string()
        } else if !stdout.is_empty() {
            stdout.trim().to_string()
        } else {
            format!("Python exited with code {:?}", output.status.code())
        };
        
        let msg = format!("Edge TTS failed: {}", error_detail);
        log::error!("{}", msg);
        Err(msg)
    }
}

#[tauri::command]
async fn open_settings_window(app: AppHandle) -> Result<(), String> {
    // 如果设置窗口已存在，则显示并聚焦
    if let Some(win) = app.get_webview_window("settings") {
        win.show().map_err(|e| e.to_string())?;
        win.set_focus().map_err(|e| e.to_string())?;
        return Ok(());
    }
    
    // 创建新的设置窗口
    WebviewWindowBuilder::new(&app, "settings", tauri::WebviewUrl::App("settings.html".into()))
        .title("G-Reader Settings")
        .inner_size(500.0, 420.0)
        .min_inner_size(400.0, 350.0)
        .resizable(true)
        .decorations(false)
        .transparent(true)
        .shadow(false)
        .center()
        .build()
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn save_settings(app: AppHandle, settings: String) -> Result<(), String> {
    let settings: Settings = serde_json::from_str(&settings).map_err(|e| e.to_string())?;
    save_settings_to_file(&app, &settings)
}

#[tauri::command]
fn get_settings_command(app: AppHandle) -> Result<Settings, String> {
    Ok(get_settings(&app))
}

// 验证 Azure API Key 是否有效
// 通过调用 Azure 的语音列表 API 来测试
#[tauri::command]
async fn validate_azure_api_key(api_key: String, region: String) -> Result<bool, String> {
    if api_key.is_empty() {
        return Ok(false);
    }

    let check_script = format!(
        r#"
$headers = @{{
    'Ocp-Apim-Subscription-Key' = '{}'
}}

try {{
    $response = Invoke-RestMethod -Uri 'https://{}.tts.speech.microsoft.com/cognitiveservices/voices/list' -Headers $headers -Method Get -TimeoutSec 10
    Write-Output 'VALID'
}} catch {{
    Write-Output 'INVALID'
}}
"#,
        api_key.replace("'", "''"),
        region
    );

    match run_hidden_command(&check_script) {
        Ok(output) => {
            let is_valid = output.trim() == "VALID";
            log::info!("Azure API Key validation result: {}", if is_valid { "VALID" } else { "INVALID" });
            Ok(is_valid)
        }
        Err(e) => {
            log::warn!("Azure API Key validation failed: {}", e);
            Ok(false)
        }
    }
}

fn main() {
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info"))
        .format_timestamp_secs()
        .init();

    log::info!("G-Reader starting...");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            generate_speech,
            save_settings,
            get_settings_command,
            open_settings_window,
            validate_azure_api_key,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
