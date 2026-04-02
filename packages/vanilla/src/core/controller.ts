import { createController } from '@confirmkit/core/engine/confirm.controller';
import { createState } from '@confirmkit/core/engine/confirm.state';
import { createQueue } from '@confirmkit/core/engine/confirm.queue';
import { createRenderer } from '@confirmkit/core/dom/renderer';
import { createScrollLock } from '@confirmkit/core/a11y/scroll-lock';
import { createFocusRestorer } from '@confirmkit/core/a11y/focus-restore';
import { createFocusTrap } from '@confirmkit/core/a11y/focus-trap';
import { createKeyboardHandler } from '@confirmkit/core/a11y/keyboard';

import { createPortal } from '../dom/portal';
import { createVanillaRenderer } from '../dom/renderer';

import { ConfirmContext } from '@confirmkit/core';

/**
 * Wires the core components for the vanilla adapter.
 * Uses shared instances to support the queue across multiple confirm calls.
 */
const state = createState<ConfirmContext, boolean>();
const queue = createQueue<ConfirmContext, boolean>();
const portal = createPortal();
const renderer = createRenderer(portal);
const scrollLock = createScrollLock();
const focusRestorer = createFocusRestorer();
const focusTrap = createFocusTrap();
const keyboard = createKeyboardHandler();

export const controller = createController<ConfirmContext, boolean>({
    state,
    queue,
    renderer,
    scrollLock,
    focusRestorer,
    focusTrap,
    keyboard,
    portal
});

/**
 * Initialize the renderer with the vanilla adapter.
 */
renderer.setAdapter(createVanillaRenderer({
    getState: state.getState,
    confirmAction: controller.confirmAction,
    cancelAction: controller.cancelAction
}));
