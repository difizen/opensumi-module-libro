import { LibroService } from '@difizen/libro-jupyter';
import { Container } from '@difizen/mana-app';
import { Autowired } from '@opensumi/di';
import { EDITOR_COMMANDS } from '@opensumi/ide-core-browser';
import {
  CommandContribution,
  CommandRegistry,
} from '@opensumi/ide-core-common/lib/command';
import { Domain } from '@opensumi/ide-core-common/lib/di-helper';
import { ManaContainer } from '../common';

@Domain(CommandContribution)
export class LibroCommandContribution implements CommandContribution {
  @Autowired(ManaContainer)
  private readonly manaContainer: Container;

  registerCommands(commands: CommandRegistry): void {
    commands.registerHandler(EDITOR_COMMANDS.SAVE_CURRENT.id, {
      execute: () => {
        const libroService = this.manaContainer.get(LibroService);
        const libro = libroService.active;
        libro?.save();
      },
      isEnabled: () => {
        const libroService = this.manaContainer.get(LibroService);
        if (libroService.focus) {
          return true;
        }
        return false;
      },
    });
  }
}
