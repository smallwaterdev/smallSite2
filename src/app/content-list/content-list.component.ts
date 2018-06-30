import { Component, OnInit } from '@angular/core';
import { Content, SessionContent , SessionContents} from '../data-structures/Content'; 
import {ContentService} from '../services/content.service';
import {Router, NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormattingService} from '../services/formatting.service';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit {

  contents: Content[] = []; 
  item_per_page = 20;
  routerEvent: Subscription;
  isShowSpinner: boolean;
  __spinner_waiter;
  __cancel_spinner: boolean;
  currentSession: string;
  startSpinner(){
    this.__cancel_spinner = false;
    this.__spinner_waiter = setInterval(()=>{
      if(!this.__cancel_spinner){
        this.isShowSpinner = true;
      }
    }, 1000);

  }
  cancelSpinner(){
    clearInterval(this.__spinner_waiter);
    this.__cancel_spinner = true;
    this.isShowSpinner = false;
  }

  constructor(
    private contentService: ContentService,
    private router: Router,
    private formatter: FormattingService
  ) { }
  content_title_length_limit: number = 70;
  subtitle(title){
    if(title && title.length > this.content_title_length_limit){
      return title.substring(0,this.content_title_length_limit);
    }
    return title;
  }
  ngOnInit() {
    // listener and initial update
    this.routerEvent = this.router.events.subscribe((evt)=>{
      if(!(evt instanceof NavigationEnd)){
        return;
      }
      this.updateContentsByUrl(evt.url);
    });
    this.updateContentsByUrl(this.router.url);
    
    
  }
  updateContentsByUrl(url:string){
    this.startSpinner();
    this.contents=[];
    this.currentSession = url;
    if(url.split('/')[1] !== 'list' && url.split('/')[1] !== ""){
      this.__updateContentsByUrl(this.currentSession, url.split('/')[1], this.router.url);
    }else{
      this.__listUpdateContentsByUrl(this.currentSession, this.router.url); 
    }
  }
  __sessionContentHandler(data: SessionContents){
    if(data && (data.sessionid === this.currentSession)){
      this.cancelSpinner();
      this.contents = data.contents;
    }
  }
  __updateContentsByUrl(sessionid: string, field: string, url: string){
    let segments = url.split('/');
    const field_converter = {};
    field_converter['category'] = 'genre';
    field_converter['pornstar'] = 'starname';
    
    let input_field = field_converter[field];
    if(input_field === undefined){
      input_field = field;
    }
    
    if(segments.length === 5){
      parseInt(segments[4]);
      this.contentService.queryContents( sessionid, input_field, segments[2], segments[3],(parseInt(segments[4])-1) * this.item_per_page, this.item_per_page).subscribe(
        data=>{this.__sessionContentHandler(data);}
      )
    }else{
      this.contentService.queryContents(sessionid,input_field, segments[2], segments[3], undefined, undefined).subscribe(
        data=>{this.__sessionContentHandler(data);}
      )
    }
  }


  __listUpdateContentsByUrl(sessionid:string, url:string){
    let segments = url.split('/');
    if(segments.length === 2){
      // 
      this.contentService.quickQuery(sessionid, 'releaseDate', 0, this.item_per_page).subscribe(data=>{this.__sessionContentHandler(data);});
    }else if(segments.length === 3){
      // /list/view
      this.contentService.quickQuery(sessionid, segments[2], 0, this.item_per_page).subscribe(data=>{this.__sessionContentHandler(data);});
    }else if(segments.length === 4){
      // /list/view/10
      this.contentService.quickQuery(sessionid, segments[2], (parseInt(segments[3])-1) * this.item_per_page, this.item_per_page).subscribe(data=>{this.__sessionContentHandler(data);});
    }
  }
  ngOnDestroy(){
    this.routerEvent.unsubscribe();
  }
}
