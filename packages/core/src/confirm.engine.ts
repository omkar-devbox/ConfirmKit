import { ConfirmOptions, ConfirmState } from './types';

export class ConfirmEngine {
  private queue: ConfirmState[] = [];
  private current: ConfirmState | null = null;
  private listeners: Set<(state: ConfirmState | null) => void> = new Set();

  /**
   * Main Promise-based API for handling confirmation flows sequentially.
   */
  public confirm<TData = any, TContext = any>(options: ConfirmOptions<TData, TContext>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const state: ConfirmState<TData, TContext> = {
        id: Math.random().toString(36).substring(2, 10),
        isOpen: true,
        ...options,
        resolve: (value: boolean) => {
          resolve(value);
          this.closeCurrent();
        },
        reject: (reason?: any) => {
          reject(reason);
          this.closeCurrent();
        }
      };

      this.queue.push(state);
      this.processQueue();
    });
  }

  private processQueue(): void {
    if (this.current || this.queue.length === 0) return;
    this.current = this.queue.shift() || null;
    this.notify();
  }

  private closeCurrent(): void {
    this.current = null;
    this.processQueue();
    this.notify();
  }

  // Observable-like subscription for the UI layer to react to changes
  public subscribe(listener: (state: ConfirmState | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.current);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.current));
  }
}
