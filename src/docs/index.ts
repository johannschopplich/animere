import Animere from "../index";

new Animere({
  offset: 0.4,
  watchDOM: true,
});

const qs = (s: string) => document.querySelector(s);
const template = <HTMLTemplateElement>qs("#box-template");
const clone = document.importNode(template.content, true);

qs("#button-add-nodes")?.addEventListener("click", () => {
  qs("#main")?.appendChild(clone);
});
