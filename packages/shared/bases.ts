import type { EventType } from "shared/Types";

export class EventEmitter<T> {
    observers: Partial<
        Record<EventType, ((context: T, ...args: unknown[]) => void)[]>
    > = {};

    observe(
        eventTypes: EventType[] | EventType,
        callback: (context: T, ...args: unknown[]) => void
    ) {
        if (!Array.isArray(eventTypes)) eventTypes = [eventTypes];
        eventTypes.forEach((type) => {
            if (!this.observers[type]) {
                this.observers[type] = [];
            }
            this.observers[type]?.push(callback);
        });
        return () => this.unObserve(eventTypes, callback);
    }

    unObserve(
        eventTypes: EventType[] | EventType,
        callback: (context: T, ...args: unknown[]) => void
    ) {
        if (!Array.isArray(eventTypes)) eventTypes = [eventTypes];
        eventTypes.forEach((type) => {
            if (this.observers[type]) {
                this.observers[type] = this.observers[type]?.filter(
                    (c) => c !== callback
                );
            }
        });
    }

    notify(type: EventType, data: T, ...args: unknown[]) {
        this.observers[type]?.forEach((item) => {
            item.call(this, data, ...args);
        });
    }
}
