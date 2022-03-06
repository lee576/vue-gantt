import {
  dragEvents,
  dropEvents,
  gestureEvents,
  pointerEvents,
  resizeEvents
} from "@/events";
import { Interactable } from "@interactjs/types";

const bindEvents = (events: string[]) => (
  interact: Interactable,
  emit: Vue["$emit"]
): void => {
  events.forEach(eventName => {
    interact.on(eventName, (...args: unknown[]) => {
      emit(eventName, ...args);
    });
  });
};

export const bindPointerEvents = bindEvents(pointerEvents);
export const bindDragEvents = bindEvents(dragEvents);
export const bindDropEvents = bindEvents(dropEvents);
export const bindResizeEvents = bindEvents(resizeEvents);
export const bindGestureEvents = bindEvents(gestureEvents);
