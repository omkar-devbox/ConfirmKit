// Internal system types (keep small)

export type Status = 'idle' | 'open' | 'loading' | 'closing';

export type KeyboardMap = Partial<
    Record<'confirm' | 'cancel' | 'next' | 'prev', string[]>
>;