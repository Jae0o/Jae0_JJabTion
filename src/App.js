import { API, request } from "./API/CallApi.js";
import Menubar from "./Components/Menubar/Menubar.js";
import PageViewer from "./Components/PageViewer/PageViewer.js";
import {
  getStorage,
  isCheckedToggled,
  removeStorage,
  setStorage,
  setToggleList,
} from "./LocalStorage/LocalStorage.js";
import {
  listPropValidation,
  pagePropValidation,
} from "./Function/PropValidation.js";
import { makeRouterEvent, pushRouter } from "./Router/Router.js";
import HelpButton from "./Components/HelpCard/HelpButton.js";
import HelpCard from "./Components/HelpCard/HelpCard.js";

export default function App({ target }) {
  const appElement = document.createElement("section");
  target.appendChild(appElement);
  appElement.setAttribute("class", "app");

  const getPageList = async (url) => {
    const lists = await request(url);

    if (listPropValidation(lists)) {
      menubar.setState(lists);
    }
  };

  const getCheckedPage = async (id) => {
    const apiPage = await API.getPage(id);
    const localPage = getStorage(id);

    if (
      localPage &&
      localPage.updatedAt > apiPage.updatedAt &&
      confirm("저장에 성공하지 못한 이전 내용이 존재합니다! 불러오시겠나요 ✏️")
    ) {
      return localPage;
    }
    return apiPage;
  };

  /* 렌더링 */
  const menubar = new Menubar({
    target: appElement,
    state: [],
    onEvent: async (params) => {
      const { id } = params;

      if (params.delete) {
        await API.deletePage(id);
        getPageList("/documents");

        if (isCheckedToggled(id)) {
          removeStorage(id);
        }

        const { pathname } = window.location;
        const idInPath = pathname.split("/")[2];

        if (idInPath && idInPath === id) {
          makeRouterEvent({ url: "/", event: "push" });
        }
      }

      if (params.insert) {
        const newPage = await API.insertPage({
          title: "제목 없음",
          parent: id,
        });

        if (!isCheckedToggled(id)) {
          setToggleList(id);
        }

        await getPageList("/documents");

        makeRouterEvent({ url: `/documents/${newPage.id}`, event: "push" });
      }
    },
  });

  let timer = null;

  const pageViewer = new PageViewer({
    target: appElement,
    state: {
      id: "Index",
    },

    onEditing: (params) => {
      const { id } = params;
      setStorage(params);

      /* 디바운스 */
      if (timer !== null) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        const res = await API.updatePage(params);

        if (res.id === id) {
          removeStorage(id);
        }
        await getPageList("/documents");
      }, 600);
    },
  });

  this.route = async () => {
    const { pathname } = window.location;

    /* IndexPage */
    if (pathname === "/") {
      pageViewer.setState({ id: "Index" });
    }

    if (pathname.indexOf("/documents/") === 0) {
      const id = pathname.split("/")[2];

      // 해당 조건 처리가 맞을까
      if (id) {
        const page = await getCheckedPage(id);
        /* 유효성 검사 */
        if (pagePropValidation(page)) {
          pageViewer.setState(page);
        }
      }
    }
  };

  /* 사용 가이드 */
  const helpCard = new HelpCard({
    target: appElement,
  });

  const helpButton = new HelpButton({
    target: appElement,
    onClick: (newState) => {
      helpCard.setState(newState);
      helpButton.setState();
    },
  });

  pushRouter(() => this.route());
  getPageList("/documents");
  this.route();
}
