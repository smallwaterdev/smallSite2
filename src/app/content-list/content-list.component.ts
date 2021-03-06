import { Component, OnInit , ViewChild, HostListener} from '@angular/core';
import { Content , SessionContents} from '../data-structures/Content'; 
import {ContentService} from '../services/content.service';
import {Router, NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormattingService} from '../services/formatting.service';
import { ScrollingService } from '../services/scrolling.service';
import {FunctionPanelComponent} from '../function-panel/function-panel.component';
import {ItemPerPage} from '../services/config';
import {UrlAnalysisService} from '../services/url-analysis.service';
import { URLEncodedPage } from '../data-structures/URLEncodedPage';
import {ContentNavComponent} from '../content-nav/content-nav.component';
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
  @ViewChild(ContentNavComponent)
  private contentNav: ContentNavComponent;
  contents: Content[] = []; 
  item_per_page = ItemPerPage;
  routerEvent: Subscription;
  isShowSpinner: boolean;
  currentSession: string;
  pageInfo: URLEncodedPage;

  __spinner_waiter;
  __cancel_spinner: boolean;


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
    private scrolling: ScrollingService,
    private urlAnalyzer: UrlAnalysisService
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
    this._UIngOnInit();
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
  __sessionContentHandler(data: SessionContents){
    if(data && (data.sessionid === this.currentSession)){
      this.cancelSpinner();
      this.contents = data.contents;
      this.functionPanelComponent.contentListFinishLoad();
      if(this.contents.length === 0){
        alert('Sorry, we found nothing.')
      }
    }
  }
  updateContentsByUrl(url:string){
    this.startSpinner();
    this.contents=[];
    this.currentSession = url;
    this.pageInfo = this.urlAnalyzer.urlAnalysis(url);
    this.contentNav.url2Meta(this.pageInfo);

    switch(this.pageInfo.type){
      case "search":{
        this.UpdateContentsBySearch(this.currentSession,this.pageInfo);
      };break;
      case "list":{
        this.UpdateContentsByList(this.currentSession, this.pageInfo); 
      };break;
      case "pornstar":
      case "studio":
      case "director":
      case "category":{
        this.updateContentsByOthers(this.currentSession, this.pageInfo);
      };break;

      default:{
        // meta, waterlater, content
      };break;
    }
  }

  UpdateContentsBySearch(sessionid: string, pageInfo:URLEncodedPage){
    // search 
    this.contentService.searchByTitle(
      sessionid, 
      decodeURIComponent(pageInfo.value), 
      this.item_per_page * (pageInfo.page - 1), 
      this.item_per_page).subscribe(
        data=>{this.__sessionContentHandler(data);}
    );
  }

  updateContentsByOthers(sessionid: string, pageInfo: URLEncodedPage){
    // category, pornstars, studio, director

    const field_converter = {};
    field_converter['category'] = 'genre';
    field_converter['pornstar'] = 'starname';
    
    let input_field = field_converter[this.pageInfo.type];
    if(input_field === undefined){
      input_field = this.pageInfo.type;
    }
    // sessionId, field, value, sort
    this.contentService.queryContents(
      sessionid, 
      input_field, 
      decodeURIComponent(pageInfo.value), 
      pageInfo.sort,
      (pageInfo.page-1) * this.item_per_page, 
      this.item_per_page).subscribe(
      data=>{this.__sessionContentHandler(data);}
    );
  }


  UpdateContentsByList(sessionid:string, pageInfo:URLEncodedPage){
    this.contentService.quickQuery(
      sessionid, 
      pageInfo.sort, 
      (pageInfo.page - 1) * this.item_per_page, 
      this.item_per_page
      ).subscribe(data=>{this.__sessionContentHandler(data);
    });
  }

  
  ngOnDestroy(){
    this.routerEvent.unsubscribe();
  }

  // UI
  isDisplayPanel: string = "none";
  image_width:number= -1; // size as grid width
  image_height: number = 125;
  enlargeWatchLater: boolean = false;
  flex_direction:string= 'column';
  //num_column: number = 1;
  // ui setting
  _UIngOnInit(){
    let width = document.body.clientWidth;
    if(width <= 850 && width >= 550){
      this.flex_direction= 'row';
      this.image_width = 200;
      this.image_height = 112;
    }else if(width < 550){
      this.flex_direction= 'column';
      this.image_width = -1;
      this.image_height = Math.ceil(width * 0.6);;
    }else{
      this.flex_direction= 'column';
      this.image_width = -1;
      this.image_height = 125;//Math.ceil(250 * 0.5);
    }
  }
  // ui event
  @HostListener('window:resize', ['$event'])
  onResize(event){
    this._UIngOnInit();
  }

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
  scrollingHandler(isScrolling:boolean){
    if(isScrolling){
      this.enlargeWatchLater = true;
    }else{
      this.enlargeWatchLater = false;
    }
  }
  

}
