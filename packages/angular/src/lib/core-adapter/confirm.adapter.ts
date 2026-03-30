import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { confirmStore, ConfirmState, ConfirmContext } from '@confirmation-box/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreAdapter<T = any, C extends ConfirmContext = ConfirmContext> implements OnDestroy {
  private readonly stateSubject = new BehaviorSubject<ConfirmState<T, C>>(
    confirmStore.getState() as ConfirmState<T, C>
  );

  /**
   * Observable of the current confirmation state.
   */
  readonly state$: Observable<ConfirmState<T, C>> = this.stateSubject.asObservable();

  private unsubscribe: (() => void) | null = null;

  constructor(private ngZone: NgZone) {
    // Subscribe to core store and emit to RxJS within NgZone
    this.unsubscribe = confirmStore.subscribe((state: any) => {
      this.ngZone.run(() => {
        this.stateSubject.next(state as ConfirmState<T, C>);
      });
    });
  }

  /**
   * Get the current snapshot of the state.
   */
  get state(): ConfirmState<T, C> {
    return this.stateSubject.value;
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.stateSubject.complete();
  }
}
