import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SessionMeta, SessionMetas, Meta} from '../data-structures/Meta';
import {smallData_user_addr, urlPrefix} from './config';
@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class MetaService {

  smallData_user_addr:string = smallData_user_addr + urlPrefix;
  constructor(private http: HttpClient) { 
    console.log('[MetaService] New Service Created');
  }
  reportError(name, object){
    //alert(name + JSON.stringify(object));
  }
  
  __handlerSessionMetaGenerator(sessionId: string, observer){
    let httpObserver = {
      next: data=>{
       if(data.success){
        observer.next({sessionid: sessionId, meta: data.value[0]});
       }else{
        observer.next({sessionid: sessionId, meta: null});
        this.reportError(sessionId, data);
       }
      },
      error:err=>{
        observer.next({sessionid: sessionId, meta: null});
        this.reportError(sessionId ,err.message);
      }
    };
    return httpObserver;
  }
  queryMeta(sessionId: string, field: string, value: string): Observable<SessionMeta>{
    const queryMeta = new Observable<SessionMeta>(observable=>{
      const queryUrl = `${this.smallData_user_addr}/meta/query`;
      const body = {condition:{ field: field, name: value }};
      this.http.post<Object>(queryUrl, body, {withCredentials: true}).subscribe(this.__handlerSessionMetaGenerator(sessionId, observable));
      return {unsubscribe(){}};
    });
    return queryMeta;
  }
  __handlerSessionMetasGenerator(sessionId: string, observer){
    let httpObserver = {
      next: data=>{
       if(data.success){
        observer.next({sessionid: sessionId, metas: data.value});
       }else{
        observer.next({sessionid: sessionId, metas: null});
        this.reportError(sessionId, data);
       }
      },
      error:err=>{
        observer.next({sessionid: sessionId, metas: null});
        this.reportError(sessionId,err.message);
      }
    };
    return httpObserver;
  }
  queryMetas(sessionId: string, field: string, from: number, limit: number): Observable<SessionMetas>{
    const queryMetas = new Observable<SessionMetas>(observable=>{
      const queryUrl = `${this.smallData_user_addr}/meta/query`;
      const body = {
        condition:{ field: field},
        option:{ skip: from, limit: limit, sort:{name:1}}
      };
      this.http.post<Object>(queryUrl, body, {withCredentials: true}).subscribe(this.__handlerSessionMetasGenerator(sessionId, observable));
      return {unsubscribe(){}};
    });
    return queryMetas;
  }
}
