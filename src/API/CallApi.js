const API_END_POINT = "https://kdt-frontend.programmers.co.kr";

export async function request(url, options) {
  try {
    const response = await fetch(`${API_END_POINT}${url}`, {
      ...options,
      headers: {
        "x-username": "Lee Jae Young",
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    alert(error.message);
  }
}

export const API = {
  insertPage: async (params) => {
    const createdPost = await request("/documents", {
      method: "POST",
      body: JSON.stringify(params),
    });

    return createdPost;
  },

  deletePage: async (id) => {
    await request(`/documents/${id}`, {
      method: "DELETE",
    });
  },

  getPage: async (id) => {
    const page = await request(`/documents/${id}`, {
      method: "GET",
    });

    return page;
  },

  updatePage: async ({ id, title, content }) => {
    return await request(`/documents/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        content,
      }),
    });
  },
};
