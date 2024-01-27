import { MENU_TOGGLE } from "../../../LocalStorage/LocalStorage.js";
import List from "./List.js";

export default function ChildrenList({ target, state, id, depth }) {
  const childrenListElement = document.createElement("ul");
  childrenListElement.setAttribute(
    "class",
    "menubar_pageList_list_childrenList"
  );
  target.appendChild(childrenListElement);

  if (MENU_TOGGLE.checkIsToggled(id)) {
    childrenListElement.classList.add("toggleChecked");
  }

  this.state = state;

  this.render = () => {
    this.state.forEach((list) => {
      new List({
        target: childrenListElement,
        state: list,
        depth: depth + 1,
      });
    });
  };

  this.render();
}
