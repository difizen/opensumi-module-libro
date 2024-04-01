import {
  ApplicationContribution,
  inject,
  singleton,
  ThemeService,
} from '@difizen/mana-app';

@singleton({ contrib: ApplicationContribution })
export class LibroApp implements ApplicationContribution {
  protected readonly themeService: ThemeService;

  constructor(
    @inject(ThemeService)
    themeService: ThemeService,
  ) {
    this.themeService = themeService;
  }

  onStart = () => {
    this.themeService.setCurrentTheme('dark');
  };
}
