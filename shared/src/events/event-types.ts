export type EventPayload = Record<string, unknown>;

export interface EventMetadata {
  correlationId?: string;
  causationId?: string;
  version?: number;
}

type BaseEvent<TType extends string, TPayload extends EventPayload> = {
  type: TType;
  payload: TPayload;
  occuredAt: string;
};

export interface OutboundEvent<
  TType extends string,
  TPayload extends EventPayload,
> extends BaseEvent<TType, TPayload> {
  metadat?: EventMetadata;
}

export interface InboundEvent<
  TType extends string,
  TPayload extends EventPayload,
> extends BaseEvent<TType, TPayload> {
  metadat?: EventMetadata;
}
