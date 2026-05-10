import type { EventPayload, OutboundEvent } from "./event-types";

export namespace AuthEvents {
  // Shared exchange — all auth events go here
  export const EXCHANGE = "auth.events" as const;

  // Each sub-namespace groups everything related to one event type
  export namespace UserRegistered {
    export const ROUTING_KEY = "auth.user.registered" as const;

    export interface Payload extends EventPayload {
      id: string;
      email: string;
      name: string;
      createdAt: string;
    }

    export type Event = OutboundEvent<typeof ROUTING_KEY, Payload>;
  }
}
