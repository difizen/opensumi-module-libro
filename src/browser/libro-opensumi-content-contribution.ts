import type { NotebookModel, NotebookOption } from '@difizen/libro-core';
import { ContentContribution } from '@difizen/libro-core';
import { URI } from '@difizen/mana-app';
import { singleton } from '@difizen/mana-app';

@singleton({ contrib: ContentContribution })
export class LibroOpensumiContentContribution implements ContentContribution {
    canHandle = (options) => {
        return options.loadType === 'libro-opensumi-loader' ? 100: 1;  
    };
    async loadContent(options: NotebookOption, model: NotebookModel) {
        const originContent = require('./test.json');
        return originContent;
    }
}
