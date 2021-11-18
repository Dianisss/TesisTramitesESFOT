import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthServiceService } from '../Services/auth-service.service';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import Drawflow from 'drawflow';
import 'drawflow/dist/drawflow.min.css'
import { ConfirmDialog, NewSubCategoryDialog } from '../categories/categories.component';

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
  selector: 'app-tramites',
  templateUrl: './tramites.component.html',
  styleUrls: ['./tramites.component.css']
})
export class TramitesComponent implements OnInit {
  Categories= [];
  filteredCategories = [];
  userName;
  usrImg;
  usrRole;
  usrUID;
  selection = new FormControl();
  selected = '';
  form: any;

  constructor(public dialog: MatDialog,private snack: MatSnackBar, private auth: AuthServiceService, private router: Router, private AppC: AppComponent) { }

  ngOnInit(): void {

    if(!this.AppC.isLogged)
    {
      this.router.navigateByUrl('login');
    }
    this.usrImg = this.AppC.usrImg;
    this.userName = this.AppC.User.name;
    this.usrRole = this.AppC.User.role;
    let sub = this.auth.listCats().subscribe(result =>{
      this.Categories = result;
      this.filteredCategories = this.Categories;
      console.log(this.Categories)
    })
  }

  ngAfterViewInit()
  {
    this.usrImg = this.AppC.usrImg;
    this.userName = this.AppC.User.name;
    this.usrRole = this.AppC.User.role;
  }

  logOutUser()
  {
    this.AppC.logOutUser();
  }

  registerNewTramite(subcat, id){
    const dialogRef = this.dialog.open(NewTramiteDialog, {
      width: '90vw',
      data: {data: id, process: 'new', cats: subcat}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result == 'created'){

        this.snack.open('Tramite creado con exito', '', {duration: 2000})
      }
    })
  }

  editTramite(subcat, id, tramite){
    const dialogRef = this.dialog.open(NewTramiteDialog, {
      width: '90vw',
      data: {data: id, process: 'edit', cats: subcat, tramite: tramite}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result == 'created'){

        this.snack.open('Tramite editado con exito', '', {duration: 2000})
      }
    })
  }

  viewTramite(tramite)
  {
    console.log(tramite)
    const dialogRef = this.dialog.open(ViewTramite, {
      width: '90vw',
      data: tramite
    });

    dialogRef.afterClosed().subscribe(result =>{
    })
  }

  changeSel()
  {
    console.log(this.selection.value)
    this.selected = this.selection.value;
  }

  changeCat(cat){
    this.selected = cat;
  }

  openDelete(tramite, subcat, selected)
  {
    let uid = this.usrUID;
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '300px',
      data: {data: '', process: 'delete'}
    });

    dialogRef.afterClosed().subscribe(result =>{
      console.log(result);
      if(result == 'deleteLectura'){
        this.deleteTramite(tramite, subcat, selected);
        this.snack.open('Tramite eliminado!.', '', {duration: 2500})
      }
    })
  }

  deleteTramite(tramite, subcat, selected)
  {
    let tramiteid = selected.id;
    let subcats = selected.subcats;
    let index;
    for(let s in subcats)
    {
      if(subcats[s].name == subcat.name)
      {
        index = s;
      }
    }
    if(index != undefined)
    {
      for(let f in subcats[index].temas)
      {
       if(subcats[index].temas[f].name == tramite.name)
       {
         subcats[index].temas.splice(f, 1);
       }
      }
    }
    this.auth.updateSubCategory(tramiteid, subcats);
  }

  enableTramite(tramite, subcat, selected)
  {
    let tramiteid = selected.id;
    let subcats = selected.subcats;
    let index;
    for(let s in subcats)
    {
      if(subcats[s].name == subcat.name)
      {
        index = s;
      }
    }
    if(index != undefined)
    {
      for(let f in subcats[index].temas)
      {
       if(subcats[index].temas[f].name == tramite.name)
       {
         subcats[index].temas[f].visible = true;
       }
      }
    }
    this.auth.updateSubCategory(tramiteid, subcats);
    this.snack.open('Documento Habilitado!', '', {duration: 2500});
  }

  disableTramite(tramite, subcat, selected)
  {
    let tramiteid = selected.id;
    let subcats = selected.subcats;
    let index;
    for(let s in subcats)
    {
      if(subcats[s].name == subcat.name)
      {
        index = s;
      }
    }
    if(index != undefined)
    {
      for(let f in subcats[index].temas)
      {
       if(subcats[index].temas[f].name == tramite.name)
       {
         subcats[index].temas[f].visible = false;
       }
      }
    }
    this.auth.updateSubCategory(tramiteid, subcats);
    this.snack.open('Documento Deshabilitado!', '', {duration: 2500});
  }

  searchData(searchValue: any) {
    this.filteredCategories = this.Categories.filter((item: any) => {
      return item.name.toLowerCase().includes(searchValue.toLowerCase())
    });
  }

}

