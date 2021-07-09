import Animere from "./index";

// @ts-ignore
const animere = new Animere({
  offset: 0.4,
  watchDOM: true,
});

const qs = (s: string) => document.querySelector(s) as Element;
const template = qs("#box-template") as HTMLTemplateElement;
const clone = document.importNode(template.content, true);

qs("#button-add-nodes").addEventListener("click", () => {
  qs("#main").appendChild(clone);
});
