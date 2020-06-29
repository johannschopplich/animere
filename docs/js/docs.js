import Animere from './animere.min.js'

// eslint-disable-next-line no-unused-vars
const animere = new Animere({
  offset: 0.4,
  watchDOM: true
})

const qs = s => document.querySelector(s)
const template = qs('#box-template')
const clone = document.importNode(template.content, true)

qs('#button-add-nodes').addEventListener('click', () => {
  qs('#main').appendChild(clone)
})
