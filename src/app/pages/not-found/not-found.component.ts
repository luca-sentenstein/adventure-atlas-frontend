import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-not-found',
    imports: [],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements AfterViewInit{
    @ViewChild("main") main!: ElementRef<HTMLElement>;

    ngAfterViewInit(): void {
        const mainRect = this.main.nativeElement.getBoundingClientRect();
        this.main.nativeElement.style.height = `calc(100vh - ${2 * mainRect.top}px)`;
    }
}
