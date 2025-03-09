import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripStageElementComponent } from './trip-stage-element.component';

describe('TripStageElementComponent', () => {
  let component: TripStageElementComponent;
  let fixture: ComponentFixture<TripStageElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripStageElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripStageElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
