# CampVoice Mobile Release

## Why a Dev Build

Expo Go from the Play Store may lag behind the latest Expo SDK. When the project uses newer native modules (e.g., Reanimated/Worklets in SDK 55), Expo Go can show runtime/native mismatch errors. A Development Build (dev client) ships the exact native runtime your app needs.

This repo is configured to build a **Development APK** via the `development` profile in `eas.json`.

## Android (APK)

### Development build (recommended for testing)

1. Install EAS CLI:

```bash
npm i -g eas-cli
```

2. Log in:

```bash
eas login
```

3. Build a Development APK (dev client):

```bash
cd campvoice-mobile
eas build -p android --profile development
```

4. Install the APK on your device.

5. Start the dev server for the dev client:

```bash
cd campvoice-mobile
npx expo start --dev-client --lan
```

6. Open the dev client app on your phone and scan the QR code.

### Preview build (APK download for demos)

1. Install EAS CLI:

```bash
npm i -g eas-cli
```

2. Log in:

```bash
eas login
```

3. Build an APK for internal distribution:

```bash
cd campvoice-mobile
eas build -p android --profile preview
```

4. Download the build from the EAS link.
5. Host the APK (recommended options):
   - GitHub Releases
   - Google Drive (public link)
   - Any static hosting

6. Set the web download URL:
   - `campvoice-web/.env.local` (or Vercel env)
     - `NEXT_PUBLIC_ANDROID_DOWNLOAD_URL=https://.../campvoice.apk`

## iOS (TestFlight)

1. Build:

```bash
cd campvoice-mobile
eas build -p ios --profile production
```

2. Submit:

```bash
eas submit -p ios --profile production
```

3. Set the web download URL:
   - `NEXT_PUBLIC_IOS_DOWNLOAD_URL=https://testflight.apple.com/join/...`

## Notes

- APK files are **Android-only**. For iOS, you distribute via **TestFlight/App Store** (IPA), not APK.

