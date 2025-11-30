
# Backend Implementation Plan (Template Edition)

## Current Architecture Status
**Standalone Client-Side Template**
-   **Frontend**: React + Tailwind (Fixed 100vh Layout).
-   **Theming**: `index.html` Theme Engine (`ACTIVE_THEME` variable) with **8 presets** (Lumier, Onyx, Vapor, Botanical, Swiss, Vogue, Gallery, Scandi).
-   **AI**: Google GenAI SDK (`gemini-3-pro-image-preview`).
-   **Persistence**: 
    -   `LocalStorage` for lightweight preferences (Size, Style).
    -   `IndexedDB` (via `persistence.ts`) for heavy image assets (History).
-   **Deployment**: Ready for static hosting (Firebase/Vercel).
-   **UI**: Finalized layout with specific attribution footer.

## Authentication
-   **Primary**: AI Studio Extension (Automatic Key Injection).
-   **Fallback**: Environment Variable (`process.env.API_KEY`) for local development or production builds.
-   **UI Handling**: The app intelligently detects the environment. If the AI Studio extension is missing and no env var is found, it prompts the user to configure their `.env` file rather than showing a non-functional "Connect" button.

## Database Schema (Client-Side)
The application currently uses an **IndexedDB** object store named `LumierDB` -> `history`.

**Object Structure (`HistoryItem`):**
```json
{
  "id": "string (timestamp)",
  "imageUrl": "string (base64 data URI)",
  "timestamp": "number",
  "size": "enum (1K, 2K, 4K)",
  "styleId": "string (PRESET_ID)"
}
```

## Storage Strategy
-   **Images**: Stored as Base64 strings within IndexedDB.
-   **Limit**: Browser storage quotas apply (typically huge, >500MB, compared to LocalStorage's 5MB).
-   **Cleanup**: Currently manual. A "Clear History" button could be added to `HistoryDrawer`.
-   **Input Handling**: App supports appending up to 6 files incrementally. UI handles distinct file removals.

## AI Integration
-   **Model**: `gemini-3-pro-image-preview`
-   **Prompt Engineering**: Located in `services/geminiService.ts` and `constants.ts`.
-   **Inputs**: Supports 1-6 images converted to inline Base64.

## One-Click Deployment Requirements
To deploy this as a functional web app:
1.  **Build**: Standard React build (`npm run build` or equivalent).
2.  **Config**: No special server-side config needed unless proxying API calls.
3.  **API Key**: Users must bring their own key (UI handles this), or you must bundle one (Not recommended for public templates).

## Security (Git Hygiene)
-   **Ignore Rules**: A `.gitignore` has been added to exclude `.env` files.
-   **Leak Prevention**: Environment variables are injected at build time. Users should never commit their actual API key string to the repository.
