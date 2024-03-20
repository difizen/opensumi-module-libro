import { Domain } from '@opensumi/ide-core-common';

import {
  ComponentContribution,
  ComponentRegistry,
  getIcon,
  SlotLocation,
} from '@opensumi/ide-core-browser';
import { Devtools, Preview } from './index.view';

@Domain(ComponentContribution)
export class CustomViewContribution implements ComponentContribution {
  registerComponent(registry: ComponentRegistry) {
    registry.register(
      'opensumi-preview',
      [],
      {
        iconClass: getIcon('browser-preview'),
        title: 'Preview',
        priority: 1,
        containerId: 'opensumi-preview-container',
        component: Preview,
      },
      SlotLocation.right,
    );
    registry.register(
      'opensumi-devtools',
      [],
      {
        title: 'Devtools',
        priority: 1,
        containerId: 'opensumi-devtools-container',
        component: Devtools,
      },
      SlotLocation.bottom,
    );
  }
}
