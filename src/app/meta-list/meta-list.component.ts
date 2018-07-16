import { Component, OnInit , OnDestroy} from '@angular/core';
import {QueryMetaService} from '../services/query-meta.service';
import { Router, NavigationEnd } from '@angular/router';
import {Meta} from '../data-structures/Meta';
import {FormattingService} from '../services/formatting.service';
import {Subscription} from 'rxjs';
import { ScrollingService } from '../services/scrolling.service';

// google analytics gtag
declare var gtag: Function;

@Component({
  selector: 'app-meta-list',
  templateUrl: './meta-list.component.html',
  styleUrls: ['./meta-list.component.scss']
})
export class MetaListComponent implements OnInit, OnDestroy {
  routerEvent: Subscription;
  metaItems: Meta[];
  type: string;
  __metaNameConverter:Object = {};

  star_profile_url:string;

  getStarProfileUrl(meta:Meta):string{
    if(meta.profile_url){
      return meta.profile_url;
    }else{
      return '/assets/images/photo_not_available.jpg';
    }
  }

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
    private queryMetaService: QueryMetaService,
    private router: Router,
    public formatter: FormattingService,
    private scrolling: ScrollingService
  ) {
    this.__metaNameConverter['category'] = 'genre';
    this.__metaNameConverter['pornstar'] = 'starname';
   }
   __metaNameConvert(name: string){
     let result = this.__metaNameConverter[name];
     if(result){
       return result;
     }else{
       return name;
     }
   }

  ngOnInit() {
    this.routerEvent = this.router.events.subscribe((evt)=>{
      if(!(evt instanceof NavigationEnd)){
        return;
      }
      gtag('config', 'UA-121723672-1', {'page_path': evt.url});
      
      this.scrolling.goTop();
      this.url2MetaList(evt.url);
    });
    gtag('config', 'UA-121723672-1', {'page_path': this.router.url});
    
    this.scrolling.goTop();
    this.url2MetaList(this.router.url);
    
  }
  
  url2MetaList(url: string){
    this.metaItems = [];
    this.startSpinner();
    let segments = url.split('/');
    this.type = segments[2];
    switch(segments.length){
      case 3:{
        this.queryMetaService.queryMetaOnFieldWithoutValue(
          this.router.url, 
          this.__metaNameConvert(segments[2]),
          0, 36
        ).subscribe(data=>{
          if(data.sessionid === this.router.url){
            this.cancelSpinner();
            this.metaItems = data.metas;
          }
        });
      };break;
      case 4:{
        this.queryMetaService.queryMetaOnFieldWithoutValue(
          this.router.url, 
          this.__metaNameConvert(segments[2]),
          (parseInt(segments[3])-1) * 36, 36
        ).subscribe(data=>{
          if(data.sessionid === this.router.url){
            this.cancelSpinner();
            this.metaItems = data.metas;
          }
        });
      };break;
      default:break;
    }
  }
  ngOnDestroy(){
    this.routerEvent.unsubscribe();
  }
  
}
