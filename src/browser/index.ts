import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { INotebookService } from '@opensumi/ide-editor';
import { LibroCommandContribution } from './libro.command';
import { LibroContribution } from './libro.contribution';
import { ILibroOpensumiService, LibroOpensumiService } from './libro.service';
import { LibroTracker } from './libro.view.tracker';
import { NotebookServiceOverride } from './notebook.service';
import { TocContribution } from './toc/toc.contribution';
export * from './kernel-panel';
export * from './libro.color.tokens';
export * from './libro.contribution';
export * from './libro.protocol';
export * from './libro.service';
export * from './toc';

@Injectable()
export class OpensumiLibroModule extends BrowserModule {
  providers: Provider[] = [
    LibroContribution,
    LibroCommandContribution,
    TocContribution,
    LibroTracker,
    {
      token: ILibroOpensumiService,
      useClass: LibroOpensumiService,
    },
    {
      token: INotebookService,
      useClass: NotebookServiceOverride,
    },
  ];
}
