import {
  ContentSaveContribution,
  LibroJupyterModel,
  NotebookOption,
  SaveFileErrorModal,
} from '@difizen/libro-jupyter';
import { inject, ModalService, singleton, URI } from '@difizen/mana-app';
import { IFileServiceClient } from '@opensumi/ide-file-service';
import { injector } from '../injector';

@singleton({ contrib: ContentSaveContribution })
export class LibroOpensumiContentSaveContribution
  implements ContentSaveContribution
{
  @inject(ModalService) protected readonly modalService: ModalService;

  canHandle = (options: NotebookOption) => {
    return options.loadType === 'libro-opensumi-loader' ? 100 : 1;
  };
  saveContent = async (options: NotebookOption, model: LibroJupyterModel) => {
    const uri = new URI(options.resource.toString());
    const fileServiceClient: IFileServiceClient =
      injector.get(IFileServiceClient);
    const stat = await fileServiceClient.getFileStat(
      options.resource.toString(),
    );
    try {
      const notebookContent = model.toJSON();
      if (!stat) throw new Error('Get file stat error!');
      fileServiceClient.setContent(stat, JSON.stringify(notebookContent));
    } catch (e: any) {
      model.fileService.fileSaveErrorEmitter.fire({
        cause: e.errorCause,
        msg: e.message,
        name: uri.path?.name || model.currentFileContents.name,
        path: uri?.path.toString() || model.currentFileContents.path,
        created:
          stat?.createTime?.toString() || model.currentFileContents.created,
        last_modified:
          stat?.lastModification.toString() ||
          model.currentFileContents.last_modified,
        size: stat?.size || model.currentFileContents.size,
        type: 'notebook' || model.currentFileContents.type,
      });
      this.modalService.openModal(SaveFileErrorModal);
      throw new Error('File Save Error', e);
    }
  };
}
