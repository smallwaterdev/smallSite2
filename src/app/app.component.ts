import { Component , OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
//import { trigger, state, style, animate, transition} from '@angular/animations';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import { UserOperationService } from './services/user-operation.service';
import {User} from "./data-structures/User";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Javferry';
  searchValue:string = "";
  sideNavStyle: string = "none";

  username: string = null;
  isReadyUser: boolean = false;

  constructor(
    private router: Router,
    private userOperator: UserOperationService
  ){ }
  ngOnInit(){
    this.router.events.subscribe((evt)=>{
      if(!(evt instanceof NavigationEnd)){
        return;
      }
      this.sideNavStyle = 'none';
    });
    
    this.userOperator.userMount$.subscribe(data=>{
      this.isReadyUser = true;
      this.username = data.username;
    });
    this.userOperator.userUnMount$.subscribe(data=>{
      this.isReadyUser = true;
      this.username = null;
    });
    this.userOperator.queryUserWithSession();

  }
  
  sidenavToggle(){
    if(this.sideNavStyle === 'none'){
      this.sideNavStyle = 'flex';
    }else if(this.sideNavStyle === 'flex'){
      this.sideNavStyle = 'none';
    }
  }

  
  search(){
    this.router.navigate(['/search', this.searchValue]);
  }
}
