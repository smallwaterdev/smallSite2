import { Injectable } from '@angular/core';
import { Router , NavigationEnd} from '@angular/router';
// google analytics gtag
declare var $: Function;


@Injectable({
  providedIn: 'root'
})
export class ScrollingService {

  not_supported_scrolling: string[] = ['meta', 'content'];
  immeidate_stop: boolean = false;
  constructor(
    private router: Router
  ) { 
    this.router.events.subscribe((evt)=>{
      if(!(evt instanceof NavigationEnd)){
        return;
      }
      if(this.not_supported_scrolling.indexOf(evt.url.split('/')[1]) !== -1){
        this.immeidate_stop = true;
        //this.stopScrolling();
      }else{
        this.immeidate_stop = false;
      }
    });
  }
  
  scrollingInterval;
  scrollingSpeed: number = 0;
  offset: number = 0;
  isScrolling_: boolean = false;
  generalHandler: Function = null;
  goTop(){
    
    window.scrollTo(0,0);
    this.offset = 0;
    this.stopScrolling();
  }
  stopScrolling(){
    this.isScrolling_ = false;
    clearInterval(this.scrollingInterval);
  }

  // current position
  // callback
  // speed
  
  resetPosition(){
    this.offset = 0;
  }
  setScrollingSpeed(rating: number){
    this.scrollingSpeed = rating;
    if(rating === 0.0){
      this.stopScrolling();
    }
  }
  setCallback(callback: Function){
    this.generalHandler = callback;
  }
  isScrolling():boolean{
    return this.isScrolling_;
  }
  startScrolling(){
    if(this.isScrolling_){
      return;
    }
    this.scrollingInterval = setInterval(()=>{
      if(this.immeidate_stop){
        this.stopScrolling();
      }
      if(document.body.scrollHeight - window.innerHeight <= this.offset){
        this.stopScrolling();
        if(this.generalHandler){
          this.generalHandler();
        }
      }else{
        this.isScrolling_ = true;
        this.offset += this.scrollingSpeed;
        window.scrollTo(0, this.offset);
      }
    }, 10);
  }
  
}
