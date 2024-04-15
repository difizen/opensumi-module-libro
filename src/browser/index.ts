import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { LibroContribution } from './libro.contribution';
import { ILibroOpensumiService, LibroOpensumiService } from './libro.service';

@Injectable()
export class OpensumiLibroModule extends BrowserModule {
  providers: Provider[] = [
    LibroContribution,
    {
      token: ILibroOpensumiService,
      useClass: LibroOpensumiService,
    },
  ];
}
