import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { LibroCommandContribution } from './libro.command';
import { LibroContribution } from './libro.contribution';
import { ILibroOpensumiService, LibroOpensumiService } from './libro.service';
export * from './libro.color.tokens';

@Injectable()
export class OpensumiLibroModule extends BrowserModule {
  providers: Provider[] = [
    LibroContribution,
    LibroCommandContribution,
    {
      token: ILibroOpensumiService,
      useClass: LibroOpensumiService,
    },
  ];
}
