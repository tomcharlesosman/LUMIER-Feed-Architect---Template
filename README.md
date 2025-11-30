
# LUMIER - AI Product Feed Architect Template

A high-fidelity, luxury-focused React application that uses Google's Gemini 3.0 Pro Vision model to generate cohesive Instagram 3x3 grids for e-commerce products.

**Tech Stack:** React, Tailwind CSS, Google GenAI SDK, IndexedDB (for client-side persistence).

## Features

-   **High-End Aesthetic**: Designed with a luxury "Atelier" UI/UX.
-   **8 Built-in Themes**: Easily switch between Luxury, Dark Mode, Cyber, Organic, Swiss, Vogue, Gallery, and Scandi styles.
-   **Multi-Image Input**: Upload up to 6 source product images.
-   **Style Presets**: 9 curated aesthetic directions (Minimalist, Riviera, Noir, etc.).
-   **Local Persistence**: 
    -   Uses `localStorage` for UI preferences.
    -   Uses `IndexedDB` to persist large generated image history without hitting local storage quotas.
-   **Gemini 3.0 Integration**: Uses `gemini-3-pro-image-preview` for state-of-the-art image synthesis.

## Quick Start (Local Development)

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/lumier-template.git
    cd lumier-template
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the server**:
    ```bash
    npm start
    ```
    The app will typically launch at `http://localhost:3000`.

## Setting up the API Key

**Option A: Google AI Studio (Fastest)**
If you are running this template inside Google AI Studio, the environment handles authentication automatically. Just click "Connect Access Key" when prompted.

**Option B: Local Development / Deployment**
1.  **Get an API Key**: Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a paid API key.
2.  **Configure Environment**: 
    -   Create a `.env` file in the project root.
    -   Add your key: `API_KEY=your_actual_api_key_here`
    -   *Note*: Depending on your build tool (Vite, CRA, etc.), you may need to prefix this variable (e.g., `REACT_APP_API_KEY`) and update `services/geminiService.ts` to reference `process.env.REACT_APP_API_KEY` instead.

## Theming & Customization

The app includes a built-in **Theme Engine** in `index.html` that allows you to completely remix the look and feel by changing a single line of code.

### How to Switch Themes
Open `index.html` and look for the configuration block at the top:

```javascript
const ACTIVE_THEME = 'VOGUE'; // Change this string
```

**Available Themes:**
1.  **`LUMIER`** (Default): Luxury fashion. *Bodoni Moda* + *Space Grotesk*.
2.  **`ONYX`**: Dark Mode. Sophisticated. *Playfair Display* + *Inter*.
3.  **`VAPOR`**: Cyberpunk/Tech. *Rajdhani* + *Share Tech Mono*.
4.  **`BOTANICAL`**: Organic/Earth. *DM Serif Display* + *DM Sans*.
5.  **`SWISS`**: Minimalist. *Inter Tight* + *Roboto Mono*.
6.  **`VOGUE`**: Editorial High-Fashion. *Cormorant Garamond* + *Proza Libre*.
7.  **`GALLERY`**: Art House/Eccentric. *Syne* + *Public Sans*.
8.  **`SCANDI`**: Modern Clean. *Outfit* + *Lora*.

### Creating Your Own Theme
You can add your own theme object to the `THEMES` constant in `index.html`:

```javascript
MY_THEME: {
  colors: {
    sand: '#ff0000',      // Main Background
    stone: '#cccccc',     // Secondary Background/Borders
    charcoal: '#ffffff',  // Main Text
    gold: '#ffff00',      // Accent
  },
  fonts: {
    serif: ['"Comic Sans MS"', 'serif'],
    sans: ['"Arial"', 'sans-serif'],
  }
}
```

## Advanced: Prompt Engineering

The core logic resides in `services/geminiService.ts`. The prompt is constructed dynamically:

`"Create a 9-image Instagram feed for [noun] [STYLE_PROMPT]..."`

To drastically change the output behavior:
1.  **Modify the Base Prompt**: In `geminiService.ts`, change the structural instructions (e.g., instead of a "9-image grid", ask for a "magazine cover layout" or "product packaging design").
2.  **Tweak Presets**: In `constants.ts`, use strong adjectives, lighting descriptions, and camera angles (e.g., "macro lens", "golden hour") to guide the model.

## Troubleshooting & Limits

-   **API Errors (403/400)**: Ensure your Google Cloud Project has billing enabled. Gemini 3.0 Pro Image generation often requires a paid tier.
-   **"No image generated"**: This can happen if the safety filters trigger. Try a different product image or a milder style prompt.
-   **Storage Limits**: If the History stops saving, you may have exceeded your browser's IndexedDB quota. Clear your browser data for the site to reset it.
-   **File Types**: The app supports JPEG, PNG, and WebP. HEIC (iPhone) images may need conversion before upload depending on your browser.

## Deployment

This is a static React application. It can be deployed to:
-   Firebase Hosting
-   Vercel / Netlify
-   GitHub Pages

**Environment Variables**:
Ideally, you do not ship the API key in the code. The current implementation relies on `window.aistudio` (Google AI Studio environment) or `process.env.API_KEY` being injected at build time.

## Security & Privacy

This template is designed to be secure by default:
-   **API Keys**: Never commit your `.env` file containing your API key to GitHub. The included `.gitignore` file prevents this.
-   **Client-Side Processing**: All image processing happens in the user's browser or directly via Google's API. No intermediate server stores the user's photos.
-   **Data Persistence**: History is stored in the browser's `IndexedDB`. It is local to the user's machine and is not shared.

## Project Structure

-   `App.tsx`: Main application logic.
-   `services/geminiService.ts`: AI generation logic and prompt engineering.
-   `services/persistence.ts`: Handles saving history to the browser database.
-   `components/`: Reusable UI components (Buttons, Drawers, Modals).

## Future Ideas & Roadmap

This template is a starting point. Here are ways you can expand it into a full SaaS product:

### 1. Monetization Strategy
-   **Freemium Model**: Offer low-res (1K) generations for free, and charge for 4K "Pro" downloads.
-   **Credit System**: Integrate **Stripe** or **Lemon Squeezy**. Users buy "tokens" to generate feeds (e.g., $10 for 50 generations).
-   **Agency Whitelabel**: Sell this tool to marketing agencies with their own branding.

### 2. Marketing Angles
-   **E-commerce Owners**: "Stop spending thousands on photoshoots. Generate your Q4 campaign in seconds."
-   **Dropshippers**: "Test 10 different aesthetic angles for your product ads instantly."
-   **Social Media Managers**: "Plan your client's entire grid layout in one click."

### 3. Niche Adaptations (Remix Ideas)
-   **Real Estate Staging**: Change the prompt to take empty room photos and fill them with furniture styles (Mid-century, Industrial).
-   **Culinary/Menu Design**: Upload basic food photos and generate high-end Michelin-style plating compositions.
-   **Sneakerheads**: Create specialized "Streetwear" styles for shoe resellers.

## Credits

Made by **Tom Osman**
-   Website: [www.tomosman.com](https://www.tomosman.com)
-   X (Twitter): [@tomosman](https://x.com/tomosman)

## License

MIT License - Free to remix and use for personal or commercial projects.
