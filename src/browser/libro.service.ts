import { LibroService, LibroView } from '@difizen/libro-jupyter';
import { Container } from '@difizen/mana-app';
import { Autowired, Injectable } from '@opensumi/di';
import { URI, WithEventBus } from '@opensumi/ide-core-browser';
import { ResourceDecorationNeedChangeEvent } from '@opensumi/ide-editor';
import { ManaContainer } from '../common';

export const ILibroOpensumiService = Symbol('ILibroOpensumiService');

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface ILibroOpensumiService {
  getOrCreatLibroView(uri: URI): Promise<LibroView>;
  updateDirtyStatus(uri: URI, dirty: boolean): void;
}

// @singleton()
@Injectable()
export class LibroOpensumiService extends WithEventBus {
  @Autowired(ManaContainer)
  private readonly manaContainer: Container;

  getOrCreatLibroView = async (uri: URI) => {
    const libroOption = {
      id: uri.toString(),
      resource: uri.toString(),
      loadType: 'libro-opensumi-loader',
    };
    const libroService = this.manaContainer.get(LibroService);
    const libroView = await libroService.getOrCreateView(libroOption);
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
