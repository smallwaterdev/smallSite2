import { Component, OnInit } from '@angular/core';
import {UserOperationService} from '../services/user-operation.service';
import {LocalCacheService} from '../services/local-cache.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {

  constructor(
    private userOperator: UserOperationService,
    private router: Router,
    private localCache: LocalCacheService,
  ) { }

  ngOnInit() {
  }
  logout(){
    this.userOperator.logout().subscribe(data=>{
      if(data.success){
        this.router.navigate(["login"]);
        this.localCache.clearAll();
      }else{
        //show err
        alert(JSON.stringify(data.reasons));
      }
    });
  }
}
