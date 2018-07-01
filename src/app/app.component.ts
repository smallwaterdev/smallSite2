import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Javferry';

  goTop(){
    const element = document.querySelector('#top-div');
    element.scrollIntoView();
    //window.scrollTo(0,0);
  }
}
