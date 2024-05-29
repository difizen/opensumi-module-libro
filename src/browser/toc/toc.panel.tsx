import { TOCView } from '@difizen/libro-toc';
import { Container, ViewManager, ViewRender } from '@difizen/mana-app';
import { URI, useInjectable, ViewState } from '@opensumi/ide-core-browser';
import { WorkbenchEditorService } from '@opensumi/ide-editor';
import { WorkbenchEditorServiceImpl } from '@opensumi/ide-editor/lib/browser/workbench-editor.service';
import { OutlinePanel } from '@opensumi/ide-outline/lib/browser/outline';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { ManaContainer } from '../../common';
import { LIBRO_COMPONENTS_SCHEME_ID } from '../libro.protocol';
import { ILibroOpensumiService } from '../libro.service';
import styles from './toc.module.less';

export const TocPanel = ({
  viewState,
}: PropsWithChildren<{ viewState: ViewState }>) => {
  const editorService = useInjectable<WorkbenchEditorServiceImpl>(
    WorkbenchEditorService,
  );
  const libroOpensumiService = useInjectable<ILibroOpensumiService>(
    ILibroOpensumiService,
  );
  const manaContainer = useInjectable<Container>(ManaContainer);

  const [libroTocView, setLibroTocView] = useState<TOCView | undefined>();

  useEffect(() => {
    editorService.onActiveResourceChange((e: any) => {
      if ((e.uri as URI).path.ext === `.${LIBRO_COMPONENTS_SCHEME_ID}`) {
        libroOpensumiService.getOrCreatLibroView(e.uri).then((libro) => {
          const viewManager = manaContainer.get(ViewManager);
          viewManager
            .getOrCreateView<TOCView>(TOCView, {
              id: (e.uri as URI).toString(),
            })
            .then((libroTocView) => {
              libroTocView.parent = libro;
              setLibroTocView(libroTocView);
              return;
            });
        });
      } else {
        setLibroTocView(undefined);
      }
    });
  });
  if (libroTocView) {
    return (
      <div className={styles.toc}>
        <ViewRender view={libroTocView}></ViewRender>
      </div>
    );
  } else {
    return <OutlinePanel viewState={viewState}></OutlinePanel>;
  }
};
