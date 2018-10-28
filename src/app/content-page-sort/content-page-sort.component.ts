import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent} from '@angular/material';
import {Router , NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';
import {MetaService} from '../services/meta.service';
import {FormattingService} from '../services/formatting.service';
import {UrlAnalysisService} from '../services/url-analysis.service';
import {URLEncodedPage} from '../data-structures/URLEncodedPage';
import {Input} from '@angular/core';
@Component({
  selector: 'app-content-page-sort',
  templateUrl: './content-page-sort.component.html',
  styleUrls: ['./content-page-sort.component.scss']
})
export class ContentPageSortComponent implements OnInit {

  selectedSort: string = null;
  pageInfo: URLEncodedPage;
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
  ) { }


  ngOnInit() {
    
  }
  
  url2Meta(pageInfo: URLEncodedPage){
    this.pageInfo = pageInfo;
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
