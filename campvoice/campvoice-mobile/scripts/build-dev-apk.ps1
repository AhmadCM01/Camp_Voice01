$ErrorActionPreference = 'Stop'

if (!(Test-Path .\.expo-home)) {
  New-Item -ItemType Directory -Path .\.expo-home | Out-Null
}

$Env:EXPO_HOME = (Resolve-Path .\.expo-home).Path

npx --yes eas-cli build -p android --profile development
