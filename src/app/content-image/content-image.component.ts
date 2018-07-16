import { Component, OnInit, Input } from '@angular/core';
import {Content} from '../data-structures/Content';
import {WatchLaterService} from '../services/watch-later.service';
import {FormattingService} from '../services/formatting.service';
@Component({
  selector: 'app-content-image',
  templateUrl: './content-image.component.html',
  styleUrls: ['./content-image.component.scss']
})
export class ContentImageComponent implements OnInit {

  image_size = { width:'100%', height:'100px'};
  icon_padding:string = '3px';
  icon_opacity = '0.8';

  @Input('content') content: Content;
  @Input() set imageHeight(imageHeight: number){
    if(imageHeight === -1){
      this.image_size.height = "100%";
    }else{
      this.image_size.height = imageHeight.toString() + 'px';
    }
  }
  @Input() set imageWidth(imageWidth : number){
    if(imageWidth === -1){
      this.image_size.width = "100%";
    }else{
      this.image_size.width = imageWidth.toString() + 'px';
    }
  }
  @Input() set largeWatchLater(value: boolean){
    if(value){
      this.icon_padding = '3px 3px 80px 130px';
      this.icon_opacity = '0.4';
    }else{
      this.icon_opacity = '0.8';
      this.icon_padding = '3px';
    }
  };
  
  
  constructor(
    private watchLater: WatchLaterService,
    public formatter: FormattingService,
  ) { }
  ngOnInit(){
    /*if(this.imageWidth === -1){
      this.__real_image_height = "100%";
    }else{
      this.__real_image_height = imageWidth.toString();
    }
    if(this.imageWidth === -1){
      this.__real_image_width = "100%";
    }else{
      this.__real_image_width = imageWidth.toString();
    }*/
    //if(this.watch_later_size === '')
  }

  isAddedToWaterLater(id: string){
    return this.watchLater.hasContent(id)
  }
  addToWaterLater(content: Content){
    this.watchLater.store(content);
  }
}
