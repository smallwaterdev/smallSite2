import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventBridgeService {
  events: Map<string, [Function]> = new Map();
  constructor() { }

  // event only emit 
  listenEvent(name: string, callback:Function){
    if(this.events.has(name)){
      this.events.get(name).push(callback);
    }else{
      this.events.set(name, [callback]);
    }
  }
  emitEvent(name: string){
    let arr = this.events.get(name);
    if(arr && arr.length > 0){
      for(let f of arr){
        f();
      }
    }
    this.events.delete(name);
  }
}
