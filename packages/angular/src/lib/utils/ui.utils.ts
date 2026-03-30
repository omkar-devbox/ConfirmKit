import { ConfirmUIConfig, DEFAULT_UI } from '../models/confirm-ui.model';

/**
 * Deep merge utility for style objects
 */
function mergeStyles(
  base?: ConfirmUIConfig['styles'],
  override?: ConfirmUIConfig['styles']
): ConfirmUIConfig['styles'] {
  if (!base && !override) return undefined;

  return {
    container: {
      ...(base?.container ?? {}),
      ...(override?.container ?? {})
    },
    header: {
      ...(base?.header ?? {}),
      ...(override?.header ?? {})
    },
    body: {
      ...(base?.body ?? {}),
      ...(override?.body ?? {})
    },
    footer: {
      ...(base?.footer ?? {}),
      ...(override?.footer ?? {})
    },
    button: {
      ...(base?.button ?? {}),
      ...(override?.button ?? {})
    }
  };
}

/**
 * Merges UI configurations with priority:
 * 1. Local options (highest priority)
 * 2. Global config
 * 3. Default UI (fallback)
 */
export function mergeUIConfigs(
  global?: ConfirmUIConfig,
  local?: ConfirmUIConfig
): ConfirmUIConfig {
  // Step 1: shallow merge (base structure)
  const merged: ConfirmUIConfig = {
    ...DEFAULT_UI,
    ...(global ?? {}),
    ...(local ?? {})
  };

  // Step 2: deep merge buttonClasses
  merged.buttonClasses = {
    ...DEFAULT_UI.buttonClasses,
    ...(global?.buttonClasses ?? {}),
    ...(local?.buttonClasses ?? {})
  };

  // Step 3: deep merge styles (nested safe merge)
  merged.styles = mergeStyles(
    mergeStyles(DEFAULT_UI.styles, global?.styles),
    local?.styles
  );

  return merged;
}