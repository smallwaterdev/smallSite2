import { Component, OnInit , ViewChild} from '@angular/core';
import { Content, SessionContent , SessionContents} from '../data-structures/Content'; 
import {ContentService} from '../services/content.service';
import {Router, NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormattingService} from '../services/formatting.service';
import {trigger, state, style, animate, transition} from '@angular/animations';
import { EventBridgeService } from '../services/event-bridge.service';
import { ScrollingService } from '../services/scrolling.service';
import { WatchLaterService } from '../services/watch-later.service';
import {FunctionPanelComponent} from '../function-panel/function-panel.component';
// google analytics gtag
declare var gtag: Function;

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit {

  @ViewChild(FunctionPanelComponent)
  private functionPanelComponent: FunctionPanelComponent;

  contents: Content[] = []; 
  item_per_page = 20;
  routerEvent: Subscription;
  isShowSpinner: boolean;
  __spinner_waiter;
  __cancel_spinner: boolean;
  currentSession: string;

  icon_padding:string = '3px';
  icon_opacity = '0.8';
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
    public formatter: FormattingService,
   // private eventBridge: EventBridgeService,
    private scrolling: ScrollingService,
    private watchLater: WatchLaterService
  ) { }
  content_title_length_limit: number = 70;
  subtitle(title){
    if(title && title.length > this.content_title_length_limit){
      return title.substring(0,this.content_title_length_limit);
    }
    return title;
  }
  scroll(){
   // this.scrolling.scrollingToBottom(null, null);
  }

  reportGoogleAnalytics(url: string){
    gtag('config', 'UA-121723672-1', {'page_path': url});
  }
  ngOnInit() {
    // listener and initial update
    this.routerEvent = this.router.events.subscribe((evt)=>{
      if(!(evt instanceof NavigationEnd)){
        return;
      }
      this.scrolling.goTop();
      this.reportGoogleAnalytics(evt.url);
      this.updateContentsByUrl(evt.url);
    });
    this.scrolling.goTop();
    this.reportGoogleAnalytics(this.router.url);
    this.updateContentsByUrl(this.router.url);
  }
  
  updateContentsByUrl(url:string){
    this.startSpinner();
    this.contents=[];
    this.currentSession = url;
    let urls = url.split('/');
    if(urls[1] !== 'list' && urls[1] !== "" && urls[1] !== "search"){
      // category, starname, ...
      this.__updateContentsByUrl(this.currentSession, urls[1], this.router.url);
    }else if(urls[1] === 'search'){
      this.__searchByTitle(this.currentSession, this.router.url);
    }else{
      // list/sort/ ... or, initial
      this.__listUpdateContentsByUrl(this.currentSession, this.router.url); 
    }
  }
  __sessionContentHandler(data: SessionContents){
    if(data && (data.sessionid === this.currentSession)){
      this.cancelSpinner();
      this.contents = data.contents;
      this.functionPanelComponent.contentListFinishLoad();
    }
  }
  __searchByTitle(sessionid: string, url:string){
    // search 
    let urls = url.split('/');
    if(urls.length === 3){
      // /search/title
      this.contentService.searchByTitle(this.currentSession, decodeURIComponent(urls[2]), 0, this.item_per_page).subscribe(
        data=>{this.__sessionContentHandler(data);}
      );
    }else{
      // /search/title/pageno
      this.contentService.searchByTitle(this.currentSession, decodeURIComponent(urls[2]), this.item_per_page * (parseInt(urls[3]) - 1), this.item_per_page).subscribe(
        data=>{this.__sessionContentHandler(data);}
      );
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
  isDisplayPanel: string = "none";
  toggleFunctionPanel(){
    if(this.isDisplayPanel === 'none'){
      this.isDisplayPanel = 'block';
    }else if(this.isDisplayPanel === 'block'){
      this.isDisplayPanel = 'none';
    }
  }
  bodyClick(){
    this.isDisplayPanel = 'none';
  }

  // watch later
  isAddedToWaterLater(id: string){
    return this.watchLater.hasContent(id)
  }
  addToWaterLater(content: Content){
    this.watchLater.store(content);
  }

  scrollingHandler(isScrolling){
    if(isScrolling){
      this.icon_padding = '3px 3px 80px 130px';
      this.icon_opacity = '0.4';
    }else{
      this.icon_padding = '3px';
      this.icon_opacity = '0.8';
    }
  }

}
