import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import * as CONSTANT from '../services/constants';
import {UserComponentService} from './user.service';
import { AdminService } from '../services/admin.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  hasData:boolean=false;
  allData: any = [];
  pagination = { 
      limit: 2, 
      maxSize: 2, 
      skip: 0, 
      totalItems: null
  };
  currentPage= 1;
  search='';

  constructor(
    private admin:AdminService,
    private router: Router,
    private cp: UserComponentService,
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    let url = 'http://localhost:3000?page='+this.currentPage+'&search='+this.search+'';
    let data = {};
    this.cp.postData(data,url).subscribe(
      res=>{
        this.pagination.totalItems = res.data.count;
        this.allData = res.data.list;
        this.hasData=true;
      }
    );
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.getList();
  }

  searchFun() {
    this.currentPage = 1; 
    this.getList();
  }

  delete(id) {
    swal({
        title: '<h2>Delete</h2>',
        html: '<p>Are you sure, you want to Delete?</p>',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonAriaLabel: 'Delete',
        cancelButtonAriaLabel: 'Cancel',
        confirmButtonColor: '#3c5ba0',
        cancelButtonColor: '',
        confirmButtonText:
            'Delete',
        cancelButtonText:
            'Cancel',
        reverseButtons: true,
        width: 500
    }).then((result) => {
        if (result.value) {
          let url = 'http://localhost:3000?type=2';
          let data = {};
          data['id']=id;
            this.cp.postData(data,url).subscribe(
                success => {
                    this.admin.showAlert('Deleted Successfully', '');
                    let scope=this;
                    setTimeout(function(){ scope.getList(); }, 1500);
                    
                }
            );
        }
    });
  }

}

  

