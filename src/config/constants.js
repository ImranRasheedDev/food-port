"use strict";

const constants = {
  base_path: "/",

  // API base URL - make sure this matches your backend API
  api_base_url: import.meta.env.VITE_API_BASE_URL,

  node_chat_url: import.meta.env.VITE_NODE_CHAT_URL,

  default_language: import.meta.env.VITE_DEFAULT_LANGUAGE,

  session_key: import.meta.env.VITE_SESSION_KEY,

  session_object: import.meta.env.VITE_SESSION_OBJECT,

  pagination_size: import.meta.env.VITE_PAGINATION_SIZE,

  // Storage keys
  storage: {
    user: 'user',
    session: 'session',
    token: 'token',
  },
};

// Attach constants to window for global access
window.constants = constants;
export default constants;
