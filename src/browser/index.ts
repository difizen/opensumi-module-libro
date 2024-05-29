import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { LibroCommandContribution } from './libro.command';
import { LibroContribution } from './libro.contribution';
import { ILibroOpensumiService, LibroOpensumiService } from './libro.service';
import { TocContribution } from './toc/toc.contribution';
import { ILibroTocService, LibroTocService } from './toc/toc.service';
export * from './libro.color.tokens';

@Injectable()
export class OpensumiLibroModule extends BrowserModule {
  providers: Provider[] = [
    LibroContribution,
    LibroCommandContribution,
    TocContribution,
    {
      token: ILibroOpensumiService,
      useClass: LibroOpensumiService,
    },
    {
      token: ILibroTocService,
      useClass: LibroTocService,
    },
  ];
}
