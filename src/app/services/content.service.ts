import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Content, SessionContent, SessionContents } from '../data-structures/Content';

@Injectable({
  providedIn: 'root'
})

export class ContentService {
  
  smallData_user_addr:string = "192.168.1.100:3000";
  constructor(private http: HttpClient) { 
    console.log('[ContentService] New Service Created');
  }
  reportError(object){
    alert(JSON.stringify(object));
  }
  /**
   * each query has a sessionid to let the program know the returned value is the program desired value.
   * One practice is to set the sessionid to the url
   * @param sessionid 
   * @param sort 
   * @param skip 
   * @param limit 
   */  
  quickQuery(sessionid: string, sort, skip, limit): Observable<SessionContents>{
    const quickQueryContent: Observable<SessionContents> = new Observable((observable)=>{
      const httpObserver = {
        next: data=>{
          if(data.success){
            observable.next({sessionid : sessionid,contents: data.value});
          }else{
            observable.next({sessionid: sessionid, contents: null});
            this.reportError(data);
          }
        },
        error: err=>{
          observable.next({sessionid: sessionid, contents: null});
          this.reportError(err.message);
        }
      }
      /////// query now ///////////
      let queryUrl = '';
      if(typeof sort === 'string' && typeof skip === 'number' && typeof limit === 'number'){
        queryUrl = `http://${this.smallData_user_addr}/quickquery/${sort}/${skip}/${limit}`;
      }else if(typeof sort === 'string'){
        queryUrl = `http://${this.smallData_user_addr}/quickquery/${sort}`;
      }else if(typeof skip === 'number' && typeof limit === 'number'){
        queryUrl = `http://${this.smallData_user_addr}/quickquery/${skip}/${limit}`;
      }else{
        queryUrl = `http://${this.smallData_user_addr}/quickquery`;
      }
      this.http.get<Content[]>(queryUrl).subscribe(httpObserver);
    });
    return quickQueryContent;
  }
  queryContents(sessionid: string, field: string, value: string, sort: string, skip:number, limit:number): Observable<SessionContents>{
    // /:fields/:values/:sort/:from/:limit"
    const queryContent: Observable<SessionContents> = new Observable((observable)=>{

      const httpObserver = {
        next: data=>{
          if(data.success){
            observable.next({sessionid : sessionid,contents: data.value});
          }else{
            observable.next({sessionid: sessionid, contents: null});
            this.reportError(data);
          }
        },
        error: err=>{
          observable.next({sessionid: sessionid, contents: null});
          this.reportError(err.message);
        }
      }
      /////// query now ///////////
      let queryUrl = '';
      if(field !== undefined && value !== undefined && sort !== undefined && skip !== undefined && limit !== undefined){
        queryUrl = `http://${this.smallData_user_addr}/query/${field}/${value}/${sort}/${skip}/${limit}`;
      }else if(field !== undefined && value !== undefined && sort !== undefined){
        queryUrl = `http://${this.smallData_user_addr}/query/${field}/${value}/${sort}`;
      }else if(field !== undefined && value !== undefined && skip !== undefined && limit !== undefined){
        queryUrl = `http://${this.smallData_user_addr}/query/${field}/${value}/${skip}/${limit}`;
      }else{
        queryUrl = `http://${this.smallData_user_addr}/query/${field}/${value}`;
      }
      this.http.get<Content[]>(queryUrl).subscribe(httpObserver);
    });
    return queryContent;
  }
  queryById(sessionid:string, id:string): Observable<SessionContent>{
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
      let queryUrl = `http://${this.smallData_user_addr}/query/id/${id}`;
      this.http.get<Content>(queryUrl).subscribe(httpObserver);
    });
    return queryByIdHttp;
  }

  queryRecommendList(sessionid: string ,starnames: string[], num): Observable<SessionContents>{
    const recommendContent: Observable<SessionContents> = new Observable((observable)=>{
      const httpObserver = {
        next: data=>{
          if(data.success){
            observable.next({sessionid : sessionid,contents: data.value});
          }else{
            observable.next({sessionid: sessionid, contents: null});
            this.reportError(data);
          }
        },
        error: err=>{
          observable.next({sessionid: sessionid, contents: null});
          this.reportError(err.message);
        }
      }
      /////// query now ///////////
      let queryUrl = '';
      if(starnames.length === 0){
        queryUrl = `http://${this.smallData_user_addr}/recommendlist/starname/~/${num}`;
      }else{
        queryUrl = `http://${this.smallData_user_addr}/recommendlist/starname/${starnames.join('~')}/${num}`;
      }
       
      this.http.get<Content[]>(queryUrl).subscribe(httpObserver);
    });
    return recommendContent;
  }
}

