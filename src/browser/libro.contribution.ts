import { Container, ThemeService } from '@difizen/mana-app';
import { Autowired } from '@opensumi/di';
import {
  CommandContribution,
  CommandRegistry,
  Domain,
  Schemes,
  StorageProvider,
  URI,
} from '@opensumi/ide-core-browser';
import { ClientAppContribution } from '@opensumi/ide-core-browser/lib/common';
import {
  BrowserEditorContribution,
  EditorComponentRegistry,
  IResource,
  ResourceService,
  WorkbenchEditorService,
} from '@opensumi/ide-editor/lib/browser/types';
import { IconService } from '@opensumi/ide-theme/lib/browser';
import { IconType, IThemeService } from '@opensumi/ide-theme/lib/common';
import { IWorkspaceService } from '@opensumi/ide-workspace/lib/common';
import { ManaContainer } from '../common';
import { OpensumiLibroView } from './libro.view';

const LIBRO_COMPONENTS_VIEW_COMMAND = {
  id: 'opensumi-libro',
};

const LIBRO_COMPONENTS_ID = 'opensumi:libro';
const LIBRO_COMPONENTS_SCHEME_ID = 'ipynb';

@Domain(BrowserEditorContribution, ClientAppContribution, CommandContribution)
// export class LibroContribution implements ClientAppContribution, CommandContribution {
export class LibroContribution
  implements
    ClientAppContribution,
    BrowserEditorContribution,
    CommandContribution
{
  @Autowired(IWorkspaceService)
  protected readonly workspaceService: IWorkspaceService;

  @Autowired(ManaContainer)
  private readonly manaContainer: Container;

  @Autowired(IconService)
  protected readonly iconService: IconService;

  @Autowired(StorageProvider)
  protected readonly getStorage: StorageProvider;

  @Autowired(WorkbenchEditorService)
  protected readonly editorService: WorkbenchEditorService;

  @Autowired(IThemeService)
  protected readonly themeService: IThemeService;

  registerCommands(registry: CommandRegistry) {
    registry.registerCommand(LIBRO_COMPONENTS_VIEW_COMMAND, {
      execute: () => {
        this.editorService.open(new URI(`${LIBRO_COMPONENTS_SCHEME_ID}://`), {
          preview: false,
        });
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

    registry.registerEditorComponentResolver(
      Schemes.file,
      (resource, results) => {
        if (resource.uri.path.ext === `.${LIBRO_COMPONENTS_SCHEME_ID}`) {
          results.push({
            type: 'component',
            componentId: LIBRO_COMPONENTS_ID,
          });
        }
      },
    );
  }

  registerResource(service: ResourceService) {
    service.registerResourceProvider({
      scheme: LIBRO_COMPONENTS_SCHEME_ID,
      provideResource: async (uri: URI): Promise<IResource<any>> => {
        const iconClass = this.iconService.fromIcon(
          '',
          'https://mdn.alipayobjects.com/huamei_xt20ge/afts/img/A*LDFvSptm_zgAAAAAAAAAAAAADiuUAQ/original',
          IconType.Background,
        );
        return {
          uri,
          name: 'notebook',
          icon: iconClass!,
        };
      },
    });
  }

  async onDidStart() {
    const manaThemeService = this.manaContainer.get(ThemeService);
    const curTheme = await this.themeService.getCurrentTheme();
    manaThemeService.setCurrentTheme(curTheme.type);
    this.themeService.onThemeChange((theme) => {
      manaThemeService.setCurrentTheme(theme.type);
    });
  }
}
