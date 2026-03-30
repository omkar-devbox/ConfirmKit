import { Injectable, OnDestroy } from '@angular/core';
import { ConfirmEngine, ConfirmOptions, ConfirmState, KeyboardManager } from '@confirmation-box/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfirmService implements OnDestroy {
  private engine = new ConfirmEngine();
  private keyboardManager = new KeyboardManager();
  
  private stateSubject = new BehaviorSubject<ConfirmState | null>(null);
  public state$: Observable<ConfirmState | null> = this.stateSubject.asObservable();

  constructor() {
    this.engine.subscribe((state) => {
      this.stateSubject.next(state);
      
      if (state) {
        this.keyboardManager.attach((action) => {
          if (action === 'confirm') state.resolve(true);
          else state.resolve(false);
        });
      } else {
        this.keyboardManager.detach();
      }
    });
  }

  /**
   * Exposes structural typing via generic parameters for strong inference.
   */
  public confirm<TData = any, TContext = any>(options: ConfirmOptions<TData, TContext>): Promise<boolean> {
    return this.engine.confirm(options);
  }

  ngOnDestroy(): void {
    this.keyboardManager.detach();
  }
}
