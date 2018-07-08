import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
/**
 * /
 * /list/ReleaseDate|...
 * /meta/category|pornstar|...
 * /search/title
 * /category|pornstar|.../69|...
 * 
 * /list/ReleaseDate/10
 * /meta/pornstar/2
 * 
 * /category|../69/releaseDate|.../2
 * 
 */
export class PaginationService {

  constructor(
    
  ) { }

  navNextUrl(url: string){
   
    let segments: string[] = url.split('/');  
    let urls: string[] = [];
    switch(segments.length){
      case 2:{
        // /
        urls.push('list');
        urls.push('releaseDate');
        urls.push('2');
      };break;
      case 3:{
        // /list/sort
        // /meta/category
        
        switch(segments[1]){
          case "list":
          case "meta":
          case "search":{
            urls.push(segments[1]);
            urls.push(segments[2]);
            urls.push('2');
            
          };break;
          default:{
            // /pornstar/xxx
            urls.push(segments[1]);
            urls.push(segments[2]);
            urls.push('releaseDate');
            urls.push('2');

          };break;
        };break;
      }
      case 4:{
        // /list/ReleaseDate/10
        // /meta/pornstar/2
        switch(segments[1]){
          case "list":
          case "meta":{
            urls.push(segments[1]);
            urls.push(segments[2]);
            urls.push((parseInt(segments[3]) + 1).toString());
          };break;
          default:{
            urls.push(segments[1]);
            urls.push(segments[2]);
            urls.push(segments[3]);
            urls.push('2');
          }
        }
        // /pornstar/xxx/rating
        
      };break;

      case 5:{
        // /category|../69/releaseDate|.../2
        urls.push(segments[1]);
        urls.push(segments[2]);
        urls.push(segments[3]);
        urls.push((parseInt(segments[4]) + 1).toString());
      }
    }
    return '/' + urls.join('/');
  }
}
