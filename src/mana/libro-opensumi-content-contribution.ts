import { ContentContribution } from '@difizen/libro-core';
import {
  IContentsModel,
  INotebookContent,
  LibroJupyterModel,
  NotebookOption,
} from '@difizen/libro-jupyter';
import { getOrigin, inject, singleton } from '@difizen/mana-app';
import { Injector } from '@opensumi/di';
import { URI } from '@opensumi/ide-core-common';
import { IFileServiceClient } from '@opensumi/ide-file-service';
import { message } from 'antd';
import { OpensumiInjector } from '../common';

@singleton({ contrib: ContentContribution })
export class LibroOpensumiContentContribution implements ContentContribution {
  @inject(OpensumiInjector) injector: Injector;

  canHandle = (options) => {
    return options.loadType === 'libro-opensumi-loader' ? 100 : 1;
  };
  async loadContent(options: NotebookOption, model: LibroJupyterModel) {
    const fileServiceClient: IFileServiceClient = getOrigin(
      this.injector.get(IFileServiceClient),
    );
    let notebookContent: INotebookContent;
    try {
      const { content } = await fileServiceClient.readFile(
        options.resource.toString(),
      );
      const stat = await fileServiceClient.getFileStat(
        options.resource.toString(),
      );
      const uri = new URI(options.resource.toString());
      notebookContent = JSON.parse(content.toString());
      const currentFileContents: IContentsModel = {
        name: uri.path.name,
        path: uri.path.toString(),
        last_modified: stat?.lastModification.toString() || new Date().toJSON(),
        created: stat?.createTime?.toString() || new Date().toJSON(),
        content: notebookContent,
        size: stat?.size,
        writable: true,
        type: 'notebook',
      };
      model.currentFileContents = currentFileContents;
      model.filePath = currentFileContents.path;
      model.lastModified = model.currentFileContents.last_modified;
      if (!model.quickEditMode && !model.readOnly) {
        model.startKernelConnection();
      }
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
