import { Button } from '@opensumi/ide-components';
import { useInjectable } from '@opensumi/ide-core-browser';
import { IMainLayoutService } from '@opensumi/ide-main-layout';
import * as React from 'react';

export const TestToolbar = () => {
  const layoutService = useInjectable<IMainLayoutService>(IMainLayoutService);
  const bottomTabbarService = layoutService.getTabbarService('bottom');
  const rightTabbarService = layoutService.getTabbarService('right');
  const leftTabbarService = layoutService.getTabbarService('left');

  const [buttonHighlight, setButtonState] = React.useState<
    Record<'editor' | 'bottom' | 'right', boolean>
  >({
    editor: true,
    bottom: false,
    right: true,
  });

  React.useEffect(() => {
    bottomTabbarService.currentContainerId == '';
    const disposable1 = bottomTabbarService.onCurrentChange(() => {
      setButtonState({
        ...buttonHighlight,
        bottom: !!bottomTabbarService.currentContainerId,
      });
    });

    return () => {
      disposable1.dispose();
    };
  });

  return (
    <div
      style={{
        lineHeight: '35px',
        flex: 1,
        padding: '0 20px',
        textAlign: 'center',
        backgroundColor: 'var(--kt-menubar-background)',
      }}
    >
      {['editor', 'bottom', 'right'].map((position) => {
        const isActive = buttonHighlight[position];

        return (
          <Button
            key={position}
            type={isActive ? 'primary' : 'secondary'}
            style={{ margin: '0 5px' }}
            onClick={() => {
              const nextButtonState = !isActive;
              const newState = {
                ...buttonHighlight,
                [position]: nextButtonState,
              };

              if (position === 'right') {
                rightTabbarService.updatePanelVisibility(nextButtonState);
                if (nextButtonState) {
                  layoutService
                    .getTabbarHandler(
                      rightTabbarService.currentContainerId ||
                        'opensumi-preview-container',
                    )
                    ?.activate();
                  layoutService
                    .getTabbarHandler(
                      rightTabbarService.currentContainerId ||
                        'opensumi-preview-container',
                    )
                    ?.show();
                  layoutService.expandBottom(false);
                }
              } else if (position === 'bottom') {
                // When editor is active, user click bottom button can only show and hide specific tab container(not expand bottom)
                const bottomContainer = layoutService.getTabbarHandler(
                  bottomTabbarService.currentContainerId ||
                    'opensumi-devtools-container',
                );

                if (buttonHighlight.editor) {
                  layoutService.expandBottom(false);

                  if (nextButtonState) {
                    bottomTabbarService.updatePanelVisibility(true);
                    bottomContainer?.activate();
                    bottomContainer?.show();
                  } else {
                    bottomContainer?.deactivate();
                  }
                } else {
                  // when editor is not active, user want hide bottom, we need show editor first
                  if (nextButtonState) {
                    layoutService.expandBottom(true);

                    bottomTabbarService.updatePanelVisibility(true);
                    bottomContainer?.activate();
                    bottomContainer?.show();
                  } else {
                    layoutService.expandBottom(false);
                    leftTabbarService.updatePanelVisibility(true);
                    newState.editor = true;
                    bottomContainer?.deactivate();
                  }
                }
              } else if (position === 'editor') {
                // When editor is active, only hide container
                const bottomContainer = layoutService.getTabbarHandler(
                  bottomTabbarService.currentContainerId ||
                    'opensumi-devtools-container',
                );
                if (nextButtonState) {
                  // if bottom is active and expand, hide bottom
                  if (buttonHighlight.bottom) {
                    if (layoutService.bottomExpanded) {
                      layoutService.expandBottom(false);
                    }
                  }
                  leftTabbarService.updatePanelVisibility(true);
                } else {
                  // disable editor, show bottom
                  leftTabbarService.updatePanelVisibility(false);

                  newState.bottom = true;
                  bottomTabbarService.updatePanelVisibility(true);
                  bottomContainer?.activate();
                  bottomContainer?.show();
                  layoutService.expandBottom(true);
                }
              }

              setButtonState(newState);
            }}
          >
            {position}
          </Button>
        );
      })}
    </div>
  );
};
