# JMT Application Architecture

This document describes the current implementation for AI agents and maintainers. Treat the source code as authoritative if this document becomes stale, and update this guide when a change materially alters routes, data flow, or application structure.

## Application Summary

JMT (Janma Mrityu Tathya) is an Expo / React Native mobile application for finding and saving civil certificates. The implemented service currently downloads birth certificates. Death certificate, help, about, and legal destinations are shown as unavailable; they have no routes or service implementations.

The app uses JavaScript, Expo Router, React Native `StyleSheet`, and a shared color palette. It does not use NativeWind or Tailwind.

## Runtime and Tooling

- Expo SDK: 58 (`expo` package in `package.json`)
- React Native: 0.88
- React: 19
- Navigation: Expo Router file-based routing
- Package manager: npm, with `package-lock.json`
- Styling: React Native `StyleSheet`; shared tokens in `src/theme/colors.js`
- Native generation: Continuous Native Generation (CNG); `ios/` and `android/` are generated and should not be edited by hand.
- Native modules used by current flows include Expo FileSystem, Expo LinearGradient, Expo StatusBar, and safe-area context.

Useful commands:

```sh
npm start
npx expo lint
npx expo export --platform android
npx expo export --platform ios
```

The project does not define a test script. Validate affected behavior with the narrowest applicable checks, and bundle the app for the platforms affected by a change.

## Source Layout

```text
src/
  app/
    _layout.js                  Root Stack navigator and screen header options
    index.js                    Home/service-selection screen
    birth-download.js           Birth-certificate download workflow
  components/
    BirthDownloadForm.js        Birth certificate form UI
    NavigationMenu.js           Right-side navigation drawer
  schemas/
    birthDownload.schema.js     Zod validation for birth-download fields
  services/
    birthDownloadService.js     Remote certificate lookup and PDF retrieval
  theme/
    colors.js                   Shared design tokens and category palettes
  utils/
    formData.util.js            FormData construction helper
    toPdfBytes.util.js          Normalizes binary response shapes to Uint8Array
assets/
  icon.png                      Main brand logo and home/drawer reference
  ...                           Expo and platform icon assets
```

Other important root files:

- `app.json`: Expo app identity, platform settings, and config plugins.
- `babel.config.js`: Babel preset from Expo.
- `metro.config.js`: Default Expo Metro configuration.
- `eslint.config.js`: JavaScript and JSX lint configuration.
- `.gitignore`: Excludes generated Expo output, dependencies, native CNG output, local environment files, and signing artifacts.
- `AGENTS.md`: Repository-specific instructions for coding agents.

## Navigation and Screens

`src/app/_layout.js` provides a Stack navigator:

| Route | Screen | Availability |
| --- | --- | --- |
| `/` | `src/app/index.js` | Available |
| `/birth-download` | `src/app/birth-download.js` | Available |

The navigation menu button is configured only in the Home screen's Stack header. It is not shown on the birth-download screen.

### Home screen

`src/app/index.js` presents the JMT logo, introductory content, and certificate service cards:

- Birth is an active link to `/birth-download`.
- Death is styled with the death-certificate palette but disabled.

Do not link disabled entries to missing screens or invent a backend flow for them.

### Right-side navigation drawer

`src/components/NavigationMenu.js` is rendered by the Home header and implements a modal drawer:

- Opens from the right, with width set to 84% of the viewport up to 420 points.
- Uses an animated horizontal translation and a dimmed backdrop.
- Closes from the close button, backdrop press, and Android modal back handling.
- Uses safe-area insets, accessible labels/states, and a scrollable menu with a pinned footer.
- Home and birth routes are active. Death, About Application, Help & Support, Privacy Policy, and Terms & Conditions are visibly disabled until implemented.
- Version text is read from `Constants.expoConfig.version`, with a fallback.

The drawer header's gradient uses `expo-linear-gradient`. Keep the birth palette blue and the death palette purple.

## Birth Certificate Download Flow

The screen-level orchestration is in `src/app/birth-download.js`; presentational form controls are in `src/components/BirthDownloadForm.js`; remote API operations are in `src/services/birthDownloadService.js`.

### Data flow

