import { ConfirmButton, ActionContext } from '../types/button.types';
import { EventBus } from '../events/event.bus';
import { ConfirmContext } from '../types/context.types';
/**
 * Manages the execution flow of button actions, including lifecycle hooks.
 * Ensures consistent event emission and error handling.
 */
export declare class HandlerManager<T = any, C extends ConfirmContext = ConfirmContext> {
    private bus;
    private executing;
    constructor(bus?: EventBus);
    /**
     * Executes a button's action lifecycle: beforeAction -> action -> afterAction.
     * Emits success/error events to the event bus.
     */
    execute(button: ConfirmButton<T, C>, ctx: ActionContext<T, C>): Promise<void>;
}
/** Global singleton handler manager instance */
export declare const handlerManager: HandlerManager<any, ConfirmContext>;
