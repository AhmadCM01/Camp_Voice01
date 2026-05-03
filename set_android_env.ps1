$sdk = 'C:\Users\USER\AppData\Local\Android\Sdk'
$platformTools = Join-Path $sdk 'platform-tools'
$emulatorDir = Join-Path $sdk 'emulator'

if (-not (Test-Path $sdk)) {
  Write-Host "Android SDK folder not found at: $sdk"
  exit 1
}

[Environment]::SetEnvironmentVariable('ANDROID_HOME', $sdk, 'User')
[Environment]::SetEnvironmentVariable('ANDROID_SDK_ROOT', $sdk, 'User')

$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if ([string]::IsNullOrWhiteSpace($userPath)) { $userPath = '' }

foreach ($p in @($platformTools, $emulatorDir)) {
  if ($userPath -notlike "*$p*") {
    if ($userPath -and -not $userPath.TrimEnd().EndsWith(';')) { $userPath += ';' }
    $userPath += "$p;"
  }
}

[Environment]::SetEnvironmentVariable('Path', $userPath, 'User')

$env:ANDROID_HOME = $sdk
$env:ANDROID_SDK_ROOT = $sdk
$env:Path = $env:Path + ';' + $platformTools + ';' + $emulatorDir

Write-Host "ANDROID_HOME=$env:ANDROID_HOME"
Write-Host "ANDROID_SDK_ROOT=$env:ANDROID_SDK_ROOT"
Write-Host "PATH updated for this terminal session."

Write-Host ''
Write-Host 'adb --version'
adb --version

Write-Host ''
Write-Host 'emulator -list-avds'
emulator -list-avds

