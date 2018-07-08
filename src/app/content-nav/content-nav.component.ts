import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent} from '@angular/material';
import {Router , NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';
import {QueryMetaService} from '../services/query-meta.service';
import {FormattingService} from '../services/formatting.service';

@Component({
  selector: 'app-content-nav',
  templateUrl: './content-nav.component.html',
  styleUrls: ['./content-nav.component.scss']
})
export class ContentNavComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private queryMetaService: QueryMetaService,
    public formatter: FormattingService
  ) { }

  selectedSort: string;
  //sort
  DEFAULT_SORT: string = "releaseDate";
  support_sorts = [
    {viewValue: "Most Viewed", value: 'view'},
    {viewValue: "Top Rated", value:"rating"},
    {viewValue: "Longest", value:"duration"},
    {viewValue: "Newest", value:"releaseDate"}
  ];
  sortedBy(evt){
    // two way binding
    this.pageNumber = 0;
    if(this.type === 'list'){
      this.router.navigate(['list', this.selectedSort]);
    }else{
      this.router.navigate([this.type, this.type_value, this.selectedSort]);
    }
    
  }
  //pagination
  total_num_items = 10000;
  item_per_page = 20;
  pageNumber = 0; // from 0
  // pagination
  unpdatePage(evt: PageEvent){
    if(this.pageNumber === evt.pageIndex){
      return;
    }
    this.pageNumber = evt.pageIndex;
    let url = [];
    
    if(this.type === 'list'){
      url.push('list');
      url.push(this.selectedSort);
    }else if(this.type === 'search'){
      url.push('search');
      url.push(this.type_value);
    }else{
      url.push(this.type);
      url.push(this.type_value);
      url.push(this.selectedSort);
    }
    if(this.pageNumber !== 0){
      url.push(this.pageNumber+1);
    }
    this.router.navigate(url);
  }

  // type
  type: string; //list, category, starname
  type_value: string;

  routerEvent: Subscription;
  ngOnInit() {
    // set according to url
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

  url2Meta(url: string){
    let segments = url.split('/');
    switch(segments.length){
      case 2:{
        this.queryMetaService.queryMetaOnFieldWithValue(url, "meta", "total").subscribe(data=>{
          if(data.sessionid === this.router.url && data.meta){
            // its current url
            this.total_num_items = data.meta['counter'];
          }
        });
      };break;
      case 5:
      case 4:
      case 3:{
        // /list/view, /category/big-tits, /starname/xxx
        
        switch(segments[1]){
          case "list":{
            this.queryMetaService.queryMetaOnFieldWithValue(url, "meta", "total").subscribe(data=>{
              if(data.sessionid === this.router.url){
                // its current url
                this.total_num_items = data.meta['counter'];
              }
            });
          };break;
          case "search":{
            this.total_num_items = 100;
          };break;
          default:{
            const name_converter = {};
            name_converter['category'] = 'genre';
            name_converter['pornstar'] = 'starname';
            let field = name_converter[segments[1]];
            if(field === undefined){
              field = segments[1];
            }
            this.queryMetaService.queryMetaOnFieldWithValue(url, field, segments[2]).subscribe(data=>{
              if(data.sessionid === this.router.url){
                // its current url
                this.total_num_items = data.meta['counter'];
              }
            });
          };break;
        }
      };break;
      
      default:break;
    }
  }

  url2UI(url: string){
    let segments = url.split('/');
    switch(segments.length){
      case 2:{
        // /
        this.type = 'list';
        this.type_value = null;
        this.selectedSort = this.DEFAULT_SORT;
        this.pageNumber = 0;
      };break;
      case 3:{
       
        if(segments[1] === 'search'){
           // /search/title
          this.type = 'search';
          this.type_value = decodeURIComponent(segments[2]);
          this.selectedSort = this.DEFAULT_SORT;
          this.pageNumber = 0;

        }else{
           // /list/view, /category/big-tits, /starname/xxx
          this.pageNumber = 0;
          this.type = segments[1];
          switch(segments[1]){
            case "list":{
              this.selectedSort = segments[2];
              this.type_value = null;
            };break;
            default:{
              this.type_value = decodeURIComponent(segments[2]);
              this.selectedSort = this.DEFAULT_SORT;
            };break;
          }
        }
      };break;
      case 4:{
        // /list/view/10, /search/title/10, /category/big-tits/sort, /starname/xxx/sort
        this.type = segments[1];
        switch(segments[1]){
          case "list":{
            this.selectedSort = segments[2];
            this.type_value = null;
            this.pageNumber = parseInt(segments[3])-1;
          };break;
          case "search":{
           // this.selectedSort = segments[2];
            this.type_value = decodeURIComponent(segments[2]);
            this.pageNumber = parseInt(segments[3])-1;
          };break;
          default:{
            this.type_value = decodeURIComponent(segments[2]);
            this.selectedSort = segments[3];
            this.pageNumber = 0;
          };break;
        }
      };break;
      case 5:{
        // /category/big-tits/sort/10, /starname/xxx/sort/10
        this.type = segments[1]; 
        this.type_value = decodeURIComponent(segments[2]);
        this.selectedSort = segments[3];
        this.pageNumber = parseInt(segments[4])-1;
      };break;
      default:break;
    }
  }
  
  ngOnDestroy(){
    this.routerEvent.unsubscribe();
  }

}
