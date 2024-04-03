import { ManaModule } from '@difizen/mana-app';
import { LibroOpensumiModule } from '@difizen/opensumi-module-libro/mana/mana-module';
import { LibroApp } from './libro-application';

export const DemoLibroModule = ManaModule.create()
  .register(LibroApp)
  .dependOn(LibroOpensumiModule);
