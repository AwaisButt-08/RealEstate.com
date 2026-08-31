// import { configureStore } from "@reduxjs/toolkit";
// import { combineReducers } from "redux";
// import { persistReducer, persistStore } from "redux-persist";
// import userReducer from "./User/UserSlice.js";
// import storage from 'redux-persist/lib/storage';

// const safeStorage = {
//   getItem: (key) => {
//     if (typeof window === "undefined") return Promise.resolve(null);
//     return Promise.resolve(window.localStorage.getItem(key));
//   },
//   setItem: (key, value) => {
//     if (typeof window !== "undefined") {
//       window.localStorage.setItem(key, value);
//     }
//     return Promise.resolve();
//   },
//   removeItem: (key) => {
//     if (typeof window !== "undefined") {
//       window.localStorage.removeItem(key);
//     }
//     return Promise.resolve();
//   },
//   clear: () => {
//     if (typeof window !== "undefined") {
//       window.localStorage.clear();
//     }
//     return Promise.resolve();
//   },
// };

// const storage = storageModule.default || storageModule;

// const rootReducer = combineReducers({
//   user: userReducer,
// });

// const persistConfig = {
//   key: "root",
//   storage,
//   version:1,
//   whitelist: ["user"],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
//   devTools: true,
// });

// export const persistor = persistStore(store);


import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import userReducer from "./User/UserSlice.js";

// 1. Import module using an alias (reduxStorage) to avoid duplicate identifier conflict
import reduxStorage from "redux-persist/lib/storage";

// 2. Resolve Vite ES module export safely into a single 'storage' constant
const storage = reduxStorage.default || reduxStorage;

const rootReducer = combineReducers({
  user: userReducer,
});

const persistConfig = {
  key: "root",
  storage, // 👈 Uses the resolved storage constant above
  version: 1,
  whitelist: ["user"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export const persistor = persistStore(store);
