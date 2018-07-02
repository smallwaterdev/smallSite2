import { Component, OnInit, OnDestroy } from '@angular/core';
import { Content } from '../data-structures/Content';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ContentService} from '../services/content.service';
import {ActivatedRoute,Router, NavigationEnd} from '@angular/router';
import {FormattingService} from '../services/formatting.service';
import {Subscription} from 'rxjs';
// google analytics gtag
declare var gtag: Function;

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnDestroy {

  constructor(
    private sanitizer: DomSanitizer, 
    private contentService: ContentService,
    private route: ActivatedRoute,
    public formatter: FormattingService,
    private router: Router
  ) { }
  contentId:string;
  content: Content;
  safeUrl: SafeResourceUrl;
  recommend_contents_list: Content[] = [];
  routerEvent: Subscription;
  // optimization: one query
  ngOnInit() {
    this.routerEvent = this.router.events.subscribe((evt)=>{
      if(!(evt instanceof NavigationEnd)){
        return;
      }
      gtag('config', 'UA-121723672-1', {'page_path': evt.url});
      this.url2Content(evt.url);
    });
    gtag('config', 'UA-121723672-1', {'page_path': this.router.url});
    this.url2Content(this.router.url);
  }
  getFrameUrl(){
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.content.videoUrl);
  }
  url2Content(url: string){
    this.contentId = url.split('/')[2];
    this.contentService.queryById(null, this.contentId).subscribe(data=>{
      if(data){
        this.content = data.content;
        this.getFrameUrl();
        this.contentService.queryRecommendList(null, this.content._id, 10).subscribe(list=>{
          this.recommend_contents_list = list.contents;
        });
      }
    });
  }
  ngOnDestroy(){
    if(this.routerEvent){
      this.routerEvent.unsubscribe();
    }
  }
}
