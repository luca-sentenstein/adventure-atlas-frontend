import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { NgIf } from '@angular/common';
import { Waypoint } from '../../interfaces/waypoint';

@Component({
  selector: 'app-waypoint-element',
    imports: [
        NgIf
    ],
  templateUrl: './waypoint-element.component.html',
  styleUrl: './waypoint-element.component.scss'
})
export class WaypointElementComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() waypoint!: Waypoint;
    @Output() waypointUpdated = new EventEmitter<Waypoint>();
    @ViewChild('editableName') editableName!: ElementRef<HTMLElement>;
    @ViewChild('elementContainer') elementContainer!: ElementRef<HTMLElement>;

    private originalName: string = '';
    isEditable: boolean = false;
    private isMouseOver = false;

    ngOnInit(): void {
        this.originalName = this.waypoint.name;
    }

    ngAfterViewInit(): void {
        this.editableName.nativeElement.textContent = this.waypoint.name;
    }

    ngOnChanges(): void {
        if (this.waypoint.name !== this.originalName) {
            this.originalName = this.waypoint.name;
            if (this.editableName && this.editableName.nativeElement) {
                this.editableName.nativeElement.textContent = this.waypoint.name;
            }
        }
    }

    onMouseEnter(): void {
        this.isMouseOver = true;
    }

    onMouseLeave(): void {
        this.isMouseOver = false;
    }

    onBoxClick(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();


        if (!this.isEditable) {
            this.isEditable = true;
            this.editableName.nativeElement.setAttribute('contenteditable', 'true');
            this.editableName.nativeElement.focus();
            this.setCursorAtEnd();
        }else{
            this.deselect();
        }
    }

    private setCursorAtEnd(): void {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(this.editableName.nativeElement);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
    }

    onInput(event: Event): void {
        this.waypoint.name = (event.target as HTMLElement).textContent?.trim() || '';
    }

    onBlur(): void {
        if (!this.isMouseOver) {
            this.deselect();
        }
    }

    deselect(): void {
        const newName = this.editableName.nativeElement.textContent?.trim() || '';
        if (newName !== this.originalName) {
            this.waypoint.name = newName;
            this.waypointUpdated.emit(this.waypoint);
            this.originalName = newName;
        }
        this.isEditable = false;
        this.editableName.nativeElement.setAttribute('contenteditable', 'false');
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.editableName.nativeElement.blur();
        }
    }
}
