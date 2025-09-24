export interface Scrollable {
  el: HTMLElement;
  targetScrollTop: number;
  targetScrollLeft: number;
  animating: boolean;
  velocityX: number;
  velocityY: number;
  lastX: number;
  lastY: number;
  lastTimestamp: number;
  decelerating: boolean;
  enableMomentum: boolean;
}
