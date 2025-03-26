import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaypointElementComponent } from './waypoint-element.component';

describe('PlaceDetailsComponent', () => {
  let component: WaypointElementComponent;
  let fixture: ComponentFixture<WaypointElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaypointElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaypointElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
