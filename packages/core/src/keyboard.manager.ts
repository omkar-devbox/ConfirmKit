export class KeyboardManager {
  private onAction?: (action: 'confirm' | 'cancel') => void;

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.onAction) return;
    
    // Abstracting raw DOM events into framework-agnostic actions
    if (event.key === 'Escape') {
      event.preventDefault();
      this.onAction('cancel');
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.onAction('confirm');
    }
  };

  public attach(onAction: (action: 'confirm' | 'cancel') => void): void {
    this.onAction = onAction;
    // Binding at document level ensures we catch the event before other handlers swallow it
    document.addEventListener('keydown', this.handleKeyDown, { capture: true });
  }

  public detach(): void {
    document.removeEventListener('keydown', this.handleKeyDown, { capture: true });
    this.onAction = undefined;
  }
}
