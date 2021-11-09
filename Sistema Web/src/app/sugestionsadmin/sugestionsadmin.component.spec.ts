import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugestionsadminComponent } from './sugestionsadmin.component';

describe('SugestionsadminComponent', () => {
  let component: SugestionsadminComponent;
  let fixture: ComponentFixture<SugestionsadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SugestionsadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SugestionsadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
