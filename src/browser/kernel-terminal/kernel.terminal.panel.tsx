import { KernelAndTerminalPanelView } from '@difizen/libro-lab';
import { Container, ViewManager, ViewRender } from '@difizen/mana-app';
import { useInjectable, ViewState } from '@opensumi/ide-core-browser';
import React, { memo, PropsWithChildren, useEffect, useState } from 'react';
import { ManaContainer } from '../../common';

export const KernelTerminalPanel = memo(
  ({ viewState }: PropsWithChildren<{ viewState: ViewState }>) => {
    const collapsePanelContainerStyle = {
      width: viewState.width || '100%',
      height: viewState.height,
    };
    const manaContainer = useInjectable<Container>(ManaContainer);
    const [kernelView, setKernelView] = useState<KernelAndTerminalPanelView>();

    useEffect(() => {
      const viewManager = manaContainer.get(ViewManager);
      viewManager
        .getOrCreateView<KernelAndTerminalPanelView>(KernelAndTerminalPanelView)
        .then((kernelTerminalView) => {
          setKernelView(kernelTerminalView);
          return;
        });
    }, []);

    return (
      <div style={collapsePanelContainerStyle}>
        {kernelView && <ViewRender view={kernelView}></ViewRender>}
      </div>
    );
  },
);
