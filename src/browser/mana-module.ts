import { ManaModule } from '@difizen/mana-app';
import { LibroOpensumiContentContribution } from './libro-opensumi-content-contribution';

export const LibroOpensumiModule = ManaModule.create()
  .register(LibroOpensumiContentContribution)