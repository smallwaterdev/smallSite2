import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent} from '@angular/material';
import {Router , NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';
import {MetaService} from '../services/meta.service';
import {FormattingService} from '../services/formatting.service';
import {UrlAnalysisService} from '../services/url-analysis.service';
import {URLEncodedPage} from '../data-structures/URLEncodedPage';
@Component({
  selector: 'app-content-page-sort',
  templateUrl: './content-page-sort.component.html',
  styleUrls: ['./content-page-sort.component.scss']
})
export class ContentPageSortComponent implements OnInit {

  selectedSort: string = null;
  pageInfo: URLEncodedPage = null;
  //sort
  support_sorts = [
    {viewValue: "Most Viewed", value: 'view'},
    {viewValue: "Top Rated", value:"rating"},
    {viewValue: "Longest", value:"duration"},
    {viewValue: "Newest", value:"releaseDate"}
  ];

  constructor(
    private router: Router,
    public formatter: FormattingService,
    private urlAnalyzer: UrlAnalysisService
  ) { }

  routerEvent: Subscription;
  ngOnInit() {
    // set according to url
    this.routerEvent = this.router.events.subscribe((evt)=>{
      if(!(evt instanceof NavigationEnd)){
        return;
      }
      this.url2Meta(evt.url);
    });
    this.url2Meta(this.router.url);
  }
  ngOnDestroy(){
    this.routerEvent.unsubscribe();
  }
  
  url2Meta(url: string){
    this.pageInfo = this.urlAnalyzer.urlAnalysis(url);
    if(this.pageInfo.sort !== null){
      this.selectedSort = this.pageInfo.sort;
    }
  }
  sortedBy(evt){
    let segments: string[] = [];
    segments.push(this.pageInfo.type);
    if(this.pageInfo.value){
      segments.push(this.pageInfo.value);
    }
    segments.push(this.selectedSort);
    this.router.navigate(segments);
  }

}
