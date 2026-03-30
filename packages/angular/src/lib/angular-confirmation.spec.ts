import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularConfirmation } from './angular-confirmation';

describe('AngularConfirmation', () => {
  let component: AngularConfirmation;
  let fixture: ComponentFixture<AngularConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularConfirmation],
    }).compileComponents();

    fixture = TestBed.createComponent(AngularConfirmation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
