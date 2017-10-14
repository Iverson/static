import { Area, Line } from 'd3-shape'
import { Selection, BaseType } from 'd3-selection'

import * as Chart from '../chart'
import { BaseChartSerieView, LEGEND_NOWRAP_WORD_LENGTH } from '../base-chart-serie'
import { LineChartComponent } from './line-chart.component'

export class LineChartSerieView extends BaseChartSerieView {
  private legendLineHeight: number

  constructor(
    protected chart: LineChartComponent,
    protected model: Chart.Serie<Date>,
  ) {
    super(chart, model)
  }

  render() {
    this.renderLegend()
    this.renderBorder()
    this.renderArea()
  }

  renderBorder() {
    this.borderPathEl = this.chart.view.g.append<SVGPathElement>('path')
      .datum(this.model.data)
      .attr('fill', 'none')
      .attr('stroke', this.model.color)
      .attr('stroke-width', 4)
      .attr('d', this.chart.line)

    this.animatePath(this.borderPathEl)
  }

  renderArea() {
    this.areaPathEl = this.chart.view.g.append<SVGPathElement>('path')
      .datum(this.model.data)
      .attr('fill', this.model.fill || this.model.color )
      .attr('opacity', 0)
      .attr('d', this.chart.area)


    this.areaPathEl
      .transition('linear')
      .delay(2000)
      .duration(2000)
      .attr('opacity', 1)
  }

  renderLegend() {
    const lastPoint = this.model.data.slice(-1)[0]
    const chart     = this.chart

    this.legendTextEl = this.chart.svg.select('.legend')
      .append<SVGTextElement>('text')
      .attr('class', 'legend-text')
      .attr('opacity', 0)
      .attr('y', -20)
      .attr('fill', this.model.color)
      .text('_')
      .attr('transform', function() {
        const height = this.getBBox().height
        return `translate(${chart.x(lastPoint.x)}, ${chart.y(lastPoint.y) - height / 2})`
      })

    this.legendLineHeight = this.legendTextEl.node().getBBox().height * 1.1
    this.legendTextEl
      .text('')
      .selectAll('tspan')
        .data(
          this.model.name.split(' ')
            .map((w, i, array) => {
              const next = array[i + 1]
              if (w && i < array.length - 1 && (next.length + w.length) < LEGEND_NOWRAP_WORD_LENGTH) {
                array[i + 1] = null
                return [w, next].join(' ')
              } else {
                return w
              }
            })
            .filter(String)
        )
      .enter().append<SVGTSpanElement>('tspan')
        .text(d => d)
        .attr('x', 0)
        .attr('dy', this.legendLineHeight)

    this.legendTextEl
      .transition()
      .delay(2000)
      .duration(2000)
      .attr('opacity', 1)
      .attr('y', 0)
  }

  update(model: Chart.Serie) {
    this.model = model

    this.borderPathEl
      .attr('stroke-dasharray', null)
      .datum(model.data)
      .transition()
      .duration(1000)
      .attr('d', this.chart.line)

    this.areaPathEl
      .datum(model.data)
      .transition()
      .duration(1000)
      .attr('d', this.chart.area)

    this.legendTextEl
      .transition()
      .duration(1000)
      .attr('transform', `translate(${this.chart.x(this.lastPoint.x)}, ${this.chart.y(this.lastPoint.y) - this.legendLineHeight / 2})`)
  }

  destroy() {
  }
}
