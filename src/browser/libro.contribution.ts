import { Autowired } from '@opensumi/di';
import { ClientAppContribution } from '@opensumi/ide-core-browser/lib/common';
import {
  BrowserEditorContribution,
  EditorComponentRegistry,
  WorkbenchEditorService,
} from '@opensumi/ide-editor/lib/browser/types';
import {
  CommandContribution,
  CommandRegistry,
  Domain,
  Schemes,
  StorageProvider,
  URI,
} from '@opensumi/ide-core-common';
import { IWorkspaceService } from '@opensumi/ide-workspace/lib/common';
import { IconService } from '@opensumi/ide-theme/lib/browser';
import { OpensumiLibroView } from './libro.view';
import { GlobalContainer } from '@difizen/mana-app';
import { LibroService, LibroView } from '@difizen/libro-core';

const LIBRO_COMPONENTS_VIEW_COMMAND = {
  id: 'opensumi-libro',
};

const LIBRO_COMPONENTS_ID = 'opensumi:libro';
const LIBRO_COMPONENTS_SCHEME_ID = 'ipynb';

@Domain(BrowserEditorContribution, ClientAppContribution, CommandContribution)
// export class LibroContribution implements ClientAppContribution, CommandContribution {

export class LibroContribution implements ClientAppContribution, BrowserEditorContribution, CommandContribution {
  @Autowired(IWorkspaceService)
  protected readonly workspaceService: IWorkspaceService;

  @Autowired(IconService)
  protected readonly iconService: IconService;

  @Autowired(StorageProvider)
  protected readonly getStorage: StorageProvider;


  @Autowired(WorkbenchEditorService)
  protected readonly editorService: WorkbenchEditorService;


  registerCommands(registry: CommandRegistry) {
    registry.registerCommand(LIBRO_COMPONENTS_VIEW_COMMAND, {
      execute: () => {
        this.editorService.open(new URI(`${LIBRO_COMPONENTS_SCHEME_ID}://`), { preview: false });
      },
    });
  }

  registerEditorComponent(registry: EditorComponentRegistry) {
    registry.registerEditorComponent({
      uid: LIBRO_COMPONENTS_ID,
      scheme: LIBRO_COMPONENTS_SCHEME_ID,
      component: OpensumiLibroView,
      // renderMode: EditorComponentRenderMode.ONE_PER_WORKBENCH,
    });

    registry.registerEditorComponentResolver(Schemes.file, (resource, results) => {
      if (resource.uri.path.ext === `.${LIBRO_COMPONENTS_SCHEME_ID}`) {
        results.push({
          type: 'component',
          componentId: LIBRO_COMPONENTS_ID,
        });
      }
    });
  }

  async onDidStart() {
    // console.log('constructor LibroOpensumiService',GlobalContainer,LibroView)
    // this.libroService = GlobalContainer.get(LibroService)
    this.editorService.open(new URI(`${LIBRO_COMPONENTS_SCHEME_ID}://`), { preview: false });
  }
}
