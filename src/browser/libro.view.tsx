import * as React from 'react';

import '@opensumi/antd-theme/lib/index.css';
import { useInjectable } from '@opensumi/ide-core-browser';
import { ILibroOpensumiService } from './libro.service';
import { ViewRender } from '@difizen/mana-app';
import { LibroView } from '@difizen/libro-jupyter';

export const OpensumiLibroView = (...params) => {
  console.log("🚀 ~ OpensumiLibroView ~ params:", params)
  const libroOpensumiService = useInjectable<ILibroOpensumiService>(ILibroOpensumiService);
  const [libroView,setLibroView] = React.useState<LibroView|undefined>(undefined)

  React.useEffect(()=>{
    libroOpensumiService.getOrCreatLibroView(params[0].resource.uri)
  },[])
  return (
    <div >
        {libroView&&<ViewRender view={libroView}></ViewRender>}
    </div>
  );
};
