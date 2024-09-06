import {
  CodeEditorContribution,
  CodeEditorFactory,
  LanguageSpecRegistry,
} from '@difizen/libro-code-editor';
import { inject, singleton } from '@difizen/mana-app';
import { Injector } from '@opensumi/di';
import { OpensumiInjector } from '../../common';

import { EditorStateFactory } from '@difizen/libro-jupyter';
import {
  libroE2DefaultConfig,
  LibroOpensumiEditorFactory,
  OpensumiEditorState,
  stateFactory,
} from './opensumi-editor';

@singleton({ contrib: [CodeEditorContribution] })
export class LibroE2EditorContribution implements CodeEditorContribution {
  @inject(LanguageSpecRegistry)
  protected readonly languageSpecRegistry: LanguageSpecRegistry;

  factory: CodeEditorFactory;

  stateFactory: EditorStateFactory<OpensumiEditorState>;

  defaultConfig = libroE2DefaultConfig;

  constructor(
    @inject(LibroOpensumiEditorFactory)
    libroOpensumiEditorFactory: LibroOpensumiEditorFactory,
    @inject(OpensumiInjector) injector: Injector,
  ) {
    this.factory = libroOpensumiEditorFactory;
    this.stateFactory = stateFactory(injector);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canHandle(mime: string): number {
    // 代码编辑都使用opensumi编辑器
    return 50 + 2;
  }
}
