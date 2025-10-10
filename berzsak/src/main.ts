import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideAnimations()
  ]
})
  .catch((err) => console.error(err));


// Prevent desktop zoom
window.addEventListener('wheel', (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, {passive: false});

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=')) {
    e.preventDefault();
  }
});

document.addEventListener('pointerdown', (e: PointerEvent) => {
  if (e.pointerType === 'touch' || e.pointerType === 'pen') {
    document.body.classList.add('no-hover');
  }
});

document.addEventListener('pointerup', () => {
  document.body.classList.remove('no-hover');
});
