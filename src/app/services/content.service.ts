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

export class ContentService {
  
  smallData_user_addr:string = smallData_user_addr + urlPrefix;
  
  constructor(
    private http: HttpClient,
    private localCache: LocalCacheService,
    private watchLater: WatchLaterService
  ) { 
    console.log('[ContentService] New Service Created');
  }
  
  reportError(object){
   //console.log(JSON.stringify(object));
  }

  __generateSessionContentsHandler(sessionId, isCache, observable){
    return {
      next: data=>{
        if(data.success){
          if(isCache){
            this.localCache.storeContentList(sessionId, data.value);
          }
          observable.next({sessionid : sessionId,contents: data.value});
        }else{
          observable.next({sessionid: sessionId, contents: null});
          this.reportError(data);
        }
      },
      error: err=>{
        observable.next({sessionid: sessionId, contents: null});
        this.reportError(err.message);
      }
    }
  }
  /**
   * each query has a sessionid to let the program know the returned value is the program desired value.
   * One practice is to set the sessionid to the url
   * @param sessionid 
   * @param sort 
   * @param skip 
   * @param limit 
   */  
  quickQuery(sessionid: string, sort: string, skip: number, limit: number): Observable<SessionContents>{
    let contents = this.localCache.getContentListByUrl(sessionid);
    if(contents){
      return of({sessionid: sessionid, contents: contents});
    }else{
      const quickQueryContent: Observable<SessionContents> = new Observable((observable)=>{
        const httpObserver = this.__generateSessionContentsHandler(sessionid, true, observable);
        /////// query now ///////////
        let queryUrl = `${this.smallData_user_addr}/content/query`;
        let sort_ = {};
        sort_[sort] = -1;
        let option_ = {skip: skip, limit: limit, sort: sort_};
        this.http.post<Content[]>(queryUrl, {option: option_}).subscribe(httpObserver);
      });
      return quickQueryContent;
    }
  }
  

  queryContents(sessionid: string, field: string, value: string, sort: string, skip:number, limit:number): Observable<SessionContents>{
    let contents = this.localCache.getContentListByUrl(sessionid);
    if(contents){
      return of({sessionid: sessionid, contents: contents});
    }else{
      const queryContent: Observable<SessionContents> = new Observable((observable)=>{
        const httpObserver = this.__generateSessionContentsHandler(sessionid, true, observable);
        /////// query now ///////////
        let queryUrl = `${this.smallData_user_addr}/content/query`;
        let condition_ = {};
        condition_[field] = value;
        let sort_ = {};
        sort_[sort] = -1;
        let option_ = {skip: skip, limit: limit, sort: sort_};
        this.http.post<Content[]>(queryUrl, {condition: condition_, option: option_}).subscribe(httpObserver);
      });
      return queryContent;
    }
  }
    
  queryContentById(sessionid:string, id:string): Observable<SessionContent>{
    let content = this.localCache.getContentById(id);
    if(content){
      return of({sessionid: sessionid, content:content});
    }
    let content_ = this.watchLater.get(id);
    if(content_){
      return of({sessionid: sessionid, content:content_});
    }else{
      const queryByIdHttp: Observable<SessionContent> = new Observable((observable)=>{
        const httpObserver = {
          next: data=>{
            if(data.success){
              observable.next({sessionid : sessionid,content: data.value[0]});
            }else{
              observable.next({sessionid: sessionid, content: null});
              this.reportError(data);
            }
          },
          error: err=>{
            observable.next({sessionid: sessionid, content: null});
            this.reportError(err.message);
          }
        }
        /////// query now ///////////
        let queryUrl = `${this.smallData_user_addr}/content/query`;
        let condition_ = {"_id": id};
        this.http.post<Content[]>(queryUrl, {condition: condition_}).subscribe(httpObserver);
        
      });
      return queryByIdHttp;
    }
  }

  queryRecommendList(sessionid: string ,id: string, num: number): Observable<SessionContents>{
    const recommendContent: Observable<SessionContents> = new Observable((observable)=>{
      const httpObserver = this.__generateSessionContentsHandler(sessionid, false, observable);
      /////// query now ///////////
      let queryUrl = `${this.smallData_user_addr}/content/recommend/${id}`;
      let option_ = {limit: num};
      this.http.post<Content[]>(queryUrl, option_).subscribe(httpObserver);
    });
    return recommendContent;
  }

  searchByTitle(sessionid: string, title:string, from: number, limit: number): Observable<SessionContents>{
    const searchContents: Observable<SessionContents> = new Observable((observable)=>{
      const httpObserver = this.__generateSessionContentsHandler(sessionid, false, observable);
      /////// query now ///////////
      let queryUrl = `${this.smallData_user_addr}/content/search`;
      this.http.post<Content[]>(queryUrl, {title: title, skip: from, limit: limit}).subscribe(httpObserver);
    });
    return searchContents;
  }
}

