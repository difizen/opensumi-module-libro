import { Autowired } from '@opensumi/di';
import {
  ComponentContribution,
  ComponentRegistry,
  Domain,
} from '@opensumi/ide-core-browser';
import { IconService } from '@opensumi/ide-theme/lib/browser';
import { IconType } from '@opensumi/ide-theme/lib/common';
import { KernelTerminalPanel } from './kernel.terminal.panel';
import { KERNEL_TERMINAL_ID } from './kernel.terminal.protocol';

@Domain(ComponentContribution)
export class KernelTerminalContribution implements ComponentContribution {
  @Autowired(IconService)
  protected readonly iconService: IconService;

  registerComponent(registry: ComponentRegistry) {
    const iconClass = this.iconService.fromIcon(
      '',
      {
        dark: 'https://mdn.alipayobjects.com/huamei_xt20ge/afts/img/A*ae86Sq9KTxcAAAAAAAAAAAAADiuUAQ/original',
        light:
          'https://mdn.alipayobjects.com/huamei_xt20ge/afts/img/A*ae86Sq9KTxcAAAAAAAAAAAAADiuUAQ/original',
      },
      IconType.Background,
    );
    registry.register('@opensumi/libro-kernel-terminal', [], {
      containerId: KERNEL_TERMINAL_ID,
      iconClass: iconClass,
      title: '运行的终端和内核',
      component: KernelTerminalPanel,
      priority: 9,
      activateKeyBinding: 'ctrlcmd+shift+k',
    });
  }
}
