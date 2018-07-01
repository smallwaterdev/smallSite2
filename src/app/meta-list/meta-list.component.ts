import { Component, OnInit , OnDestroy} from '@angular/core';
import {QueryMetaService} from '../services/query-meta.service';
import { Router, NavigationEnd } from '@angular/router';
import {Meta} from '../data-structures/Meta';
import {FormattingService} from '../services/formatting.service';
import {Subscription} from 'rxjs';
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
    public formatter: FormattingService
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
      this.url2MetaList(evt.url);
    });
    this.url2MetaList(this.router.url);
    
  }
  
  url2MetaList(url: string){
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
