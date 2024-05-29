import { Container } from '@difizen/mana-app';
import { Autowired, Injectable } from '@opensumi/di';
// import { TOCView } from '@difizen/libro-toc';
import { TOCView } from '@difizen/libro-toc';
import { SlotLocation } from '@opensumi/ide-core-browser';
import { IMainLayoutService } from '@opensumi/ide-main-layout';
import { ManaContainer } from '../../common';

export const ILibroTocService = Symbol('ILibroTocService');

// eslint-disable-next-line @typescript-eslint/no-redeclare
export interface ILibroTocService {
  manaContainer: Container;
}

// @singleton()
@Injectable()
export class LibroTocService {
  @Autowired(ManaContainer)
  private readonly manaContainer: Container;

  activeLibroTocView: TOCView | undefined;

  @Autowired(IMainLayoutService)
  protected readonly mainlayoutService: IMainLayoutService;

  constructor() {
    console.log(
      '🚀 ~ LibroTocService ~ constructor ~ SlotLocation.main:',
      SlotLocation.main,
    );
    const handler = this.mainlayoutService.getTabbarHandler(SlotLocation.main);
    console.log('🚀 ~ LibroTocService ~ constructor ~ handler:', handler);
  }
}
