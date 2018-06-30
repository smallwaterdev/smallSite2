import { Component, OnInit, OnDestroy } from '@angular/core';

import { PageEvent} from '@angular/material';
import {Router , NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';
import {QueryMetaService} from '../services/query-meta.service';
import {FormattingService} from '../services/formatting.service';
@Component({
  selector: 'app-meta-nav',
  templateUrl: './meta-nav.component.html',
  styleUrls: ['./meta-nav.component.scss']
})
export class MetaNavComponent implements OnInit, OnDestroy {

  __metaNameConverter:Object = {};
  constructor(
    private router: Router,
    private queryMetaService: QueryMetaService,
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
  //pagination
  total_num_items = 1000;
  item_per_page = 36;
  pageNumber = 0; // from 0
  routerEvent: Subscription;
  value: string; //list, category, starname
  ngOnInit() {
    this.routerEvent = this.router.events.subscribe((evt)=>{
      if(!(evt instanceof NavigationEnd)){
        return;
      }
      this.url2UI(evt.url);
      this.url2Meta(evt.url);
    });
    this.url2UI(this.router.url);
    this.url2Meta(this.router.url);
  }

  unpdatePage(evt: PageEvent){
    if(this.pageNumber === evt.pageIndex){
      return;
    }
    this.pageNumber = evt.pageIndex;
    let url = [];
    if(this.pageNumber === 0){
      this.router.navigate(['meta',this.value]);
    }else{
      this.router.navigate(['meta',this.value, this.pageNumber + 1]);
    }
  }


  url2Meta(url: string){
    let segments = url.split('/');
    switch(segments.length){
      case 3:
      case 4:{
        this.queryMetaService.queryMetaOnFieldWithValue(this.router.url, 'meta', this.__metaNameConvert(segments[2])).subscribe(data=>{
          if(data.sessionid === this.router.url && data.meta){
            this.total_num_items = data.meta.counter;
          }
        });
      };break;
      default:break;
    }
  }

  url2UI(url: string){
    let segments = url.split('/');
    switch(segments.length){
      case 3:{
        // /
        this.value = segments[2];
        this.pageNumber = 0;
      };break;
      case 4:{
        this.value = segments[2];
        this.pageNumber = parseInt(segments[3]) -1;
      }
      
      default:break;
    }
  }
  ngOnDestroy(){
    this.routerEvent.unsubscribe();
  }

}
