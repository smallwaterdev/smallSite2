import { Injectable } from '@angular/core';
import {URLEncodedPage} from '../data-structures/URLEncodedPage';
@Injectable({
  providedIn: 'root'
})
export class UrlAnalysisService {

  constructor() { }
  urlAnalysis(url: string): URLEncodedPage{
    let segments = url.split('/');
    if(segments.length === 0 || segments.length === 1){
      return null;
    }
    let result: URLEncodedPage = new URLEncodedPage();

    switch(segments.length){
      case 2:{
        /**
         * /
         * /watchlater
         */
        if(segments[1] === ""){
          result.type = "list";
          result.value = null;
          result.page = 1;
          result.sort = "releaseDate";
        }else{
          result.type = "watchlater";
          result.value = null;
          result.page = 1;
          result.sort = null;
        }
      };break;
      case 3:{
        /**
         * /list/sort
         * /meta/value
         * /content/id
         * /pornstar/value
         * /search/value
         */
        result.type = segments[1];
        result.page = 1;

        if(segments[1] === "list"){
          result.sort = segments[2];
          result.value = null;
        }else if(segments[1] === "meta" || segments[1] === "content" || segments[1] === "search"){
          result.sort = null;
          result.value = decodeURIComponent(segments[2]);
        }else{
          result.value = decodeURIComponent(segments[2]);
          result.sort = "releaseDate";
        }
      };break;
      case 4:{
        /**
         * /list/sort/page
         * /pornstar/value/sort
         * /meta/value/page
         * /search/value/page
         */
        result.type = segments[1];
        if(segments[1] === 'list'){
          result.sort = segments[2];
          result.page = parseInt(segments[3]);
        }else if(segments[1] === 'meta' || segments[1] === "search"){
          result.sort = null;
          result.value = decodeURIComponent(segments[2]);
          result.page = parseInt(segments[3]);
        }else{
          result.value = decodeURIComponent(segments[2]);
          result.sort = segments[3];
          result.page = 1;
        }
        
      };break;
      case 5:{
        /**
         * /pornstar/value/sort/page
         */
        result.type = segments[1];
        result.value = decodeURIComponent(segments[2]);
        result.sort = segments[3];
        result.page = parseInt(segments[4]);
      };break;
        
      default:{
        return null;
      };
    }
    return result;
  }
}
