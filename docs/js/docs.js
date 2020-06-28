import Animere from './animere.min.js'

// eslint-disable-next-line no-unused-vars
const animere = new Animere({
  offset: 0.4,
  watchDOM: true
})

const addNode = () => {
  const t = document.querySelector('#box-template')
  const clone = document.importNode(t.content, true)
  document.querySelector('#main').appendChild(clone)
}

document.querySelector('#button-add-nodes').addEventListener('click', addNode)
