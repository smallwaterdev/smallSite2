import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,of} from 'rxjs';
import { Content, SessionContent, SessionContents } from '../data-structures/Content';
import {smallData_user_addr, urlPrefix} from './config';
import {LocalCacheService} from './local-cache.service';
import { WatchLaterService } from './watch-later.service';
@Injectable({
  providedIn: 'root'
})
export class ImageUrlService {

  constructor(
    private http: HttpClient,
    private localCache: LocalCacheService,
    private watchLater: WatchLaterService
  ) { 
    console.log('[ContentService] New Service Created');
  }

  isInit: boolean = false;
  isOk:boolean = false;
  init(){
    this.http.get<Object>('https://www.google.com').subscribe({
      next: data=>{},
      complete: ()=>{},
      error: err=>{}
    });
  }
  getImageUrl(url){
    if(this.isInit){

    }else{
      this.init();
    }
  }
}
