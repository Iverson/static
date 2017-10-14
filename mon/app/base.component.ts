import { OnInit, Injectable } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Injectable()
export class BaseComponent implements OnInit {
  showChart = false
  data: any[]
  dataMock: any

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.params
      .map(p => p['id'])
      .subscribe(id => {
        this.data = this.dataMock[id]
      })

    setTimeout(() => {
      this.menuAnimationDone()
    }, 2000)
  }

  menuAnimationDone() {
    this.showChart = true
  }
}
