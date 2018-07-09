import { Component, OnInit, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import {ScrollingService} from '../services/scrolling.service';
import {Router} from '@angular/router';
import { PaginationService } from '../services/pagination.service';
import { EventBridgeService } from '../services/event-bridge.service';
import { WatchLaterService } from '../services/watch-later.service';
@Component({
  selector: 'app-function-panel',
  templateUrl: './function-panel.component.html',
  styleUrls: ['./function-panel.component.scss']
})
export class FunctionPanelComponent implements OnInit, OnDestroy {

  @Output('scrolling') _scrolling_event = new EventEmitter();
  speed: number = 0;
  destoried: boolean = false;
  constructor(
    public scrolling: ScrollingService,
    private router: Router,
    private pagination: PaginationService,
    private eventBridge: EventBridgeService,
    private watchLater: WatchLaterService
  ) { }
  isAutoNext :boolean = false;
  _delay_next = 1000;
  _delay_image_load = 3000;
  ngOnInit() {
    // re-enable listen item

  }
  ngOnDestroy(){
    this.destoried = true;
  }
  
  url2UI(url:string){
    
  }
  __delayExecOnce(time, func){
    const temp = setInterval(()=>{
      clearInterval(temp);
      if(!this.destoried){
        func();
      }
    },time);
  }
  contentListFinishLoad(){
    // method trigger by parent, when init/refresh and go to next page
    this.__delayExecOnce(this._delay_image_load, ()=>{
      
      this.scrolling.setScrollingSpeed(this.speed);
      if(this.speed > 0){
        this.scrolling.startScrolling();
      }else{
        this.scrolling.stopScrolling();
      }
    });
  }
  autoScroll(){
    // update speed
    this.scrolling.setScrollingSpeed(this.speed);
    this.scrolling.setCallback(()=>{
      this.__delayExecOnce(this._delay_next, ()=>{
        if(this.isAutoNext){
          let nextpageUrl = this.pagination.navNextUrl(this.router.url);
          this.router.navigateByUrl(nextpageUrl);
        }else{
          this.speed = 0;
        }
      });
    });
    if(this.speed > 0){
      //  scrolling 
      this._scrolling_event.emit(true);
      this.scrolling.startScrolling();
    }else if(this.speed === 0.0){
      //  stop
      this._scrolling_event.emit(false);
      this.scrolling.stopScrolling();
    }  
  }

  clearWatchLaterList(){
    this.watchLater.removeAll();
  }
}
