import '@opensumi/ide-i18n/lib/browser';
import { defaultConfig } from '@opensumi/ide-main-layout/lib/browser/default-config';
import { CommonBrowserModules } from './common-modules';
import { renderApp } from './render-app';

import { SlotLocation } from '@opensumi/ide-core-browser';
import { WelcomeContentSampleModule } from 'modules/add-welcome-content/browser';
import { ComponentsSampleModule } from 'modules/components/browser';
import { TodoListModule } from 'modules/connection/browser';
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
import { CustomToolbarLayout } from 'modules/custom-toolbar/browser/custom-layout';
import { CustomEditorEmptyComponentModule } from 'modules/editor-empty-component/browser';
// import { DefaultLayout } from '@opensumi/ide-core-browser/lib/components';
import { CustomViewModule } from 'modules/custom-view/browser';
import { CustomMonacoEditorServicesSampleModule } from 'modules/editor-monaco-component/browser';
import React, { useEffect } from 'react';

export const startApp = () =>
  renderApp({
    modules: [
      ...CommonBrowserModules,
      TodoListModule,
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
        [SlotLocation.top]: {
          modules: ['@opensumi/ide-menu-bar', 'test-toolbar'],
        },
      },
      customAction: {
        modules: ['test-toolbar'],
      },
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
    // layoutComponent: DefaultLayout,
    // 引入 custom-toolbar 自定义视图时，需要自定义布局组件，可以基于 DefaultLayout 进行拓展
    layoutComponent: CustomToolbarLayout,
  });

export const IDEApp: React.FC = () => {
  useEffect(() => {
    startApp();
  }, []);
  return <div id="main"></div>;
};

export default IDEApp;
