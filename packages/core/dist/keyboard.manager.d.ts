export declare class KeyboardManager {
    private onAction?;
    private handleKeyDown;
    attach(onAction: (action: 'confirm' | 'cancel') => void): void;
    detach(): void;
}
