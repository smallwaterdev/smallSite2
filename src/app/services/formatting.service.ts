import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormattingService {

  constructor() { }
  convertDuration(value:number){
    let hour = "00";
    let minute = "00";
    let second = "00";
    if(value < 60){
      second = value.toString();
    }else if(value < 3600){
      second = (value % 60).toString();
      minute = Math.floor(value / 60).toString();
      
    }else{
      second = (value % 60).toString();
      let temp = Math.floor(value / 60);
      hour = Math.floor(temp / 60).toString();
      minute = (temp % 60).toString();
    }  
    if(hour.length < 2){
      hour = '0' + hour;
    }
    if(minute.length < 2){
      minute = '0' + minute;
    }
    if(second.length < 2){
      second = '0' + second;
    }
    return hour + ":" + minute + ":" + second;
  }
  convertView(value:number){
    if(value < 1000){
      return value.toString();
    }else{
      return value.toString().substring(0, value.toString().length - 3) + 'K';
    }
  }
  convertRating(value:number){
    return Math.ceil(value * 20).toString() + '%';
  }
  convertStarname(value:string){
    let result = [];
    value.split('-').forEach(ele=>{
      if(ele.length > 0){
        ele = ele[0].toUpperCase() + ele.substring(1, ele.length);
        result.push(ele);
      }
    });
    return result.join(' ');
  }
  convertStarnames(values:string[]){
    let result = [];
    values.forEach(ele=>{
      result.push(this.convertStarname(ele));
    });
    return result.join(', ');
  }
  convertDate(value:string){
    return value.substring(0, 10);
  }
}
