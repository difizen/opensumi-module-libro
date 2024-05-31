import '@opensumi/ide-i18n/lib/browser';
import { defaultConfig } from '@opensumi/ide-main-layout/lib/browser/default-config';
import { CommonBrowserModules } from './common-modules';
import { renderApp } from './render-app';

import { WelcomeContentSampleModule } from 'modules/add-welcome-content/browser';
import { ComponentsSampleModule } from 'modules/components/browser';
import { EditorTitleSampleModule } from 'modules/editor-title/browser';
import { TerminalEnvModule } from 'modules/terminal-env/browser';
import { TerminalBasicUsageModule } from 'modules/terminal-usage/browser';
import { TogglePanelSampleModule } from 'modules/toggle-panel/browser';
import { AntdComponentsSampleModule } from 'modules/use-antd/browser';

import './i18n';
import './styles.less';

import '@opensumi/ide-core-browser/lib/style/icon.less';
import '@opensumi/ide-core-browser/lib/style/index.less';
import { BuitinServicesSampleModule } from 'modules/builtin-services/browser';
import { CustomContextMenuModule } from 'modules/custom-context-menu/browser';
import { CustomToolbarModule } from 'modules/custom-toolbar/browser';
import { CustomEditorEmptyComponentModule } from 'modules/editor-empty-component/browser';
// import { DefaultLayout } from '@opensumi/ide-core-browser/lib/components';
import { SlotLocation } from '@opensumi/ide-core-browser';
import { CustomViewModule } from 'modules/custom-view/browser';
import { CustomMonacoEditorServicesSampleModule } from 'modules/editor-monaco-component/browser';
import { CustomToolbarLayout } from './mana-application';

export const startApp = () =>
  renderApp({
    modules: [
      ...CommonBrowserModules,
      TerminalEnvModule,
      TerminalBasicUsageModule,
      ComponentsSampleModule,
      AntdComponentsSampleModule,
      EditorTitleSampleModule,
      WelcomeContentSampleModule,
      TogglePanelSampleModule,
      CustomToolbarModule,
      BuitinServicesSampleModule,
      CustomEditorEmptyComponentModule,
      CustomMonacoEditorServicesSampleModule,
      CustomViewModule,
      CustomContextMenuModule,
    ],
    layoutConfig: {
      ...defaultConfig,
      ...{
        [SlotLocation.left]: {
          modules: [
            '@opensumi/ide-explorer',
            '@opensumi/ide-search',
            '@opensumi/ide-scm',
            '@opensumi/ide-extension-manager',
            '@opensumi/ide-debug',
            '@opensumi/libro-kernel-terminal',
          ],
        },
      },
      // ...{
      //   [SlotLocation.top]: {
      //     modules: ['@opensumi/ide-menu-bar', 'test-toolbar'],
      //   },
      // },
      // customAction: {
      //   modules: ['test-toolbar'],
      // },
    },
    useCdnIcon: false,
    useExperimentalShadowDom: false,
    defaultPreferences: {
      'general.theme': 'opensumi-dark',
      'general.icon': 'vscode-icons',
      'menubar.compactMode': true,
    },
    defaultPanels: {
      bottom: '@opensumi/ide-terminal-next',
      right: '',
    },
    // 引入 custom-toolbar 自定义视图时，需要自定义布局组件，可以基于 DefaultLayout 进行拓展
    layoutComponent: CustomToolbarLayout,
  });
