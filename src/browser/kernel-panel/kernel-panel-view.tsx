import { LibroKernelManager, LibroSessionManager } from '@difizen/libro-kernel';
import { Container } from '@difizen/mana-app';
import { useEffect, useState } from 'react';

import { useInjectable } from '@opensumi/ide-core-browser';
import { WorkbenchEditorService } from '@opensumi/ide-editor';
import { WorkbenchEditorServiceImpl } from '@opensumi/ide-editor/lib/browser/workbench-editor.service';
import React from 'react';
import { ManaContainer } from '../../common';
import { LibroCollapse } from './collapse';
import './index.less';
import {
  LibroPanelCollapseItemType,
  LibroPanelCollapseKernelItem,
} from './kernel.panel.protocol';

export const KernelPanel: React.FC = () => {
  const editorService = useInjectable<WorkbenchEditorServiceImpl>(
    WorkbenchEditorService,
  );
  const manaContainer = useInjectable<Container>(ManaContainer);

  const libroKernelManager = manaContainer.get(LibroKernelManager);

  const libroSessionManager = manaContainer.get(LibroSessionManager);

  const openedUris = editorService.getAllOpenedUris();

  const [refresh, setRefresh] = useState(new Date().toUTCString());

  const [kernelItems, setKernelItems] = useState<
    LibroPanelCollapseKernelItem[] | undefined
  >();

  const handleRefresh = () => {
    setRefresh(new Date().toUTCString());
  };

  useEffect(() => {
    if (
      !libroSessionManager.running ||
      (libroSessionManager.running && libroSessionManager.running.size === 0)
    ) {
      setKernelItems(undefined);
      return;
    }

    // kernelId -> item
    const items = new Map<string, LibroPanelCollapseKernelItem>();

    const runningSessions = libroSessionManager.running.values();

    for (const session of runningSessions) {
      const kernel = session.kernel!;
      if (items.has(kernel.id)) {
        items.get(kernel.id)?.notebooks.push({
          sessionId: session.id,
          name: session.name,
          path: session.path,
        });
      } else {
        items.set(kernel.id, {
          id: kernel.id,
          name: kernel.name,
          shutdown: async () => await libroKernelManager.shutdown(kernel.id),
          notebooks: [
            { sessionId: session.id, name: session.name, path: session.path },
          ],
        });
      }
    }

    setKernelItems(Array.from(items.values()));
  }, [libroKernelManager, libroSessionManager.running]);

  return (
    <div className="kernel-and-panel" key={refresh}>
      <LibroCollapse
        type={LibroPanelCollapseItemType.PAGE}
        refresh={handleRefresh}
        items={openedUris.map((item) => {
          return {
            id: item.toString(),
            name: item.displayName as string,
          };
        })}
        shutdownAll={async () => {
          editorService.closeAllOnlyConfirmOnce();
        }}
      />
      <LibroCollapse
        type={LibroPanelCollapseItemType.KERNEL}
        refresh={handleRefresh}
        items={kernelItems}
        shutdownAll={async () => {
          await libroKernelManager.shutdownAll();
          await libroSessionManager.refreshRunning();
        }}
      />
    </div>
  );
};
