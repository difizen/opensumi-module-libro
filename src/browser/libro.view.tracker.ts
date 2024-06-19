import { Injectable } from '@opensumi/di';
import { action, makeObservable, observable } from 'mobx';

@Injectable({ multiple: true })
export class LibroTracker {
  constructor() {
    makeObservable(this);
  }

  @observable
  refreshTimer: number = Date.now();

  @action
  refresh(refreshTimer: number) {
    this.refreshTimer = refreshTimer;
  }
}
