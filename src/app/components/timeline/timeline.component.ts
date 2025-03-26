import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
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
export class TimelineComponent implements OnChanges, AfterViewInit{
    days: { day: string; date: string }[] = [];

    @ViewChild('timelineContainer') timelineContainer!: ElementRef;
    @Input() highlightDay: number | null = null;
    @Input() startDate!: Date;
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
        if (!this.startDate) return; // Wait until startDate is available

        this.days = Array.from({ length: this.tripLength }, (_, i) => {
            const newDate = this.addDays(this.startDate, i);
            return {
                day: this.getWeekday(newDate),
                date: this.formatDate(newDate),
            };
        });
    }

    addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    getWeekday(date: Date): string {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return weekdays[date.getDay()];
    }

    formatDate(date: Date): string {
        const day = date.getDate();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[date.getMonth()];
        return `${day} ${month}`;
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
