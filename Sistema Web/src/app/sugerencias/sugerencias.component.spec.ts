import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugerenciasComponent } from './sugerencias.component';

describe('SugerenciasComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SugerenciasComponent ]
    })
    .compileComponents();
  });

  it('Debería crear el componente', () => {

    const fixture=TestBed.createComponent(SugerenciasComponent);
    const component= fixture.componentInstance;
    expect(component).toBeTruthy();

  });

  it('Debería verificar que solo se seleccione la opción queja', () => {

    const fixture=TestBed.createComponent(SugerenciasComponent);
    const component= fixture.componentInstance;
    const seleqsn= {id: '1'}
    const verificacion = component.selectCause(seleqsn.id);

    expect(verificacion['required']).toBeFalsy();
    expect(verificacion ['id']).toBeTrue();


  });

  it('Debería verificar que solo se seleccione la opción sugerencia', () => {

    const fixture=TestBed.createComponent(SugerenciasComponent);
    const component= fixture.componentInstance;
    const seleqsn= {id: '2'}
    const verificacion = component.selectCause(seleqsn.id);

    expect(verificacion['required']).toBeFalsy();
    expect(verificacion ['id']).toBeTrue();

  });

  it('Debería verificar que solo se seleccione la opción novedad', () => {

    const fixture=TestBed.createComponent(SugerenciasComponent);
    const component= fixture.componentInstance;
    const seleqsn= {id: '3'}
    const verificacion = component.selectCause(seleqsn.id);

    expect(verificacion['required']).toBeFalsy();
    expect(verificacion ['id']).toBeTrue();

  });



});
