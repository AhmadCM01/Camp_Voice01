$ErrorActionPreference = 'Stop'

if (!(Test-Path .\.expo-home)) {
  New-Item -ItemType Directory -Path .\.expo-home | Out-Null
}

$Env:EXPO_HOME = (Resolve-Path .\.expo-home).Path

npx expo start --dev-client --lan -c
