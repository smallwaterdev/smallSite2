import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SessionMeta, SessionMetas, Meta} from '../data-structures/Meta';
import {smallData_user_addr, urlPrefix} from './config';
@Injectable({
  providedIn: 'root'
})
export class QueryMetaService {

  smallData_user_addr:string = smallData_user_addr + urlPrefix;
  constructor(private http: HttpClient) { 
    console.log('[MetaService] New Service Created');
  }
  reportError(name, object){
    alert(name + JSON.stringify(object));
  }
  
  __handlerSessionMetaGenerator(sessionId: string, observer){
    let httpObserver = {
      next: data=>{
       if(data.success){
        observer.next({sessionid: sessionId, meta: data.value});
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
  queryMetaOnFieldWithoutValue(sessionId: string, field: string, from: number, limit: number): Observable<SessionMetas>{
    const queryMeta = new Observable<SessionMetas>(observable=>{
      const queryUrl = `${this.smallData_user_addr}/querymeta/${field}/${from}/${limit}`;
      this.http.get<Object>(queryUrl).subscribe(this.__handlerSessionMetasGenerator(sessionId, observable));
      return {unsubscribe(){}};
    });
    return queryMeta;
  }
  
  queryMetaOnFieldWithValue(sessionId: string, field: string, value: string): Observable<SessionMeta>{
    const queryMeta = new Observable<SessionMeta>(observable=>{
      console.log(field, value);
      const queryUrl = `${this.smallData_user_addr}/querymeta/${field}/${value}`;
      this.http.get<Object>(queryUrl).subscribe(this.__handlerSessionMetaGenerator(sessionId, observable));
      return {unsubscribe(){}};
    });
    return queryMeta;
  }
}
