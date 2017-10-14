import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { LineChartComponent } from './line-chart/line-chart.component'
import { BarChartComponent } from './bar-chart/bar-chart.component'

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    LineChartComponent,
    BarChartComponent
],
  exports: [
    LineChartComponent,
    BarChartComponent
  ]
})
export class ChartModule { }
