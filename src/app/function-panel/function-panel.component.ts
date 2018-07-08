import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
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
export class FunctionPanelComponent implements OnInit {

  @Output('scrolling') _scrolling_event = new EventEmitter();
  
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
  
  url2UI(url:string){
    // disable if in content page.

    // reset if autoNext is false
    
  }
  __delayExecOnce(time, func){
    const temp = setInterval(()=>{
      clearInterval(temp);
      func();
    },time);
  }
  contentListFinishLoad(){
    // method trigger by parent, when init/refresh and go to next page
    this.__delayExecOnce(this._delay_image_load, ()=>{
      if(this.isAutoNext){
        if(!this.scrolling.isScrolling()){
          this.scrolling.scrollingToBottom(()=>{
            this.__delayExecOnce(this._delay_next, ()=>{
              if(this.isAutoNext){
                let nextpageUrl = this.pagination.navNextUrl(this.router.url);
                this.router.navigateByUrl(nextpageUrl);
              }
            });
          });
        }
      }
    }); // time to waiting image is load
  }
  autoScroll(num: string){
    let speed = parseFloat(num);
    this.scrolling.setScrollingSpeed(parseFloat(num));
    if(speed > 0){
      //  scrolling 
      this._scrolling_event.emit(true);
    }else if(speed === 0.0){
      //  stop
      this._scrolling_event.emit(false);
    }
    
    if(!this.scrolling.isScrolling()){
      this.scrolling.scrollingToBottom(()=>{
        this.__delayExecOnce(this._delay_next, ()=>{
          if(this.isAutoNext){
            let nextpageUrl = this.pagination.navNextUrl(this.router.url);
            this.router.navigateByUrl(nextpageUrl);
          }
        });
      });
    }
  }
  clearWatchLaterList(){
    this.watchLater.removeAll();
  }
}
