declare module 'html-to-image' {
  export function toPng(node: HTMLElement, options?: {}): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: {}): Promise<string>;
  export function toBlob(node: HTMLElement, options?: {}): Promise<Blob>;
  export function toSvg(node: HTMLElement, options?: {}): Promise<string>;
}
