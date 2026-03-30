import { ConfirmUIConfig as CoreUIConfig } from '@confirmation-box/core';

export type ConfirmButtonRole = 'confirm' | 'cancel' | string;
export type ConfirmStyleMap = Record<string, string>;

export interface ConfirmUIConfig extends CoreUIConfig {
  className?: string;

  headerClass?: string;
  bodyClass?: string;
  footerClass?: string;

  buttonClass?: string;

  buttonClasses?: Partial<Record<ConfirmButtonRole, string>>;

  styles?: {
    container?: ConfirmStyleMap;
    header?: ConfirmStyleMap;
    body?: ConfirmStyleMap;
    footer?: ConfirmStyleMap;
    button?: ConfirmStyleMap;
  };

  variant?: 'modern' | 'minimal' | 'danger' | 'custom' | (string & {});
}

/**
 * ✅ FIX: styles added
 */
export const DEFAULT_UI: Required<Pick<
  ConfirmUIConfig,
  | 'className'
  | 'headerClass'
  | 'bodyClass'
  | 'footerClass'
  | 'buttonClass'
  | 'buttonClasses'
  | 'variant'
>> & {
  styles: NonNullable<ConfirmUIConfig['styles']>;
} = {
  className: 'cb-container',
  headerClass: 'cb-header',
  bodyClass: 'cb-body',
  footerClass: 'cb-footer',
  buttonClass: 'cb-btn',

  buttonClasses: {
    confirm: 'cb-btn-primary',
    cancel: 'cb-btn-secondary'
  },

  variant: 'modern',

  // ✅ important
  styles: {
    container: {},
    header: {},
    body: {},
    footer: {},
    button: {}
  }
};