import { Injectable } from '@opensumi/di';
import { LibroService, LibroView, NotebookService } from '@difizen/libro-jupyter';
import { URI } from '@opensumi/ide-core-common';
import { inject, singleton } from '@difizen/mana-app';
import { GlobalContainer } from '@difizen/mana-app';

export const ILibroOpensumiService = Symbol('ILibroOpensumiService');

export interface ILibroOpensumiService {
    getOrCreatLibroView(uri:URI):Promise<LibroView>;
}

// @singleton()
@Injectable()
export class LibroOpensumiService {
    protected libroService: LibroService;
    // @Autowired(INJECTOR_TOKEN)
    // private readonly injector: Injector;

    constructor(){
        console.log('constructor LibroOpensumiService',GlobalContainer,LibroService,this.libroService)
        this.libroService = GlobalContainer.get(LibroService)
    }
    
    getOrCreatLibroView = async (uri:URI)=> {
        const libroOption = {
            id:uri.toString(),
            resource: uri.toString(),
            loadType: 'libro-opensumi-loader',
        };
        const libroView = await this.libroService.getOrCreateView(libroOption);
        return libroView;
    }

}