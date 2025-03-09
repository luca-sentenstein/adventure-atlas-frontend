import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagesListDayComponent } from './stages-list-day.component';

describe('StagesListDayComponent', () => {
  let component: StagesListDayComponent;
  let fixture: ComponentFixture<StagesListDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagesListDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StagesListDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
