export interface ColorPreset {
  id: string;
  name: string;
  foreground: string;
  background: string;
  description: string;
}

export const colorPresets: ColorPreset[] = [
  { id: 'classic', name: 'Classic', foreground: '#000000', background: '#ffffff', description: 'Timeless black on white' },
  { id: 'ocean', name: 'Ocean', foreground: '#0c4a6e', background: '#e0f2fe', description: 'Deep blue on sky' },
  { id: 'forest', name: 'Forest', foreground: '#14532d', background: '#dcfce7', description: 'Rich green on mint' },
  { id: 'sunset', name: 'Sunset', foreground: '#7c2d12', background: '#fff7ed', description: 'Warm amber on cream' },
  { id: 'berry', name: 'Berry', foreground: '#581c87', background: '#faf5ff', description: 'Purple on lavender' },
  { id: 'rose', name: 'Rose', foreground: '#881337', background: '#fff1f2', description: 'Crimson on blush' },
  { id: 'mono-dark', name: 'Inverted', foreground: '#ffffff', background: '#0f172a', description: 'White on dark' },
  { id: 'slate', name: 'Slate', foreground: '#1e293b', background: '#f1f5f9', description: 'Charcoal on light gray' },
  { id: 'teal', name: 'Teal', foreground: '#134e4a', background: '#ccfbf1', description: 'Deep teal on aqua' },
  { id: 'indigo', name: 'Indigo', foreground: '#312e81', background: '#e0e7ff', description: 'Navy on periwinkle' },
  { id: 'crimson', name: 'Crimson', foreground: '#991b1b', background: '#fef2f2', description: 'Bold red on snow' },
  { id: 'gold', name: 'Gold', foreground: '#713f12', background: '#fefce8', description: 'Antique gold on pale' },
];
