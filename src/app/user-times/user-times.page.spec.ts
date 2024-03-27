import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserTimesPage } from './user-times.page';

describe('UserTimesPage', () => {
  let component: UserTimesPage;
  let fixture: ComponentFixture<UserTimesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserTimesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
