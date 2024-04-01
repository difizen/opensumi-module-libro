import { ContentContribution } from '@difizen/libro-core';
import { INotebookContent, NotebookOption } from '@difizen/libro-jupyter';
import { singleton } from '@difizen/mana-app';
import { IFileServiceClient } from '@opensumi/ide-file-service';
import { message } from 'antd';
import { injector } from '../injector';

@singleton({ contrib: ContentContribution })
export class LibroOpensumiContentContribution implements ContentContribution {
  canHandle = (options) => {
    return options.loadType === 'libro-opensumi-loader' ? 100 : 1;
  };
  async loadContent(options: NotebookOption) {
    const fileServiceClient: IFileServiceClient =
      injector.get(IFileServiceClient);
    let notebookContent: INotebookContent;
    try {
      const { content } = await fileServiceClient.readFile(
        options.resource.toString(),
      );
      notebookContent = JSON.parse(content.toString());
    } catch (e) {
      message.error('File Read Error');
      notebookContent = {
        cells: [],
        metadata: {},
        nbformat: 4,
        nbformat_minor: 5,
      };
    }
    return notebookContent;
  }
}
