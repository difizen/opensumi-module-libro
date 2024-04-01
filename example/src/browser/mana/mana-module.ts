import { ManaModule } from '@difizen/mana-app';
import { LibroApp } from './libro-application';
import { LibroOpensumiContentContribution } from './libro-opensumi-content-contribution';
import { LibroOpensumiContentSaveContribution } from './libro-opensumi-save-content-contribution';

export const LibroOpensumiModule = ManaModule.create().register(
  LibroOpensumiContentContribution,
  LibroOpensumiContentSaveContribution,
  LibroApp,
);
