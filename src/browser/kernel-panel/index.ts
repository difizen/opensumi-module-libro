import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { KernelPanelContribution } from './kernel.panel.contribution';
export * from './kernel.panel.color.tokens';

@Injectable()
export class KernelPanelModule extends BrowserModule {
  providers: Provider[] = [KernelPanelContribution];
}
