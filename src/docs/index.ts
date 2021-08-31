import "./buldy.css";
import "./main.css";

import Animere from "../index";

new Animere({
  offset: 0.4,
  watchDOM: true,
});

const qs = <T extends Element>(s: string) => document.querySelector<T>(s);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const template = qs<HTMLTemplateElement>("#box-template")!;

qs("#button-add-nodes")?.addEventListener("click", () => {
  const clone = template.content.cloneNode(true);
  qs("#main")?.appendChild(clone);
});
