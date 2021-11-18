import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesComponent } from './categories.component';

describe('CategoriesComponent', () => {


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriesComponent ]
    })
    .compileComponents();
  });

  it('Debería crear el componente', () => {

    const fixture=TestBed.createComponent(CategoriesComponent);
    const component2= fixture.componentInstance;
    expect(component2).toBeTruthy();

  });

  it('Debería verificar el campo de nombre de la categoría no este vacio', () => {

    const fixture=TestBed.createComponent(CategoriesComponent);
    const component= fixture.componentInstance;
    const cate= { nombre: "Categoria"};
    const verificacion = component.editCategory(cate.nombre);

    expect(verificacion['required']).toBeFalsy();
    expect(verificacion ['nombre']).toBeFalsy();
  });

  it('Debería verificar el campo de nombre de la subcategoría no este vacio', () => {

    const fixture=TestBed.createComponent(CategoriesComponent);
    const component= fixture.componentInstance;
    const subc= { select: "nombreCategoría", id: '1', name: "Registro"};
    const verificacion = component.editSubCategory(subc.select, subc.id, subc.name );

    expect(verificacion['required']).toBeFalsy();
    expect(verificacion ['select']).toBeFalsy();
    expect(verificacion ['id']).toBeFalsy();
    expect(verificacion ['name']).toBeFalsy();

  });

});
