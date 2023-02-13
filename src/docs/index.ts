import 'duecss/reset.css'
import 'duecss/base.css'
import './main.css'
import 'uno.css'

import Animere from '../index'

// eslint-disable-next-line no-new
new Animere({
  offset: 0.4,
  watchDOM: true,
})

const qs = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)
const template = qs<HTMLTemplateElement>('#box-template')

qs('[data-add-nodes]')?.addEventListener('click', () => {
  if (!template)
    return
  const clone = template.content.cloneNode(true)
  qs('#main')?.appendChild(clone)
})
