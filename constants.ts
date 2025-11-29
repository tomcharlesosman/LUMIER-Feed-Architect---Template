
export interface StylePreset {
  id: string;
  label: string;
  description: string;
  prompt: string;
}

export const STYLE_PRESETS: Record<string, StylePreset> = {
  NATURAL: {
    id: 'NATURAL',
    label: 'Natural / Auto',
    description: 'Let the product define the aesthetic.',
    prompt: 'that naturally complements the product features and context.'
  },
  MINIMALIST: {
    id: 'MINIMALIST',
    label: 'Studio Minimal',
    description: 'Clean lines, soft light, negative space.',
    prompt: 'in a high-end minimalist studio aesthetic. Use clean lines, soft natural lighting, neutral backgrounds (white, beige, grey), and negative space. Focus on pure product photography with subtle shadows.'
  },
  RIVIERA: {
    id: 'RIVIERA',
    label: 'Coastal Riviera',
    description: 'Sun-drenched, organic textures, warm tones.',
    prompt: 'in a luxury coastal Riviera aesthetic. Incorporate warm sunlight, stone textures, organic elements, dry florals, and a relaxed, sun-drenched atmosphere.'
  },
  METRO: {
    id: 'METRO',
    label: 'Urban Metro',
    description: 'Concrete, glass, modern architecture.',
    prompt: 'in a modern urban aesthetic. Use concrete textures, glass architectural elements, sharp daylight, and city shadows. Sophisticated and street-smart.'
  },
  EDITORIAL: {
    id: 'EDITORIAL',
    label: 'Bold Editorial',
    description: 'Dramatic angles, high contrast, avant-garde.',
    prompt: 'in a bold fashion editorial aesthetic. Use dramatic lighting, high contrast, unusual angles, and avant-garde compositions reminiscent of high-end fashion magazines.'
  },
  VINTAGE: {
    id: 'VINTAGE',
    label: 'Retro Film',
    description: 'Analog grain, warm wash, nostalgic.',
    prompt: 'in a vintage analog film aesthetic. Simulate 35mm film grain, warm color washes, light leaks, and a nostalgic 1970s or 1980s high-fashion vibe.'
  },
  HERITAGE: {
    id: 'HERITAGE',
    label: 'Timeless Heritage',
    description: 'Old money, rich textures, classic luxury.',
    prompt: 'in a classic "old money" heritage aesthetic. Incorporate rich textures like dark wood, leather, velvet, and marble. Use traditional lighting and a sophisticated, aristocratic atmosphere.'
  },
  NOIR: {
    id: 'NOIR',
    label: 'Cinematic Noir',
    description: 'Dramatic shadows, monochrome elegance.',
    prompt: 'in a dramatic film noir aesthetic. Use high-contrast chiaroscuro lighting, deep shadows, and a monochromatic or desaturated palette. Moody, cinematic, and sharp.'
  },
  ETHEREAL: {
    id: 'ETHEREAL',
    label: 'Soft Dreamscape',
    description: 'Hazy, romantic, silk and light.',
    prompt: 'in an ethereal, romantic aesthetic. Use soft-focus lenses, diffusion filters, warm pastel tones (cream, blush, champagne), and dreamlike lighting. Incorporate elements like silk, tulle, or soft floral arrangements.'
  }
};
