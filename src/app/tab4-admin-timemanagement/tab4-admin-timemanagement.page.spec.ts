import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tab4AdminTimemanagementPage } from './tab4-admin-timemanagement.page';

describe('Tab4AdminTimemanagementPage', () => {
  let component: Tab4AdminTimemanagementPage;
  let fixture: ComponentFixture<Tab4AdminTimemanagementPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Tab4AdminTimemanagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
