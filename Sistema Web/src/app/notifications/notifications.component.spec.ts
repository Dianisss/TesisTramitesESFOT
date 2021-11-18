import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from './notifications.component';

describe('NotificationsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationsComponent ]
    })
    .compileComponents();
  });

  it('Debería crear el componente', () => {

    const fixture=TestBed.createComponent(NotificationsComponent);
    const component= fixture.componentInstance;
    expect(component).toBeTruthy();

  });

  it('Debería verificar que solo se seleccione la opción noticia', () => {

    const fixture=TestBed.createComponent(NotificationsComponent);
    const component= fixture.componentInstance;
    const seleqsn= {id: '1'}
    const verificacion = component.selectCause(seleqsn.id);

    expect(verificacion['required']).toBeFalsy();
    expect(verificacion ['id']).toBeDefined();

  });

});
