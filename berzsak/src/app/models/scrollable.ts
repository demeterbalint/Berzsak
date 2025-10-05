export interface Scrollable {
  el: HTMLElement;
  targetTop: number;
  currentTop: number;
  targetLeft: number;
  currentLeft: number;
  isAnimating: boolean;
  onWheel: (e: WheelEvent) => void;
}
