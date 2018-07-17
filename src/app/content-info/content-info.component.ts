import { Component, OnInit, Input, HostListener } from '@angular/core';
import {Content} from '../data-structures/Content';
import {FormattingService} from '../services/formatting.service';
@Component({
  selector: 'app-content-info',
  templateUrl: './content-info.component.html',
  styleUrls: ['./content-info.component.scss']
})
export class ContentInfoComponent implements OnInit {
  @Input('content') content: Content;
  starnames: string[] = [];
  constructor(
    public formatter: FormattingService,
  ) { }

  ngOnInit() {
    //console.log(this.content);
    this.resetStarname();
    
  }
  ngAfterViewInit(){
    this._UIngOnInit();
  }
  resetStarname(){
    this.starnames = Object.keys(this.content.starnames);
  }
  getStarnameProfileUrl(starname: string){
    let url = this.content.starnames[starname];
    if(url === ''){
      return '/assets/images/photo_not_available.jpg';
    }else{
      return url;
    }
  }

  showDropdown:string = 'none';
  starnamesProfileHeight: string = "94px";
  
  _UIngOnInit(){
      let width = document.getElementById('starnames').clientWidth * 0.95;
      if(width < this.starnames.length * 130 && this.starnamesProfileHeight === '94px'){
        this.starnamesProfileHeight = '94px';
        this.showDropdown = 'down';
      }else if(width < this.starnames.length * 130 && this.starnamesProfileHeight === 'auto'){
        //ignore
      }else{
        this.showDropdown = 'none';
      }
      if(this.showDropdown === 'down' && this.starnamesProfileHeight === '94px'){
        this.starnamesProfileHeight = '94px';
      }else if(this.showDropdown === 'none'){
        this.starnamesProfileHeight = '94px';
      }
  }
   // ui event
  @HostListener('window:resize', ['$event'])
  onResize(event){
     this._UIngOnInit();
  }
  toggleStarProfile(){
    if(this.showDropdown === 'up'){
      this.showDropdown = 'down';
      this.starnamesProfileHeight = '94px';
    }else if(this.showDropdown === 'down'){
      this.starnamesProfileHeight = 'auto';
      this.showDropdown = 'up';
    }
  }

}
