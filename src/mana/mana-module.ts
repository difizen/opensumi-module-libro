import { ManaModule } from '@difizen/mana-app';
import { LibroOpensumiContentContribution } from './libro-opensumi-content-contribution';
import { LibroOpensumiContentSaveContribution } from './libro-opensumi-save-content-contribution';

export const LibroOpensumiModule = ManaModule.create().register(
  LibroOpensumiContentContribution,
  LibroOpensumiContentSaveContribution,
);
