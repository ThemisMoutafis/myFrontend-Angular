import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoTableComponent } from './personal-info-table.component';

describe('PersonalInfoTableComponent', () => {
  let component: PersonalInfoTableComponent;
  let fixture: ComponentFixture<PersonalInfoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalInfoTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalInfoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
