import {
  CellView,
  LibroJupyterView,
  LibroService,
  LibroView,
  MIME,
} from '@difizen/libro-jupyter';
import { Container, getOrigin } from '@difizen/mana-app';
import { Autowired, Injectable } from '@opensumi/di';
import { Uri } from '@opensumi/ide-core-common';
import {
  CellKind,
  INotebookModelAddedData,
  NotebookCellDto,
  NotebookCellsChangeType,
  NotebookRawContentEventDto,
} from '@opensumi/ide-editor';
import { NotebookService } from '@opensumi/ide-editor/lib/browser/notebook.service';
import { ManaContainer } from '../common';

@Injectable()
export class NotebookServiceOverride extends NotebookService {
  @Autowired(ManaContainer)
  private readonly manaContainer: Container;

  constructor() {
    super();

    this.listenLibro();
  }

  isValidNotebook(view: LibroView): boolean {
    if (view instanceof LibroJupyterView) {
      return true;
    }
    return false;
  }

  isCodeCell(mime: string) {
    return ([MIME.odpssql, MIME.python] as string[]).includes(mime);
  }

  asNotebookCell(cell: CellView): NotebookCellDto {
    return {
      cellKind: this.isCodeCell(cell.model.mimeType)
        ? CellKind.Code
        : CellKind.Markup,
      eol: '',
      handle: 1,
      language: 'python',
      mime: cell.model.mimeType,
      outputs: [],
      source: [cell.model.source],
      uri: Uri.from({
        scheme: 'vscode-notebook-cell',
        path:
          cell.parent instanceof LibroJupyterView
            ? cell.parent.model.filePath
            : cell.parent.id,
        query: `cellid=${cell.model.id}`,
      }),
    };
  }

  getNotebookUri(notebook: LibroJupyterView) {
    return Uri.parse(notebook.model.filePath);
  }

  asNotebook(notebook: LibroJupyterView): INotebookModelAddedData {
    return {
      uri: this.getNotebookUri(notebook),
      viewType: 'jupyter-notebook',
      versionId: 1,
      cells: notebook.model.cells.map((item) => this.asNotebookCell(item)),
    };
  }

  listenLibro() {
    const libroService = this.manaContainer.get(LibroService);
    libroService.onNotebookViewCreated((libroView) => {
      if (this.isValidNotebook(libroView)) {
        return;
      }
      this._onDidOpenNotebookDocument.fire(
        this.asNotebook(libroView as LibroJupyterView),
      );
    });
    libroService.onNotebookViewClosed((libroView) => {
      if (this.isValidNotebook(libroView)) {
        return;
      }
      this._onDidCloseNotebookDocument.fire(
        this.getNotebookUri(libroView as LibroJupyterView),
      );
    });
    libroService.onNotebookViewSaved((libroView) => {
      if (this.isValidNotebook(libroView)) {
        return;
      }
      this._onDidSaveNotebookDocument.fire(
        this.getNotebookUri(libroView as LibroJupyterView),
      );
    });
    libroService.onNotebookViewChanged((event) => {
      if (this.isValidNotebook(event.libroView)) {
        return;
      }

      const events: NotebookRawContentEventDto[] = [];

      if (event.contentChanges) {
        event.contentChanges.forEach((item) => {
          if (item.addedCells.length > 0) {
            events.push({
              kind: NotebookCellsChangeType.ModelChange,
              changes: [
                [
                  item.range.start,
                  0,
                  item.addedCells.map((cell) => this.asNotebookCell(cell)),
                ],
              ],
            });
          }
          if (item.removedCells.length > 0) {
            events.push({
              kind: NotebookCellsChangeType.ModelChange,
              changes: [
                [item.range.start, item.range.end - item.range.start, []],
              ],
            });
          }
        });
      }

      this._onDidChangeNotebookDocument.fire({
        uri: this.getNotebookUri(event.libroView as LibroJupyterView),
        events: {
          rawEvents: events,
          versionId: 1,
        },
        isDirty: getOrigin(event.libroView.model.dirty),
      });
    });
  }
}
