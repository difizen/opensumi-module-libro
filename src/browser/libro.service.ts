import { LibroService, LibroView } from '@difizen/libro-jupyter';
import { GlobalContainer } from '@difizen/mana-app';
import { Injectable } from '@opensumi/di';
import { URI } from '@opensumi/ide-core-common';

export const ILibroOpensumiService = Symbol('ILibroOpensumiService');

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface ILibroOpensumiService {
  getOrCreatLibroView(uri: URI): Promise<LibroView>;
}

// @singleton()
@Injectable()
export class LibroOpensumiService {
  protected libroService: LibroService;
  // @Autowired(INJECTOR_TOKEN)
  // private readonly injector: Injector;

  constructor() {
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
}
