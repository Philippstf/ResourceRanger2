import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeTrackerPage } from './time-tracker.page';

describe('TimeTrackerPage', () => {
  let component: TimeTrackerPage;
  let fixture: ComponentFixture<TimeTrackerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TimeTrackerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
