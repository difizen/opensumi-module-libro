import * as React from 'react';

import { LibroView } from '@difizen/libro-jupyter';
import { ViewRender } from '@difizen/mana-app';
import '@opensumi/antd-theme/lib/index.css';
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
    libroOpensumiService
      .getOrCreatLibroView(params[0].resource.uri)
      .then((libro) => {
        setLibroView(libro);
        libro.model.onChanged(() => {
          libroOpensumiService.updateDirtyStatus(params[0].resource.uri, true);
        });
        libro.onSave(() => {
          libroOpensumiService.updateDirtyStatus(params[0].resource.uri, false);
        });
      });
  }, []);
  return (
    <div className={styles.libroView}>
      {libroView && <ViewRender view={libroView}></ViewRender>}
    </div>
  );
};
