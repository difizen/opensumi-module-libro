import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { LibroContribution } from './libro.contribution';

@Injectable()
export class OpensumiLibroModule extends BrowserModule {
  providers: Provider[] = [
    LibroContribution
  ];
}
