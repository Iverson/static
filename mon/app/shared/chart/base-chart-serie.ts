import { Area, Line } from 'd3-shape'
import { Selection, BaseType } from 'd3-selection'
import * as Chart from './chart'
import { BaseChartComponent } from './base-chart.component'

export const LEGEND_NOWRAP_WORD_LENGTH = 9

export abstract class BaseChartSerieView {
  name: string
  protected borderPathEl: Selection<SVGPathElement, {}, null, undefined>
  protected areaPathEl: Selection<SVGPathElement, {}, null, undefined>
  protected legendTextEl: Selection<SVGTextElement, {}, null, undefined>

  constructor(
    protected chart: BaseChartComponent,
    protected model: Chart.Serie,
  ) {
    this.name = model.name
    this.render()
  }

  abstract render()
  abstract update(model: Chart.Serie)

  animatePath(path: Selection<SVGPathElement, {}, null, undefined>) {
    const totalLength = path.node().getTotalLength()

    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition('linear')
        .duration(2000)
        .attr('stroke-dashoffset', 0);
  }

  destroy() {
  }

  get lastPoint() {
    return this.model.data.slice(-1)[0]
  }
}
