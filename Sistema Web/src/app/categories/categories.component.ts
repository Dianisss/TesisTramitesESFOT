import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthServiceService } from '../Services/auth-service.service';

export interface DialogData {
  uid?: string
  process?: string,
  cats?: any
}

export class Upload{
  $key: string;
  file: File;
  name: string;
  url: string;
  progess: number;
  createdAt: Date = new Date();

  constructor(file:File){
    this.file = file;
  }
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  Categories= [];
  filteredCategories = [];
  userName;
  usrImg;
  usrRole;
  usrUID;
  catSelected = 'initial';
  form: any;
  constructor(public dialog: MatDialog,private snack: MatSnackBar, private auth: AuthServiceService, private router: Router, private Appc: AppComponent) { }

  ngOnInit(): void {
    this.usrImg = this.Appc.usrImg;
    this.userName = this.Appc.User.name;
    this.usrRole = this.Appc.User.role;
    let sub = this.auth.listCats().subscribe(result =>{
      this.Categories = result;
      this.filteredCategories = this.Categories;
      console.log(this.Categories)
    })
  }

  registerNewCategory(){
    const dialogRef = this.dialog.open(NewCategoryDialog, {
      width: '300px',
      data: {data: this.usrUID, process: 'new', cats: this.Categories}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result == 'created'){

        this.snack.open('Categoría creada con éxito', '', {duration: 2000})
      }
    })
  }

  registerNewSubCategory(selected, id){
    const dialogRef = this.dialog.open(NewSubCategoryDialog, {
      width: '300px',
      data: {data: id, process: 'new', cats: selected}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result == 'created'){

        this.snack.open('Subcategoría creada con éxito', '', {duration: 2000})
      }
    })
  }

  editCategory(category){
    const dialogRef = this.dialog.open(NewCategoryDialog, {
      width: '300px',
      data: {data: {name: category.name, desc: category.desc, cover: category.cover, id: category.id}, process: 'edit'}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result == 'updated'){
        this.catSelected = 'initial';
        this.snack.open('Categoría actualizada con éxito', '', {duration: 2000})

      }
    })
  }

  editSubCategory(selected, id, name){
    const dialogRef = this.dialog.open(NewSubCategoryDialog, {
      width: '300px',
      data: {data: {name: name}, cats: selected.subcats, id: id, process: 'edit'}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result == 'updated'){
        this.snack.open('Subcategoría actualizada con éxito', '', {duration: 2000})

      }
    })
  }

  changeCat(cat){
    console.log(cat);
    this.catSelected = cat;
    this.delay(200).then(() =>{
      console.log(document.getElementById('save'))
      if(this.catSelected['subcats'].length >= 1)
      {
        (document.getElementById('save') as HTMLButtonElement).disabled = true;
        (document.getElementById('save') as HTMLButtonElement).style.background = 'grey';
      }
      else
      {
        (document.getElementById('save') as HTMLButtonElement).disabled = false;
        (document.getElementById('save') as HTMLButtonElement).style.background = 'red';
      }


    })

  }

  deleteConfirm(categoryID){
    let uid = this.usrUID;
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '300px',
      data: {data: '', process: 'delete'}
    });

    dialogRef.afterClosed().subscribe(result =>{
      console.log(result);
      if(result == 'deleteLectura'){
        this.deleteCat(categoryID);
      }
    })
  }

  deleteConfirmSub(categoryID, subName, cats){
    let uid = this.usrUID;
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '300px',
      data: {data: '', process: 'delete'}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result == 'deleteLectura'){
        let index = 0;
        for(let s in cats)
        {
          if(cats[s].name == subName)
          {
            index = parseInt(s);
            cats.splice(index, 1)
          }
        }
        console.log(cats);
        this.auth.updateSubCategory(categoryID, cats);
      }
    })
  }

  deleteCat(id){
    for(let s in this.Categories)
    {
      if(this.Categories[s]['id'] == id)
      {
        if(this.Categories[s]['uid'] == this.usrUID)
        {
          this.auth.deleteCategory(id);
          this.catSelected = 'initial';
        }
        else
        {
          this.snack.open('No tiene permisos para eliminar esta categoría', '', {duration: 2000});
        }
      }
    }

  }

  logOutUser()
  {
    this.Appc.logOutUser();
  }

  searchData(searchValue: any) {
    this.filteredCategories = this.Categories.filter((item: any) => {
      return item.name.toLowerCase().includes(searchValue.toLowerCase())
    });
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("delay ", ms));
  }



}


@Component({
  selector: 'newCat',
  templateUrl: 'newCat.html',
  styleUrls: ['newCat.css']
})
export class NewCategoryDialog implements OnInit{
  currentUpload;
  uploadLink = ''
  process;
  cats;
  uid;
  CatUID;
  uploading = false;
  public NameInput = new FormControl();
  public DescriptInput = new FormControl();
  constructor(private storage: AngularFireStorage, private auth: AuthServiceService, public dialogRef: MatDialogRef<NewCategoryDialog>,private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData)
    {
      if(this.data["data"] != undefined)
      {
        // this.user = this.data["usr"];
        console.log(this.data);
      }
      this.process = this.data.process;
      this.cats = this.data.cats;
      this.uid = this.data['data'];
      console.log(this.uid, this.CatUID);
    }


  ngOnInit(){
    if(this.process == 'edit'){
      this.NameInput.setValue(this.data['data']['name']);
      this.DescriptInput.setValue(this.data['data']['desc']);
      this.uploadLink = this.data['data']['cover']
    }

  }

