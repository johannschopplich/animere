import "duecss/base.css";
import "./main.css";
import "uno.css";

import Animere from "../index";

new Animere({
  offset: 0.4,
  watchDom: true,
});

const qs = <T extends Element>(s: string) => document.querySelector<T>(s);
const template = qs<HTMLTemplateElement>("#box-template");

qs("#button-add-nodes")?.addEventListener("click", () => {
  if (!template) return;
  const clone = template.content.cloneNode(true);
  qs("#main")?.appendChild(clone);
});
