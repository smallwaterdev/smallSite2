import { Component , OnInit} from '@angular/core';
import {Router} from '@angular/router';
//import { trigger, state, style, animate, transition} from '@angular/animations';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import { ScrollingService } from './services/scrolling.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Javferry';
  searchValue:string = "";
  sideNavStyle: string = "none";
  
  constructor(
    private router: Router,
    private media: ObservableMedia
  ){ }
  ngOnInit(){
    this.media.subscribe((change: MediaChange) => {
      if(['sm', 'xs'].indexOf(change.mqAlias) === -1){
        this.sideNavStyle = 'none';
      }
    });
  }
  sidenavToggle(){
    if(this.sideNavStyle === 'none'){
      this.sideNavStyle = 'flex';
    }else if(this.sideNavStyle === 'flex'){
      this.sideNavStyle = 'none';
    }
  }
  

  search(location: string){
    this.router.navigate(['/search', this.searchValue]);
  }
}
