import type { CodeEditorFactory } from '@difizen/libro-code-editor';
import { CodeEditorContribution } from '@difizen/libro-code-editor';
import { MIME } from '@difizen/libro-common';
import { inject, singleton } from '@difizen/mana-app';

import {
  libroE2DefaultConfig,
  LibroOpensumiEditorFactory,
  stateFactory,
} from './opensumi-editor';

@singleton({ contrib: [CodeEditorContribution] })
export class LibroE2EditorContribution implements CodeEditorContribution {
  factory: CodeEditorFactory;

  stateFactory = stateFactory;

  defaultConfig = libroE2DefaultConfig;

  constructor(
    @inject(LibroOpensumiEditorFactory)
    libroOpensumiEditorFactory: LibroOpensumiEditorFactory,
  ) {
    this.factory = libroOpensumiEditorFactory;
  }

  // stateFactory: EditorStateFactory<any> = (options) => {
  //   return e2StateFactory(this.languageSpecRegistry)({
  //     uuid: options.uuid,
  //     model: options.model,
  //   });
  // };

  canHandle(mime: string): number {
    const mimes = [MIME.odpssql, MIME.python, MIME.prompt] as string[];
    if (mimes.includes(mime)) {
      return 50 + 2;
    }
    return 0;
  }
}
