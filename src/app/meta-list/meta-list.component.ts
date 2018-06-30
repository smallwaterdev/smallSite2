import { Component, OnInit } from '@angular/core';
import {QueryMetaService} from '../services/query-meta.service';
import { Router } from '@angular/router';
import {Meta} from '../data-structures/Meta';
import {FormattingService} from '../services/formatting.service';
@Component({
  selector: 'app-meta-list',
  templateUrl: './meta-list.component.html',
  styleUrls: ['./meta-list.component.scss']
})
export class MetaListComponent implements OnInit {

  metaItems: Meta[];
  constructor(
    private queryMetaService: QueryMetaService,
    private router: Router,
    public formatter: FormattingService
  ) { }

  ngOnInit() {
    this.queryMetaService.queryMetaOnFieldWithoutValue(
      this.router.url, 
      'genre',
      0, 36
    ).subscribe(data=>{
      if(data.sessionid === this.router.url){
        this.metaItems = data.metas;
      }
    });
  }
  
}
