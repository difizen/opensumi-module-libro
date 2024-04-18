import * as React from 'react';

import { LibroView } from '@difizen/libro-jupyter';
import { ViewRender } from '@difizen/mana-app';
import { useInjectable } from '@opensumi/ide-core-browser';
import styles from './libro.module.less';
import { ILibroOpensumiService } from './libro.service';

export const OpensumiLibroView = (...params) => {
  const libroOpensumiService = useInjectable<ILibroOpensumiService>(
    ILibroOpensumiService,
  );
  const [libroView, setLibroView] = React.useState<LibroView | undefined>(
    undefined,
  );

  React.useEffect(() => {
    let autoSaveHandle: undefined | number = undefined;
    libroOpensumiService
      .getOrCreatLibroView(params[0].resource.uri)
      .then((libro) => {
        setLibroView(libro);
        libro.model.onChanged(() => {
          libroOpensumiService.updateDirtyStatus(params[0].resource.uri, true);
          autoSaveHandle = window.setTimeout(() => {
            libro.save();
            if (libro) {
              libro.model.dirty = false;
            }
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
    <div className={styles.libroView}>
      {libroView && <ViewRender view={libroView}></ViewRender>}
    </div>
  );
};
