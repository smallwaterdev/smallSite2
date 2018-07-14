import { Component, OnInit } from '@angular/core';
import {Content }from '../data-structures/Content';
import { WatchLaterService } from '../services/watch-later.service';
import { FormattingService } from '../services/formatting.service';
import { ScrollingService } from '../services/scrolling.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
@Component({
  selector: 'app-watch-later-list',
  templateUrl: './watch-later-list.component.html',
  styleUrls: ['./watch-later-list.component.scss']
})
export class WatchLaterListComponent implements OnInit {
  playing_id: string = "";
  safeUrl: SafeResourceUrl;
  isMoblie: boolean = false;
  iframe_height= "400px";
  //content_card_img_height = "300px";
  constructor(
    private watchLater: WatchLaterService,
    private sanitizer: DomSanitizer,
    private formatter: FormattingService,
    private scrolling: ScrollingService,
    private media: ObservableMedia
  ) { }
  contents: Content[] = []; 
  ngOnInit() {
    this.media.subscribe((change: MediaChange) => {
      /*switch(change.mqAlias){
        case "xs":{
          this.isMoblie = true ;
          this.content_card_img_height = "300px";
        };break;
        case "sm":{
          this.isMoblie = false ;
          this.content_card_img_height = "200px";
        };break;
        case "md":{
          this.isMoblie = false;
          this.content_card_img_height = "170px";
        };break;
        case "lg":{
          alert('lg');
        };break;
        default:{
          //xl
          alert('xl');
        };break;

      }*/
      if(['xs'].indexOf(change.mqAlias) !== -1){
        this.isMoblie = true;
      }else{
        this.isMoblie = false;
      }
      this.iframe_height = Math.ceil(document.body.clientWidth * 0.6) + 'px';
      //this.content_card_img_height = "200px";
    });
    if(document.body.clientWidth <= 590){
      this.isMoblie = true;
    }else{
      this.isMoblie = false;
    }
    this.iframe_height = Math.ceil(document.body.clientWidth * 0.6) + 'px';
    
    this.scrolling.stopScrolling();
    this.scrolling.goTop();
    this.contents = this.watchLater.getAll();
  }
  removeWatchLater(no: number, id: string){
    this.contents.splice(no, 1);
    this.watchLater.remove(id);
  }
  playVideo(id:string, videoUrl: string){
    if(id !== this.playing_id){
      this.playing_id = id;
      this.getFrameUrl(videoUrl);
    }
  }
  getFrameUrl(videoUrl: string){
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
  }
}
