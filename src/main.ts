import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));

document.addEventListener('DOMContentLoaded', () => {
    const interactiveBubble = document.querySelector('.interactive') as HTMLElement | null;
    if (!interactiveBubble) return;

    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

    function moveBubble() {
        if (interactiveBubble) {
            curX += (mouseX - curX) / 10;
            curY += (mouseY - curY) / 10;
            interactiveBubble.style.transform = `translate(${curX}px, ${curY}px)`;
        }
        requestAnimationFrame(moveBubble);
    }

    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    moveBubble();
});
