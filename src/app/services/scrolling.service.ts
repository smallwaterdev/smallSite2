import { Injectable } from '@angular/core';
// google analytics gtag
declare var $: Function;


@Injectable({
  providedIn: 'root'
})
export class ScrollingService {

  constructor() { }
  
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
  resetPosition(){
    this.offset = 0;
  }
  setScrollingSpeed(rating: number){
    this.scrollingSpeed = rating;
  }
  isScrolling():boolean{
    return this.isScrolling_;
  }
  scrollingToBottom(callback:Function){
    this.scrollingInterval = setInterval(()=>{
      if(document.body.scrollHeight - window.innerHeight <= this.offset){
        this.stopScrolling();
        if(callback){
          this.generalHandler = callback;
          callback();
        }
      }else{
        this.isScrolling_ = true;
        this.offset += this.scrollingSpeed;
        window.scrollTo(0, this.offset);
      }
    }, 10);
  }
  restart(){
    this.scrollingInterval = setInterval(()=>{
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
