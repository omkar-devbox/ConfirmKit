import { InjectionToken, Type } from '@angular/core';

/**
 * Injection token for user-provided global UI component.
 */
export const CONFIRM_UI = new InjectionToken<Type<any>>('CONFIRM_UI');

/**
 * Injection token for fallback UI component (MANDATORY).
 */
export const DEFAULT_CONFIRM_UI = new InjectionToken<Type<any>>('DEFAULT_CONFIRM_UI');
