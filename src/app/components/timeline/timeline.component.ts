import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { NgForOf } from '@angular/common';
import { StagesManagementService } from '../../services/stages-management.service';

@Component({
  selector: 'app-timeline',
    imports: [
        NgForOf
    ],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
    today: Date = new Date();
    days: { day: string; date: string }[] = [];

    @ViewChild('timelineContainer') timelineContainer!: ElementRef;
    @Input() highlightDay: number | null = null;
    @Input() startDate: Date | null = null;
    @Input() tripLength!: number;

    isDragging = false;
    startX = 0;
    scrollLeft = 0;

    constructor(
        protected stagesService: StagesManagementService) {}


    ngAfterViewInit() {
        setTimeout(() => {
            const highlightedElement = this.timelineContainer.nativeElement.querySelector('.highlight');
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }
        }, 100);
        this.generateTimeline();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['startDate'] || changes['tripLength']) {
            this.generateTimeline();
        }
    }

    generateTimeline() {
        this.days = Array.from({ length: this.tripLength }, (_, i) => {
            const date = new Date();
            date.setDate(this.today.getDate() + i);
            return {
                day: this.getWeekday(date.getDay()),
                date: `${date.getDate()} ${this.getMonthName(date.getMonth())}`,
            };
        });
    }

    getWeekday(dayIndex: number): string {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return weekdays[dayIndex];
    }

    getMonthName(monthIndex: number): string {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthIndex];
    }

    // 🔹 Scroll with Mouse Wheel
    onScroll(event: WheelEvent) {
        event.preventDefault();
        const scrollSpeedFactor = 0.3;
        this.timelineContainer.nativeElement.scrollLeft += event.deltaY * scrollSpeedFactor;
    }

    // 🔹 Dragging Logic
    onMouseDown(event: MouseEvent) {
        this.isDragging = true;
        this.startX = event.pageX;
        this.scrollLeft = this.timelineContainer.nativeElement.scrollLeft;

        // Listen globally to prevent abrupt stopping
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
    }

    onMouseMove = (event: MouseEvent) => {
        if (!this.isDragging) return;
        event.preventDefault();
        const x = event.pageX;
        const walk = (x - this.startX) * 1.5; // Adjust drag speed
        this.timelineContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
    };

    onMouseUp = () => {
        this.isDragging = false;

        // Remove global listeners to stop drag when mouse is released
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
    };

    onDayClick(index: number) {
        this.stagesService.selectDay(index + 1);
    }
}
