import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaypointsListComponent } from './waypoints-list.component';

describe('WaypointsListComponent', () => {
  let component: WaypointsListComponent;
  let fixture: ComponentFixture<WaypointsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaypointsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaypointsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