  detectFiles(event){
    this.uploading = true;
    (document.getElementById("save") as HTMLButtonElement).disabled = true;
    let name = this.NameInput.value;
    name = name+ Math.random().toString(36).replace(/[^a-z]+/g, '')
    let file = event.target.files[0];
    this.currentUpload = new Upload(file);
    this.storage.upload('/CategoryPics/'+name+'.png',this.currentUpload.file).then(response =>{
      let url = this.storage.ref('/CategoryPics/'+name+'.png').getDownloadURL();
      url.subscribe(result =>{
        this.uploading = false;
        (document.getElementById("save") as HTMLButtonElement).disabled = false;
        console.log(result);
        this.uploadLink = result;
      })
    });

  }

  createCat(){
    if(this.uploadLink != '' && this.NameInput.value != null){
      let name = this.NameInput.value;
      let desc = this.DescriptInput.value;
      console.log(name);
      let copied = false;
      for(let s in this.cats)
      {
        if(name == this.cats[s]['name'])
        {
          copied = true;
        }
      }
      if(copied)
      {
        this.snack.open('La categoría ya existe.', '', {duration: 2000})
      }
      else
      {
        if(name != ''){
          if(!name.replace(/\s/g, '').length ){
            this.snack.open('El nombre no puede ir en blanco','', {duration:2000})
          }
          else
        {
        let sub = this.auth.createCategory(name, desc, this.uploadLink);

        this.dialogRef.close('created');
      }
    }

    }
  }
    else{
      this.snack.open('Debe seleccionar un cover/nombre.', '', {duration: 2000})
    }

  }


  updateCat(){
    let name = this.NameInput.value;
    let desc = this.DescriptInput.value;
    let id = this.data['data']['id'];
    let copied = false;
    for(let s in this.cats)
    {
      if(name == this.cats[s]['name'])
      {
        copied = true;
      }
    }
    if(copied)
    {
      this.snack.open('La categoría ya existe.', '', {duration: 2000})
    }
    else
    {
      if(name != '')
      {
        if(!name.replace(/\s/g, '').length )
        {
          this.snack.open('El nombre no puede estar en blanco.', '', {duration: 2000})
        }
        else
        {
          let sub = this.auth.updateCategory(id, name, desc, this.uploadLink);
          this.dialogRef.close('updated');
        }
      }
      else
      {
        this.snack.open('El nombre no puede estar en blanco.', '', {duration: 2000})
      }

    }



  }

}

@Component({
  selector: 'newsubcat',
  templateUrl: 'newsubcat.html',
  styleUrls: ['newsubcat.css']
})
export class NewSubCategoryDialog implements OnInit{
  currentUpload;
  uploadLink = ''
  process;
  cats;
  uid;
  CatUID;
  uploading = false;
  public NameInput = new FormControl();
  public DescriptInput = new FormControl();
  constructor(private storage: AngularFireStorage, private auth: AuthServiceService, public dialogRef: MatDialogRef<NewCategoryDialog>,private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData)
    {
      if(this.data["data"] != undefined)
      {
        // this.user = this.data["usr"];
        console.log(this.data);
      }
      this.process = this.data.process;
      this.cats = this.data.cats;
      this.uid = this.data['data'];
      console.log(this.cats, this.uid);
    }


  ngOnInit(){
    if(this.process == 'edit'){
      this.NameInput.setValue(this.data['data']['name']);
    }

  }

  createCat(){
    if(this.NameInput.value != null || this.NameInput.value == ''){
      let name = this.NameInput.value;
      console.log(name);
      let copied = false;
      for(let s in this.cats)
      {
        if(name == this.cats[s]['name'])
        {
          copied = true;
        }
      }
      if(copied)
      {
        this.snack.open('Esta subcategoría ya existe.', '', {duration: 2000})
      }
      else
      {
        if(name !='')
        {
          if(!name.replace(/\s/g, '').length )
          {
            this.snack.open('El nombre no puede estar en blanco.', '', {duration: 2000})
          }
          else
          {
            this.cats.push({name: name, temas: []})
            let sub = this.auth.updateSubCategory(this.uid, this.cats);
            // this.auth.createAlert('Nueva Sub-categoria: "'+name+'" esta disponible.');
            //let sub = this.auth.createCategory(name, desc, this.uploadLink);
            this.dialogRef.close('created');
          }
        }
        else
        {
          this.snack.open('El nombre no puede estar en blanco.', '', {duration: 2000});
        }
      }

    }
    else{
      this.snack.open('Debe seleccionar un nombre.', '', {duration: 2000})
    }

  }

  updateCat(){
    let name = this.NameInput.value;
    let id = this.data['id'];
    let copied = false;
    for(let s in this.cats)
    {
      if(name == this.cats[s]['name'])
      {
        copied = true;
      }
    }
    if(copied)
    {
      this.snack.open('La subcategoría ya existe.', '', {duration: 2000})
    }
    else
    {
      if(name != '')
      {
        if(!name.replace(/\s/g, '').length )
        {
          this.snack.open('El nombre no puede estar en blanco.', '', {duration: 2000})
        }
        else
        {
          //let sub = this.auth.updateCategory(id, name, desc, this.uploadLink);
          for(let s in this.cats)
          {
            if(this.cats[s].name == this.data['data']['name'])
            {
              this.cats[s].name = name;
            }
          }
          this.auth.updateSubCategory(id, this.cats)
          this.dialogRef.close('updated');
        }
      }
      else
      {
        this.snack.open('El nombre no puede estar en blanco.', '', {duration: 2000})
      }
    }



  }

}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html',
  styleUrls: ['confirm-dialog.css']
})
export class ConfirmDialog implements OnInit{
  constructor(public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData)
    {
      if(this.data["data"] != undefined)
      {
        // this.user = this.data["usr"];
        console.log(this.data['data']);
      }
    }


  ngOnInit(){

  }

  confirmed(){
    this.dialogRef.close('deleteLectura');
  }

  cancel(){
    this.dialogRef.close();
  }


}
