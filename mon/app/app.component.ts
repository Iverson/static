import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  loaded = false
  loading = false

  ngOnInit() {
    setTimeout(() => this.loading = !this.loaded, 200)
  }
}
