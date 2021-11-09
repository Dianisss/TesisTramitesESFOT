import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { ConfirmDialog, DialogData } from '../categories/categories.component';
import { AuthServiceService } from '../Services/auth-service.service';

@Component({
  selector: 'app-sugestionsadmin',
  templateUrl: './sugestionsadmin.component.html',
  styleUrls: ['./sugestionsadmin.component.css']
})
export class SugestionsadminComponent implements OnInit {
  userUrl = '';
  listView = 'Pending';
  User;
  usrRole;
  reqList = [];
  filteredreqList = [];
  reqListApproved = [];
  filteredreqListApproved = [];
  reqListDenied = [];
  filteredreqListDenied = [];
  displayedColumns: string[] = ['desc', 'reason', 'state', 'causeState','action', 'action2'];
  displayedColumnsApproved: string[] = ['desc', 'reason', 'state', 'causeState', 'leido','action'];
  displayedColumnsDenied: string[] = ['desc', 'reason', 'state', 'causeState', 'leido','action'];
  dataSource = new MatTableDataSource(this.reqList);
  dataSourceApproved = new MatTableDataSource();
  dataSourceDenied = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorApproved: MatPaginator;
  @ViewChild(MatPaginator) paginatorDenied: MatPaginator;

  constructor(private AppC: AppComponent, private userService: AuthServiceService, private snack: MatSnackBar, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.User = this.AppC.User;
    this.userUrl = this.User.usrUrl;
    this.usrRole = this.AppC.User.role;

    let sub = this.userService.listSuggest().subscribe(result =>{
      this.reqList = [];
      this.reqListApproved = [];
      this.reqListDenied = [];
      for(let s in result){
        if(result[s]['state'] == 'Pendiente')
        {
          this.reqList.push(result[s]);
        }
        if(result[s]['state'] == 'Aprobado')
        {
          this.reqListApproved.push(result[s]);
        }
        if(result[s]['state'] == 'Denegado')
        {
          this.reqListDenied.push(result[s]);
        }
        
      }
      this.dataSource = new MatTableDataSource(this.reqList);
      this.dataSourceApproved = new MatTableDataSource(this.reqListApproved);
      this.dataSourceDenied = new MatTableDataSource(this.reqListDenied);
      //this.dataSource.paginator = this.paginator;
      setTimeout(() => this.dataSource.paginator = this.paginator);
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
      setTimeout(() => this.dataSourceApproved.paginator = this.paginatorApproved);
      if (this.dataSourceApproved.paginator) {
        this.dataSourceApproved.paginator.firstPage();
      }
      setTimeout(() => this.dataSourceDenied.paginator = this.paginatorDenied);
      if (this.dataSourceDenied.paginator) {
        this.dataSourceDenied.paginator.firstPage();
      }

      console.log(this.reqList);
    })

  }

  logOutUser()
  {
    this.AppC.logOutUser();
  }

  DenyRequests(user){
    const dialogRef = this.dialog.open(ConfirmData, {
      width: '300px',
      data: {data: user, process: 'Denegar'}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result != 'NO')
      {
        this.userService.updateSuggest(user, result, 'Denegado')
      }
    })
    
  }

  AcceptRequests(user){
    const dialogRef = this.dialog.open(ConfirmData, {
      width: '300px',
      data: {data: user, process: 'Aprobar'}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result != 'NO')
      {
        this.userService.updateSuggest(user, result, 'Aprobado')
      }
    })
    
  }

  eraseNot(id)
  {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '300px',
      data: {data: '', process: 'Denegar'}
    });

    dialogRef.afterClosed().subscribe(result =>{
      if(result == 'deleteLectura')
      {
        this.userService.deleteSuggest(id);
      }
    })
  }

  searchData(searchValue: any) {
    this.dataSource.filter = searchValue.trim().toLowerCase();
    if (this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
    this.dataSourceApproved.filter = searchValue.trim().toLowerCase();
    if (this.dataSourceApproved.paginator){
      this.dataSourceApproved.paginator.firstPage();
    }
    this.dataSourceDenied.filter = searchValue.trim().toLowerCase();
    if (this.dataSourceDenied.paginator){
      this.dataSourceDenied.paginator.firstPage();
    }
  }


}

@Component({
  selector: 'confirmData',
  templateUrl: 'confirmData.html',
  styleUrls: ['confirmData.css']
})
export class ConfirmData implements OnInit{
  cause = ''
  constructor(public dialogRef: MatDialogRef<ConfirmData>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData)
    {
      if(this.data["data"] != undefined)
      {
        // this.user = this.data["usr"];
        this.cause = this.data['process']
      }
    }


  ngOnInit(){
    console.log(this.data);
  }

  confirmed(){
    this.dialogRef.close((document.getElementById('desc') as HTMLInputElement).value);
  }

  cancel(){
    this.dialogRef.close('NO');
  }

}
