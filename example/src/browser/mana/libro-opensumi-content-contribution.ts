import { ContentContribution } from '@difizen/libro-core';
import { singleton } from '@difizen/mana-app';

@singleton({ contrib: ContentContribution })
export class LibroOpensumiContentContribution implements ContentContribution {
  canHandle = (options) => {
    return options.loadType === 'libro-opensumi-loader' ? 100 : 1;
  };
  async loadContent() {
    const originContent = require('./test.json');
    return originContent;
  }
}
