import * as React from 'react';

import { DocumentCommands, LibroView } from '@difizen/libro-jupyter';
import { CommandRegistry, Container, ViewRender } from '@difizen/mana-app';
import { URI, useInjectable } from '@opensumi/ide-core-browser';
import { ManaContainer } from '../common';
import styles from './libro.module.less';
import { ILibroOpensumiService } from './libro.service';

export const OpensumiLibroView = (...params) => {
  const libroOpensumiService = useInjectable<ILibroOpensumiService>(
    ILibroOpensumiService,
  );
  const manaContainer = useInjectable<Container>(ManaContainer);
  const commandRegistry = manaContainer.get(CommandRegistry);
  const [refresh, setRefresh] = React.useState<number>(Date.now());

  const [libroView, setLibroView] = React.useState<LibroView | undefined>(
    undefined,
  );

  React.useEffect(() => {
    let autoSaveHandle: undefined | number = undefined;
    libroOpensumiService
      .getOrCreatLibroView(params[0].resource.uri)
      .then((libro) => {
        setLibroView(libro);
        if (
          libroOpensumiService.libroRefreshMap.has(
            (params[0].resource.uri as URI).toString(),
          )
        ) {
          setRefresh(Date.now());
          libroOpensumiService.libroRefreshMap.delete(
            (params[0].resource.uri as URI).toString(),
          );
        }
        libro.model.onChanged(() => {
          libroOpensumiService.updateDirtyStatus(params[0].resource.uri, true);
          autoSaveHandle = window.setTimeout(() => {
            commandRegistry
              .executeCommand(
                DocumentCommands.Save.id,
                undefined,
                libro,
                undefined,
                { reason: 'autoSave' },
              )
              .then(() => {
                if (libro) {
                  libro.model.dirty = false;
                }
              });
          }, 1000);
        });
        libro.onSave(() => {
          libroOpensumiService.updateDirtyStatus(params[0].resource.uri, false);
        });
      });
    return () => {
      window.clearTimeout(autoSaveHandle);
    };
  }, []);
  return (
    <div className={styles.libroView} key={refresh}>
      {libroView && <ViewRender view={libroView}></ViewRender>}
    </div>
  );
};