1. The form captures date of birth, mother's first name, and birth certificate number in screen state.
2. `birthDownloadSchema.safeParse` validates trimmed values before network access.
3. `BirthDownloadService.downloadBirthCertificate` performs the remote lookup:
   - Splits the date into day, month, and year.
   - Looks up records using the birth year, month, mother's name, and certificate number.
   - Selects the record whose registration number includes the supplied certificate number and reads its acknowledgement number.
   - Posts the acknowledgement number and date to obtain an encoded identifier.
   - Requests the certificate PDF as an array buffer.
4. `toPdfBytes` normalizes supported binary response forms to `Uint8Array`.
5. The screen checks that the first five bytes are the PDF signature `%PDF-`.
6. `Directory.pickDirectoryAsync()` opens the native directory picker. The user chooses a destination, and the screen creates a timestamped PDF in that directory using the `application/pdf` MIME type.
7. On success, the screen confirms the saved filename. Cancelling the directory picker is treated as cancellation, not as a download error.

### Validation and error handling

`src/schemas/birthDownload.schema.js` enforces:

- Date format `DD/MM/YYYY`.
- A real calendar date that is not in the future.
- Mother's first name with at least three characters.
- A non-empty certificate number.

The screen displays the first Zod issue in an alert and does not start the request when validation fails. Service, binary-conversion, PDF-signature, and file-write errors are surfaced through alerts. Loading state disables duplicate submissions and is reset in `finally`.

The mother-name label says “first 3 characters,” but the current implementation only enforces a minimum of three characters; it does not truncate input. The full trimmed field is sent to the service. Preserve or deliberately resolve this behavior when changing the field contract.

### Keyboard behavior

The screen wraps the form in `KeyboardAvoidingView` (`padding` on iOS, `height` on Android) and a bounded, flexing `ScrollView`. Keyboard visibility and input focus add bottom scroll space so the final action remains reachable with the keyboard open. Inputs advance focus in order: date, mother's name, certificate number.

## Remote Service

`src/services/birthDownloadService.js` owns the Axios client and the three-step external service integration. Form encoding is delegated to `src/utils/formData.util.js`; binary normalization is delegated to `src/utils/toPdfBytes.util.js`.

The service calls the public JMT certificate host over HTTPS:

- `GET /Account/GetknowyourApplicationList` for the acknowledgement number.
- `POST /BirthCitizen/GetTrackApplicationNew` for the encoded identifier.
- `GET /Birth?id=...` for the PDF bytes.

The integration depends on the external service's response shape, registration-number matching, cookies, and anti-forgery request data. These are upstream details, not a stable app-owned API. The service logs and rethrows errors; the screen is responsible for user-facing alerts.

**Credential handling:** The current service module contains request-token and cookie constants. Do not copy their values into documentation, logs, examples, or generated output. Values embedded in a mobile client cannot be treated as secret. A production architecture should move privileged or session-bound request material behind a controlled server-side integration.

## UI and Design System

`src/theme/colors.js` is the canonical source for:

- Shared blue, cyan, navy, neutral, and semantic colors.
- `colors.birth` blue shades and `colors.death` purple shades.
- App background, card, border, primary text, and secondary text colors.

The UI uses `StyleSheet` in components and screens. Keep controls mobile-first, preserve accessibility labels and touch targets, and reuse the shared tokens rather than introducing unrelated colors. `assets/icon.png` is the primary brand reference.

## Current Scope and Boundaries

- Only Home and Birth Download routes exist.
- Death-certificate download is not implemented. Do not create a service, endpoint, or route without approved requirements.
- About, support, privacy, and terms destinations are not implemented and remain disabled.
- There is no app-owned backend, database, authentication layer, persistence layer, or automated test suite in the current source tree.
- Do not add NativeWind/Tailwind classes or restore their Babel/Metro setup; use `StyleSheet`.
- Keep route screens in `src/app/`; put reusable UI, service, schema, theme, and utility modules in their corresponding sibling directories.

## Agent Change Checklist

1. Read this guide and the relevant source files before changing behavior.
2. Keep the service, screen orchestration, schema, and form UI responsibilities separated.
3. Do not expose request-token or cookie values in documentation, alerts, or logs.
4. Keep unavailable destinations disabled until real routes and service requirements exist.
5. For Expo or React Native API changes, check the installed Expo major version and matching versioned documentation before implementation.
6. Run `npx expo lint` and export for the affected native platform(s); remove generated `dist/` output after validation if it is not intended as a deliverable.
