import { Autowired, Injector, INJECTOR_TOKEN } from '@opensumi/di';
import {
  ClientAppContribution,
  ComponentContribution,
  ComponentRegistry,
  Domain,
  getIcon,
} from '@opensumi/ide-core-browser';
import { EXPLORER_CONTAINER_ID } from '@opensumi/ide-explorer/lib/browser/explorer-contribution';
import {
  ICreateTerminalOptions,
  ITerminalClientFactory2,
  IWidget,
} from '@opensumi/ide-terminal-next';
import { TerminalClientFactory } from '@opensumi/ide-terminal-next/lib/browser/terminal.client';

export function createTerminalClientFactory(injector: Injector) {
  return async (widget: IWidget, options?: ICreateTerminalOptions) => {
    const defaultTerminalEnvironmentVariables = {
      CUSTOM_ENV_VARIABLE: 'CUSTOM_ENV_VARIABLE',
    };
    const terminalOptions: ICreateTerminalOptions = options || {};

    terminalOptions.config = {
      profileName: 'terminal.type',
      ...terminalOptions.config,
      env: {
        ...terminalOptions.config?.env,
        ...defaultTerminalEnvironmentVariables,
      },
    };

    return TerminalClientFactory.createClient2(
      injector,
      widget,
      terminalOptions,
    );
  };
}

@Domain(ClientAppContribution, ComponentContribution)
export class TerminalEnvContribution
  implements ClientAppContribution, ComponentContribution
{
  @Autowired(INJECTOR_TOKEN)
  private injector: Injector;

  initialize() {
    this.injector.overrideProviders({
      token: ITerminalClientFactory2,
      useFactory: createTerminalClientFactory,
    });
  }

  registerComponent(registry: ComponentRegistry) {
    registry.register('@opensumi/ide-explorer', [], {
      iconClass: getIcon('experiment'),
      title: 'Experiment',
      priority: 10,
      containerId: EXPLORER_CONTAINER_ID,
    });
  }
}
