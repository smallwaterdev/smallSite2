import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent} from '@angular/material';
import {Router , NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';
import {MetaService} from '../services/meta.service';
import {FormattingService} from '../services/formatting.service';
import {UrlAnalysisService} from '../services/url-analysis.service';
import {URLEncodedPage} from '../data-structures/URLEncodedPage';
import {Input } from '@angular/core';
@Component({
  selector: 'app-content-nav',
  templateUrl: './content-nav.component.html',
  styleUrls: ['./content-nav.component.scss']
})
export class ContentNavComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private metaService: MetaService,
    public formatter: FormattingService,
    private urlAnalyzer: UrlAnalysisService
  ) { }

  @Input('item-per-page') item_per_page: number;
  
  type_value: string;
  targetSet: Set<string> = new Set<string>();
  routerEvent: Subscription;
  ngOnInit() {
    this.targetSet.add("pornstar");
    this.targetSet.add("category");
    this.targetSet.add("studio");
    this.targetSet.add("director");
    // set according to url
    this.routerEvent = this.router.events.subscribe((evt)=>{
      if(!(evt instanceof NavigationEnd)){
        return;
      }
      this.url2UI(evt.url);
      
    });
    this.url2UI(this.router.url);
  }
  ngOnDestroy(){
    this.routerEvent.unsubscribe();
  }

  url2UI(url: string){
    let pageInfo: URLEncodedPage = this.urlAnalyzer.urlAnalysis(url);
    if(this.targetSet.has(pageInfo.type)){
      this.type_value = pageInfo.value;
    }else{
      this.type_value = null;
    }
  }
}
