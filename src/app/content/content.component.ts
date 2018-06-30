import { Component, OnInit } from '@angular/core';
import { Content } from '../data-structures/Content';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ContentService} from '../services/content.service';
import {ActivatedRoute} from '@angular/router';
import {FormattingService} from '../services/formatting.service';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(
    private sanitizer: DomSanitizer, 
    private contentService: ContentService,
    private route: ActivatedRoute,
    public formatter: FormattingService
  ) { }
  contentId:string;
  content: Content;
  safeUrl: SafeResourceUrl;
  recommend_contents_list: Content[] = [];
  // optimization: one query
  ngOnInit() {
    this.contentId = this.route.snapshot.paramMap.get('id');
    this.contentService.queryById(null, this.contentId).subscribe(data=>{
      if(data){
        this.content = data.content;
        this.getFrameUrl();
        this.contentService.queryRecommendList(null, this.content.starnames, 10).subscribe(list=>{
          this.recommend_contents_list = list.contents;
        });
      }
    });
    
  }
  getFrameUrl(){
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.content.videoUrl);
  }



}
