const STORAGE_NAME = "SAVE_DATA_";
const TOGGLE_LIST_NAME = "TOGGLED_ITEM";

export const LOCAL_STORAGE = {
  setStorage: (pageData) => {
    try {
      const updatedAt = new Date();
      const newData = JSON.stringify({ ...pageData, updatedAt });
      localStorage.setItem(`${STORAGE_NAME}${pageData.id}`, newData);
    } catch (e) {
      console.error("Local data save 실패");
    }
  },
  removeStorage: (id) => {
    try {
      localStorage.removeItem(`${STORAGE_NAME}${id}`);
    } catch (e) {
      console.error("Local data save 실패");
    }
  },
  getStorage: (id) => {
    try {
      return JSON.parse(localStorage.getItem(`${STORAGE_NAME}${id}`));
    } catch (e) {
      console.error("Local data load 실패");
    }
  },
};

export const MENU_TOGGLE = {
  getList: () => {
    try {
      return JSON.parse(localStorage.getItem(TOGGLE_LIST_NAME)) ?? [];
    } catch (e) {
      console.error("Toggled Local List 로딩 실패");
    }
  },

  setList: (id) => {
    try {
      const getData = MENU_TOGGLE.getList();
      const newData = JSON.stringify([...getData, id]);
      localStorage.setItem(TOGGLE_LIST_NAME, newData);
    } catch (e) {
      console.error("Toggled Local set 실패");
    }
  },

  removeList: (id) => {
    try {
      const getData = MENU_TOGGLE.getList();
      const newData = JSON.stringify(getData.filter((item) => item !== id));
      localStorage.setItem(TOGGLE_LIST_NAME, newData);
    } catch (e) {
      console.error("Toggled Local remove 실패");
    }
  },

  checkIsToggled: (id) => {
    if (typeof id === "number") {
      id = id.toString();
    }
    const toggledList = MENU_TOGGLE.getList();
    return toggledList.includes(id);
  },
};
