import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { MenuComponent } from './menu/menu.component'
import { ChartModule } from './chart/chart.module'

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    MenuComponent
],
  exports: [
    MenuComponent,
    ChartModule
  ]
})
export class SharedModule { }
