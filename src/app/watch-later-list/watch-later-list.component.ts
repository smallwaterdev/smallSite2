import { Component, OnInit,HostListener } from '@angular/core';
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
    this._UIngOnInit();
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

  //UI
  isMoblie: boolean = false;
  image_width:string= '100%'; // size as grid width
  image_height: string = '125';
  flex_direction:string = 'column';
  // ui function 
  _UIngOnInit(){
    let width = document.body.clientWidth;
    if(width <= 850 && width >= 550){
      this.isMoblie = false;
      this.flex_direction= 'row';
      this.image_width = '200px';
      this.image_height = '112px';
    }else if(width < 550){
      this.isMoblie = true;
      this.flex_direction= 'column';
      this.image_width = '100%';
      this.image_height = Math.ceil(width * 0.6).toString() + 'px';
    }else{
      this.isMoblie = false;
      this.flex_direction= 'column';
      this.image_width = '250px';
      this.image_height = '125px';
    }
  }
  // ui event
  @HostListener('window:resize', ['$event'])
  onResize(event){
    this._UIngOnInit();
  }
}
