import {
  CellUri,
  CellView,
  LanguageSpecRegistry,
  LibroService,
  LibroView,
} from '@difizen/libro-jupyter';
import { Container, getOrigin, URI as ManaURI } from '@difizen/mana-app';
import { Autowired, Injectable } from '@opensumi/di';
import { URI, WithEventBus } from '@opensumi/ide-core-browser';
import {
  ResourceDecorationNeedChangeEvent,
  WorkbenchEditorService,
} from '@opensumi/ide-editor';
import { makeObservable } from 'mobx';
import { ContentLoaderType, ManaContainer } from '../common';
import { LibroTracker } from './libro.view.tracker';

export const ILibroOpensumiService = Symbol('ILibroOpensumiService');

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface ILibroOpensumiService {
  // manaContainer: Container;
  libroTrackerMap: Map<string, LibroTracker>;
  // editorService: WorkbenchEditorService;
  getOrCreatLibroView: (uri: URI) => Promise<LibroView>;
  updateDirtyStatus: (uri: URI, dirty: boolean) => void;
  getCellViewByUri: (uri: URI) => Promise<CellView | undefined>;
  getCellLangauge: (cell: CellView) => string | undefined;
}

@Injectable()
export class LibroOpensumiService
  extends WithEventBus
  implements ILibroOpensumiService
{
  @Autowired(ManaContainer)
  private readonly manaContainer: Container;

  @Autowired(WorkbenchEditorService)
  protected readonly editorService: WorkbenchEditorService;

  constructor() {
    super();
    makeObservable(this);
  }

  getOrCreatLibroView = async (uri: URI) => {
    const libroOption = {
      modelId: uri.toString(),
      resource: uri.toString(),
      loadType: ContentLoaderType,
    };
    const libroService = this.manaContainer.get(LibroService);
    const libroView = await libroService.getOrCreateView(libroOption);
    return libroView;
  };

  getCellViewByUri = async (uri: URI) => {
    const parsed = CellUri.parse(
      new ManaURI(uri.toString(), { simpleMode: false }),
    );
    if (!parsed) {
      return;
    }
    const { notebookId, cellId } = parsed;
    const notebookUri = URI.file(notebookId);
    const libroView = await this.getOrCreatLibroView(notebookUri);
    const cell = libroView.model.cells.find((cell) => cell.model.id === cellId);
    return cell;
  };

  getCellLangauge = (cell: CellView) => {
    const languageSpecRegistry = this.manaContainer.get(LanguageSpecRegistry);
    return getOrigin(languageSpecRegistry.languageSpecs).find(
      (item) => item.mime === cell.model.mimeType,
    )?.language;
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

  libroTrackerMap: Map<string, LibroTracker> = new Map();
}
