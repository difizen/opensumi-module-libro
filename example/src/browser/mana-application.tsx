import {
  GlobalContainer,
  ManaAppPreset,
  ManaComponents,
} from '@difizen/mana-app';
// import { LibroJupyterModule } from '@difizen/libro-jupyter';
import { LibroJupyterModule } from '@difizen/libro-jupyter';
import { SlotRenderer } from '@opensumi/ide-core-browser';
import {
  BoxPanel,
  getStorageValue,
  SplitPanel,
} from '@opensumi/ide-core-browser/lib/components';
// import { LibroOpensumiModule } from '@difizen/opensumi-module-libro/browser/mana-module';
import { LibroModule } from '@difizen/libro-core';

export function CustomToolbarLayout() {
  console.log('LibroJupyterModule', LibroJupyterModule);

  const { colors, layout } = getStorageValue();
  return (
    <BoxPanel direction="top-to-bottom">
      <ManaComponents.Application
        context={{ container: GlobalContainer }}
        modules={[ManaAppPreset, LibroModule]}
        renderChildren
      />
      <SlotRenderer
        backgroundColor={colors.menuBarBackground}
        defaultSize={0}
        slot="top"
        z-index={2}
      />
      {/* 追加 custom-action 插槽 */}
      <SlotRenderer
        color={colors.menuBarBackground}
        defaultSize={35}
        slot="customAction"
      />
      <SplitPanel id="main-horizontal" flex={1}>
        <SlotRenderer
          backgroundColor={colors.sideBarBackground}
          slot="left"
          isTabbar={true}
          defaultSize={layout.left?.currentId ? layout.left?.size || 310 : 49}
          minResize={204}
          minSize={49}
        />
        <SplitPanel
          id="main-vertical"
          minResize={300}
          flexGrow={1}
          direction="top-to-bottom"
        >
          <SlotRenderer
            backgroundColor={colors.editorBackground}
            flex={2}
            flexGrow={1}
            minResize={200}
            slot="main"
          />
          <SlotRenderer
            backgroundColor={colors.panelBackground}
            flex={1}
            defaultSize={layout.bottom?.size}
            minResize={160}
            slot="bottom"
            isTabbar={true}
          />
        </SplitPanel>
        <SlotRenderer
          backgroundColor={colors.sideBarBackground}
          slot="right"
          isTabbar={true}
          defaultSize={layout.right?.currentId ? layout.right?.size || 310 : 0}
          minResize={200}
          minSize={0}
        />
      </SplitPanel>
      <SlotRenderer
        backgroundColor={colors.statusBarBackground}
        defaultSize={24}
        slot="statusBar"
      />
    </BoxPanel>
  );
}
