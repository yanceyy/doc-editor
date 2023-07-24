import type { EventType } from "shared/Types";

export class EventEmitter<T> {
    observers: Partial<Record<EventType, ((context: T) => void)[]>> = {};

    // TODO: Allow pass eventList string like 'hover|click'
    observe(
        eventTypes: EventType[] | EventType,
        callback: (context: T) => void
    ) {
        if (!Array.isArray(eventTypes)) eventTypes = [eventTypes];
        eventTypes.forEach((type) => {
            if (!this.observers[type]) {
                this.observers[type] = [];
            }
            this.observers[type]?.push(callback);
        });
    }

    unObserve(
        eventTypes: EventType[] | EventType,
        callback: (context: T) => void
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

    notify(type: EventType, data: T) {
        this.observers[type]?.forEach((item) => {
            item.call(this, data);
        });
    }
}
