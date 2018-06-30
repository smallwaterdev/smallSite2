import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import { AppComponent } from './app.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterModule, Route, UrlSegment} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MetaListComponent } from './meta-list/meta-list.component';
import { ContentListComponent } from './content-list/content-list.component';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import { ContentComponent } from './content/content.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatPaginatorModule} from '@angular/material/paginator';
import { SideContentListComponent } from './side-content-list/side-content-list.component';
import { ContentNavComponent } from './content-nav/content-nav.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

export function list_matcher(url: UrlSegment[]) {
  const contentListField = ['list', 'category', 'pornstar', 'director', 'studio'];
  if(url.length === 0 || (contentListField.indexOf(url[0].path) !== -1 && url.length >= 2)){
    return {consumed: url};
  }else{
    return null;
  }
}
export function list_matcher_meta(url: UrlSegment[]){
  const metaFields = ['category', 'pornstar', 'studio', 'director'];
  if(url.length === 1 && metaFields.indexOf(url[0].path) !== -1){
    return {consumed:url};
  }else{
    return null;
  }
}
const routes: Route[]=[
  { path: "content/:id", component: ContentComponent},
  { matcher: list_matcher_meta, component: MetaListComponent},
  { matcher:list_matcher , component: ContentListComponent},
  { path: "**", component: NotFoundPageComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    MetaListComponent,
    ContentListComponent,
    ContentComponent,
    SideContentListComponent,
    ContentNavComponent,
    NotFoundPageComponent
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    FlexLayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatPaginatorModule,
    MatSelectModule,
    HttpClientModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
