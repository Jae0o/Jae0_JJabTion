import ChildrenList from "./ChildrenList.js";
import ListInfo from "./ListInfo.js";

export default function List({ target, state, depth }) {
  this.state = state;
  const { title, id, documents } = state;

  const listElement = document.createElement("li");
  listElement.setAttribute("class", "menubar_pageList_list");
  listElement.setAttribute("data-id", id);
  target.appendChild(listElement);

  this.depth = depth;

  this.render = () => {
    new ListInfo({
      target: listElement,
      state: { title, id, depth },
    });

    new ChildrenList({
      target: listElement,
      state: documents,
      id,
      depth,
    });
  };

  this.render();
}