@Component({
  selector: 'newTramite',
  templateUrl: 'newTramite.html',
  styleUrls: ['newTramite.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class NewTramiteDialog implements OnInit{
  public tools: object = {
      type: 'Expand',
      items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
              'FontName', 'FontSize', 'FontColor',
              'LowerCase', 'UpperCase', '|',
              'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
              'Outdent', 'Indent', '|',
              'CreateLink', 'Image', '|', 'ClearFormat', 'NumberFormatList', 'BulletFormatList',
              '|', 'Undo', 'Redo',

            ]
  };

  currentUpload;
  uploadLink = [];
  process;
  cats;
  uid;
  CatUID;
  uploading = false;
  tramite;
  originalName;
  public NameInput = new FormControl();
  public DescriptInput = new FormControl();
  public Editor = ClassicEditorBuild;
  public EditorObj: any;

  public textValue = `
  <p> </p>
    <p> </p>`
  constructor(public dialog: MatDialog, private storage: AngularFireStorage, private auth: AuthServiceService, public dialogRef: MatDialogRef<NewTramiteDialog>,private snack: MatSnackBar,
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
      this.tramite = this.data['tramite'];
      console.log(this.uid, this.cats);
    }


  ngOnInit(){
    if(this.process == 'edit'){
      console.log(this.tramite);
      this.NameInput.setValue(this.tramite.name);
      this.originalName = this.tramite.name;
      this.uploadLink = this.tramite.links;
      this.textValue = this.tramite.doc;
    }

    this.delay(700).then(()=>{
      var id = document.getElementById("drawflow");
      this.EditorObj = new Drawflow(id);
      this.EditorObj.start();
      var html =  document.createElement("div");
      html.innerHTML = '<div><input readonly type="text" df-name style="background: transparent; border: transparent;"></div>';
      this.EditorObj.registerNode('myNode', html, '', {});
      this.EditorObj.import(this.tramite.diagram);

    })


  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("delay ", ms));
  }

  detectFiles(event) {
    console.log(this.uploadLink.length);
    console.log(event.target.files[0].size/1024/1024);
    if(parseFloat(event.target.files[0].size)/1024/1024 <= 2)
    {
      if(event.target.files[0]['type'] == 'application/pdf' || event.target.files[0]['type'] == 'application/msword' || event.target.files[0]['type'] == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      {
        if(this.uploadLink.length != 3)
        {
          this.uploading = true;
          let dispName = event.target.files[0].name;
          console.log(event)
          let name = event.target.files[0].name;
          (document.getElementById("save") as HTMLButtonElement).disabled = true;
          name = name + Math.random().toString(36).replace(/[^a-z]+/g, '')
          let file = event.target.files[0];
          this.currentUpload = new Upload(file);
          if(event.target.files[0]['type'] == 'application/pdf')
          {
            this.storage.upload('/Lecturas/' + name + '.pdf', this.currentUpload.file).then(response => {
              let url = this.storage.ref('/Lecturas/' + name + '.pdf').getDownloadURL();
              url.subscribe(result => {
                this.uploading = false;
                (document.getElementById("save") as HTMLButtonElement).disabled = false;
                console.log(result);
                this.uploadLink.push({'url': result, 'name': dispName})
              })
            });
          }
          else
          {
            this.storage.upload('/Lecturas/' + name + '.docx', this.currentUpload.file).then(response => {
              let url = this.storage.ref('/Lecturas/' + name + '.docx').getDownloadURL();
              url.subscribe(result => {
                this.uploading = false;
                (document.getElementById("save") as HTMLButtonElement).disabled = false;
                console.log(result);
                this.uploadLink.push({'url': result, 'name': dispName})
              })
            });
          }
        }
        else
        {
          this.snack.open('Maximo de documentos permitidos!.', '', {duration: 2500});
        }
      }
      else
      {
        this.snack.open('Formato no permitido!.', '', {duration: 2500});
      }

    }
    else
    {
      this.snack.open('Archivo excede el peso maximo: 2Mb', '', {duration: 2500});
    }
  }


  deleteElement(name){
    for(let s in this.uploadLink)
    {
      if(this.uploadLink[s].url == name)
      {
        this.uploadLink.splice(parseInt(s), 1);
      }
    }
    console.log(this.uploadLink);
  }

  createTramite(){
    if(this.uploadLink.length >= 1 && this.NameInput.value != null){
      let name = this.NameInput.value;
      let desc = this.DescriptInput.value;
      console.log(name);
      let copied = false;

      let sub = this.auth.createCategory(name, desc, this.uploadLink);
      //this.auth.createAlert('Nuevo tramite: "'+name+'" esta disponible.');
      this.dialogRef.close('created');


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
      this.snack.open('La categoria ya existe.', '', {duration: 2000})
    }
    else
    {
      let sub = this.auth.updateCategory(id, name, desc, this.uploadLink);
      this.dialogRef.close('updated');
    }



  }

  zoomIn()
  {
    this.EditorObj.zoom_in()
  }

  zoomOut()
  {
    this.EditorObj.zoom_out()
  }

  createStartBlock(){
    const dialogRef = this.dialog.open(NewBlockDialog, {
      data: {data: '', process: 'new', cats: ''}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result != undefined)
      {
        var html =  document.createElement("div");
        html.innerHTML = '<div><input readonly type="text" df-name style="background: transparent; border: transparent;"></div>';
        this.EditorObj.registerNode('myNode', html, '', {});
        var data = { "name": result };
        this.EditorObj.addNode('newNode', 0, 1, 10, 10, 'newNode', data, 'myNode', true);
      }
    })
  }

  createMiddleBlock(){
    const dialogRef = this.dialog.open(NewBlockDialog, {
      data: {data: '', process: 'new', cats: ''}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result != undefined)
      {
        var html =  document.createElement("div");
        html.innerHTML = '<div><input readonly type="text" df-name style="background: transparent; border: transparent;"></div>';
        this.EditorObj.registerNode('myNode', html, '', {});
        var data = { "name": result };
        this.EditorObj.addNode('newNode', 1, 1, 10, 10, 'newNode', data, 'myNode', true);
      }
    })
  }

  createEndBlock(){
    const dialogRef = this.dialog.open(NewBlockDialog, {
      data: {data: '', process: 'new', cats: ''}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result != undefined)
      {
        // var html = document.createElement("div");
        // html.innerHTML =  result;
        // this.EditorObj.registerNode('myNode', html, '', {});
        var html =  document.createElement("div");
        html.innerHTML = '<div><input readonly type="text" df-name style="background: transparent; border: transparent;"></div>';
        this.EditorObj.registerNode('myNode', html, '', {});
        var data = { "name": result };
        this.EditorObj.addNode('newNode', 1, 0, 10, 10, 'newNode', data, 'myNode', true);
      }
    })
  }

  saveRichText(){
    console.log(this.textValue);
  }

  saveAllData()
  {
    let index;
    for(let s in this.uid['subcats'])
    {
      if(this.uid['subcats'][s]['name'] == this.cats['name'])
      {
        index = parseInt(s);
      }
    }
    let body = {
      'name': this.NameInput.value,
      'doc': this.textValue,
      'links': this.uploadLink,
      'diagram': this.EditorObj.export(),
      'visible': true
    }

    this.uid['subcats'][index]['temas'].push(body);
    this.auth.updateSubCategory(this.uid['id'], this.uid['subcats']);

    //this.auth.createAlert('Nuevo tramite: "'+this.NameInput.value+'" esta disponible.');
    this.snack.open('Nuevo registro creado!', '', {duration: 2500});
    this.dialogRef.close('ok');

  }

  updateAllData()
  {
    let index;
    for(let s in this.uid['subcats'])
    {
      if(this.uid['subcats'][s]['name'] == this.cats['name'])
      {
        index = parseInt(s);
      }
    }
    let body = {
      'name': this.NameInput.value,
      'doc': this.textValue,
      'links': this.uploadLink,
      'diagram': this.EditorObj.export(),
      'visible': this.tramite.visible
    }

    //this.uid['subcats'][index]['temas'].push(body);
    for(let s in this.uid['subcats'][index]['temas'])
    {
      if(this.uid['subcats'][index]['temas'][s].name == this.originalName)
      {
        this.uid['subcats'][index]['temas'][s] = body;
      }
    }
    this.auth.updateSubCategory(this.uid['id'], this.uid['subcats']);
    this.snack.open('Documento Actualizado!', '', {duration: 2500});
    this.dialogRef.close('ok');

  }

}

