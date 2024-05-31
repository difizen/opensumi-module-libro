import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { KernelTerminalContribution } from './kernel.terminal.contribution';

@Injectable()
export class KernelTerminalModule extends BrowserModule {
  providers: Provider[] = [KernelTerminalContribution];
}
