# CampVoice Mobile Release

## Android (APK)

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

