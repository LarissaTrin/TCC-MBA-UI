import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Textfield } from './textfield';

describe('Textfield', () => {
  let component: Textfield;
  let fixture: ComponentFixture<Textfield>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Textfield]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Textfield);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
