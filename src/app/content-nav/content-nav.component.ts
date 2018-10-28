import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent} from '@angular/material';
import {Router , NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';
import {MetaService} from '../services/meta.service';
import {FormattingService} from '../services/formatting.service';
import {UrlAnalysisService} from '../services/url-analysis.service';
import {URLEncodedPage} from '../data-structures/URLEncodedPage';
import {Input, ViewChild } from '@angular/core';
import {ContentPageNavComponent} from '../content-page-nav/content-page-nav.component';
import {ContentPageSortComponent} from '../content-page-sort/content-page-sort.component';
@Component({
  selector: 'app-content-nav',
  templateUrl: './content-nav.component.html',
  styleUrls: ['./content-nav.component.scss']
})
export class ContentNavComponent implements OnInit {
  @Input('item-per-page') item_per_page: number;
  @ViewChild(ContentPageNavComponent) pageNav:ContentPageNavComponent;
  @ViewChild(ContentPageSortComponent) pageSort: ContentPageSortComponent;
  type_value: string;
  pageInfo: URLEncodedPage;
  targetSet: Set<string>; 

  constructor(
    private router: Router,
    private metaService: MetaService,
    public formatter: FormattingService,
    private urlAnalyzer: UrlAnalysisService
  ) { 
    this.targetSet = new Set<string>();
    this.targetSet.add("pornstar");
    this.targetSet.add("category");
    this.targetSet.add("studio");
    this.targetSet.add("director");
  }

  
  ngOnInit() {
    
  }
 

  url2Meta(pageInfo: URLEncodedPage){
    this.pageInfo = pageInfo;
    if(this.targetSet.has(this.pageInfo.type)){
      this.type_value = this.pageInfo.value;
    }else{
      this.type_value = null;
    }
    this.pageNav.url2Meta(this.pageInfo);
    this.pageSort.url2Meta(this.pageInfo);
  }
}
