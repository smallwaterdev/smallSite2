import { Component, OnInit } from '@angular/core';
import {Input} from "@angular/core";
import {Router , NavigationEnd} from '@angular/router';
import {MetaService} from '../services/meta.service';
import {Subscription} from 'rxjs';
import {UrlAnalysisService} from '../services/url-analysis.service';
import {URLEncodedPage} from '../data-structures/URLEncodedPage';
import {PaginationLength} from '../services/config';
@Component({
  selector: 'app-content-page-nav',
  templateUrl: './content-page-nav.component.html',
  styleUrls: ['./content-page-nav.component.scss']
})
export class ContentPageNavComponent implements OnInit {
  pages : number[] = [];
  number_shown_pages: number = PaginationLength;
  selected_page : number = 1;
  random_page: number = 1;
  pageInfo: URLEncodedPage;
  url_prefix: string = "/list/releaseDate/";

  @Input("item-per-page") item_per_page;
  total_num_items: number = 1;
  total_page: number = Math.ceil(this.total_num_items / this.item_per_page);
  constructor(
    private metaService: MetaService,
    private router: Router,
    private urlAnalyzer: UrlAnalysisService
  ) { }

  ngOnInit() {
    
  }

  url2Meta(pageInfo: URLEncodedPage){
    this.pageInfo = pageInfo;
    // obtain the url_prefix, selected_page and total_item_number
    if(this.pageInfo === null){
      return;
    }
    switch(this.pageInfo.type){
      // list, search, meta, content category, pornstar, director, studio, waterlater
      case "list":{
        this.metaService.queryMeta(this.router.url, "meta", "total").subscribe(data=>{
          if(this.router.url === data.sessionid && data.meta){
            // set result
            this.total_num_items = data.meta['counter'];
            this.url_prefix = `/list/${this.pageInfo.sort}/`;
            this.selected_page = this.pageInfo.page;
            this.total_page = Math.ceil(this.total_num_items / this.item_per_page);
            this.generatePageArray();
          }
        });
      };break;
      case "search":{
        this.total_num_items = 100;
        this.url_prefix = `/search/${this.pageInfo.value}/`;
        this.selected_page = this.pageInfo.page;
        this.total_page = Math.ceil(this.total_num_items / this.item_per_page);
        this.generatePageArray();
      };break;
      case "meta":{
        const name_converter = {};
        name_converter['category'] = 'genre';
        name_converter['pornstar'] = 'starname';
        let value = name_converter[this.pageInfo.value];
        if(value === undefined){
          value = this.pageInfo.value;
        }
        this.metaService.queryMeta(this.router.url, 'meta', value).subscribe(data=>{
          if(data.sessionid === this.router.url && data.meta){
            // 
            this.total_num_items = data.meta['counter'];
            this.url_prefix = `/${this.pageInfo.type}/${this.pageInfo.value}/`;
            this.selected_page = this.pageInfo.page;
            this.total_page = Math.ceil(this.total_num_items / this.item_per_page);
            this.generatePageArray();
          }
        });
      };break;
      case "category":
      case "pornstar":
      case "director":
      case "studio":{
        const name_converter = {};
        name_converter['category'] = 'genre';
        name_converter['pornstar'] = 'starname';
        let field = name_converter[this.pageInfo.type];
        if(field === undefined){
          field = this.pageInfo.type;
        }
        this.metaService.queryMeta(this.router.url, field, decodeURIComponent(this.pageInfo.value)).subscribe(data=>{
          if(data.sessionid === this.router.url){
            //
            this.total_num_items = data.meta['counter'];
            this.url_prefix = `/${this.pageInfo.type}/${this.pageInfo.value}/${this.pageInfo.sort}/`;
            this.selected_page = this.pageInfo.page;
            this.total_page = Math.ceil(this.total_num_items / this.item_per_page);
            this.generatePageArray();
          }
        });
      };break;
      default:{
        //waterlater and content do not involve pagination
      };break;
    }
    
  }

  generatePageArray(){
    // generate page array
    let left = Math.ceil(this.selected_page - this.number_shown_pages / 2);
    if(left < 1){
      left = 1;
    }
    let tmp: number[] = [];
    for(let i = 0; i < this.number_shown_pages; i++){
      if(i + left > this.total_page){
        break;
      }
      tmp.push(i + left);
    }
    this.pages = tmp;
  }
  pickRandom(){
    let segments = this.url_prefix.split('/')
    segments = segments.slice(1, segments.length);
    segments[segments.length - 1] = Math.ceil(Math.random() * this.total_page).toString();
    this.router.navigate(segments);
  }
  

}
