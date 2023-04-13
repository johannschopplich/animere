import 'duecss/reset.css'
import 'duecss/base.css'
import './main.css'
import 'uno.css'

import Animere from '../index'

new Animere({ offset: 0.4 })

const template = qs<HTMLTemplateElement>('#box-template')

qs('[data-add-nodes]')?.addEventListener('click', () => {
  const clone = template!.content.cloneNode(true)
  qs('#main')?.appendChild(clone)
})

function qs<T extends HTMLElement>(s: string) {
  return document.querySelector<T>(s)
}
