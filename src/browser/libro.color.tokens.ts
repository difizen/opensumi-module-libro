import { localize } from '@opensumi/ide-core-browser';
import { registerColor } from '@opensumi/ide-theme/lib/common';

export const libroBackground = registerColor(
  'libro.background',
  { dark: '#151b21', light: '#ffffff', hcDark: null, hcLight: null },
  localize('libro.background', 'Background color of libroView'),
  true,
);

export const libroSideToolbarBackground = registerColor(
  'libro.side.toolbar.background',
  { dark: '#20262E', light: '#ffffff', hcDark: null, hcLight: null },
  localize('libro.side.toolbar.background', 'the side toolbar color of libro'),
  true,
);

export const libroOutputBackground = registerColor(
  'libro.output.background',
  { dark: '#222830', light: '#ffffff', hcDark: null, hcLight: null },
  localize('libro.output.background', 'the output color of libro'),
  true,
);

export const libroIntputBackground = registerColor(
  'libro.input.background',
  { dark: '#151b21', light: '#f4f6fb', hcDark: null, hcLight: null },
  localize('libro.input.background', 'the input color of libro'),
  true,
);
