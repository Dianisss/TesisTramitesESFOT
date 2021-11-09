import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategusersComponent } from './categusers.component';

describe('CategusersComponent', () => {
  let component: CategusersComponent;
  let fixture: ComponentFixture<CategusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategusersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
