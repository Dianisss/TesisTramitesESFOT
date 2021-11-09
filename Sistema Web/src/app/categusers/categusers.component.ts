import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { AuthServiceService } from '../Services/auth-service.service';
import { ViewTramite } from '../tramites/tramites.component';

@Component({
  selector: 'app-categusers',
  templateUrl: './categusers.component.html',
  styleUrls: ['./categusers.component.css']
})
export class CategusersComponent implements OnInit {
  Categories= [];
  filteredCategories = [];
  userName;
  usrImg;
  usrRole;
  usrUID;
  catSelected = 'initial';
  selected = '';
  constructor(public dialog: MatDialog,private snack: MatSnackBar, private auth: AuthServiceService, private router: Router, private Appc: AppComponent) { }

  ngOnInit(): void {
    this.usrImg = this.Appc.usrImg;
    this.userName = this.Appc.User.name;
    this.usrRole = this.Appc.User.role;
    let sub = this.auth.listCats().subscribe(result =>{
      this.Categories = result;    
      this.filteredCategories = this.Categories;
    })
  }

  logOutUser()
  {
    this.Appc.logOutUser();
  }

  changeCat(cat){
    this.selected = cat;
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

  searchData(searchValue: any) {
    this.filteredCategories = this.Categories.filter((item: any) => {      
      return item.name.toLowerCase().includes(searchValue.toLowerCase())
    });
  }

}
