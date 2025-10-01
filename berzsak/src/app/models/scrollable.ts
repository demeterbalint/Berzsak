export interface Scrollable {
  el: HTMLElement;
  target: number;
  current: number;
  isAnimating: boolean;
  onWheel: (e: WheelEvent) => void;
}
