import type { ConfirmOptions, ConfirmContext } from '../types'

export interface QueueItem<
    C extends ConfirmContext = ConfirmContext,
    R = unknown,
    TVariant extends string = never
> {
    options: ConfirmOptions<C, R, TVariant>
    resolve: (value: R) => void
    reject: (error: unknown) => void
}

export function createQueue<
    C extends ConfirmContext = ConfirmContext,
    R = unknown,
    TVariant extends string = never
>(
    maxSize = 100
) {
    const queue: QueueItem<C, R, TVariant>[] = []

    return {
        enqueue: (item: QueueItem<C, R, TVariant>) => {
            if (queue.length >= maxSize) {
                item.reject(
                    new Error(`ConfirmQueue overflow (max: ${maxSize})`)
                )
                return
            }
            queue.push(item)
        },

        dequeue: () => queue.shift(),

        hasItems: () => queue.length > 0,

        clear: () => {
            while (queue.length) {
                const item = queue.shift()!
                item.reject(new Error('Queue cleared'))
            }
        },

        get length() {
            return queue.length
        }
    }
}

export type ConfirmQueueInstance<
    C extends ConfirmContext = ConfirmContext,
    R = unknown,
    TVariant extends string = never
> = ReturnType<typeof createQueue<C, R, TVariant>>