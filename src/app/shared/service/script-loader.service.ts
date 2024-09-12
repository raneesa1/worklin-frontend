import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  loadScript(url: string, callback?: () => void) {
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
      if (callback) {
        callback();
      }
      return;
    }

    const script = this.renderer.createElement('script');
    script.src = url;
    script.type = 'module';
    script.onload = () => {
      console.log(`Script loaded: ${url}`);
      if (callback) {
        // Added timeout to ensure script initialization
        setTimeout(callback, 1000);
      }
    };
    script.onerror = (error:any) => {
      console.error(`Script failed to load: ${url}`, error);
    };
    this.renderer.appendChild(document.body, script);
  }

  loadStyle(url: string) {
    const existingStyle = document.querySelector(`link[href="${url}"]`);
    if (existingStyle) {
      return;
    }

    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    this.renderer.appendChild(document.head, link);
  }
}