@Component({
  selector: 'NewBlockDialog',
  templateUrl: 'NewBlockDialog.html',
  styleUrls: ['NewBlockDialog.css']
})
export class NewBlockDialog implements OnInit{
  public NameInput = new FormControl();
  constructor(public dialogRef: MatDialogRef<NewBlockDialog>,private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData)
    {
      if(this.data["data"] != undefined)
      {
        // this.user = this.data["usr"];
        console.log(this.data);
      }
    }

  ngOnInit(){

  }

  createBlock(){
    this.dialogRef.close(this.NameInput.value);
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

}

@Component({
  selector: 'ViewTramite',
  templateUrl: 'ViewTramite.html',
  styleUrls: ['ViewTramite.css']
})
export class ViewTramite implements OnInit{
  public name;
  public body;
  public diagram;
  public links;
  EditorObj: any;

  constructor(public dialogRef: MatDialogRef<ViewTramite>,private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData)
    {
      if(this.data["data"] != undefined)
      {
        console.log(this.data);
      }
    }

  ngOnInit(){
    console.log(this.data);
    this.name = this.data['name']
    this.body = this.data['doc']
    this.diagram = this.data['diagram']
    this.links = this.data['links']

    this.delay(600).then(any =>{
      var docBody = document.getElementById('contenido').insertAdjacentHTML('beforeend',this.body);
      console.log(docBody)

      var id = document.getElementById("drawflow");
      this.EditorObj = new Drawflow(id);
      this.EditorObj.start();
      var html =  document.createElement("div");
      html.innerHTML = '<div><input readonly type="text" df-name style="background: transparent; border: transparent;"></div>';
      this.EditorObj.registerNode('myNode', html, '', {});
      console.log(this.diagram);
      this.EditorObj.import(this.diagram);
      this.EditorObj.editor_mode = 'view';
    })

  }

  openDoc(link)
  {
    window.open(link, "_blank");
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

  zoomIn()
  {
    this.EditorObj.zoom_in()
  }

  zoomOut()
  {
    this.EditorObj.zoom_out()
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("delay ", ms));
  }

}
