import { trigger, stagger, animate, animation, transition, style, query, useAnimation } from '@angular/animations'

const duration = '250ms cubic-bezier(.35,0,.25,1)'

export const inDownAnimation = animation([
  style({
    transform: 'translateY(-50px)',
    opacity: 0
  }),
  stagger(50, [
    animate(duration, style('*'))
  ])
])

export const outUpAnimation = animation([
  stagger(50, [
    animate(duration, style({ transform: 'translateY(-50px)', opacity: 0}))
  ])
])

export const inDownListAnimation =
  trigger('inDownListAnimation', [
    transition('* => *', [
      query(':enter', [
        useAnimation(inDownAnimation)
      ], { optional: true }),
      query(':leave', [
        useAnimation(outUpAnimation)
      ], { optional: true }),
    ])
  ])
