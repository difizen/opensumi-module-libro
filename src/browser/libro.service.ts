import { LibroService, LibroView } from '@difizen/libro-jupyter';
import { GlobalContainer } from '@difizen/mana-app';
import { Injectable } from '@opensumi/di';
import { URI, WithEventBus } from '@opensumi/ide-core-browser';
import { ResourceDecorationNeedChangeEvent } from '@opensumi/ide-editor';

export const ILibroOpensumiService = Symbol('ILibroOpensumiService');

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface ILibroOpensumiService {
  getOrCreatLibroView(uri: URI): Promise<LibroView>;
  updateDirtyStatus(uri: URI, dirty: boolean): void;
}

// @singleton()
@Injectable()
export class LibroOpensumiService extends WithEventBus {
  protected libroService: LibroService;

  constructor() {
    super();
    this.libroService = GlobalContainer.get(LibroService);
  }

  getOrCreatLibroView = async (uri: URI) => {
    const libroOption = {
      id: uri.toString(),
      resource: uri.toString(),
      loadType: 'libro-opensumi-loader',
    };
    const libroView = await this.libroService.getOrCreateView(libroOption);
    return libroView;
  };

  updateDirtyStatus(uri: URI, dirty: boolean) {
    this.eventBus.fire(
      new ResourceDecorationNeedChangeEvent({
        uri,
        decoration: {
          dirty,
        },
      }),
    );
  }
}
