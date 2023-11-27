import { configureStore } from "@reduxjs/toolkit";
import datatooltabs from "./src/shared/reducers/datatoolTabs";
import loginReducer from "./src/shared/reducers/login";
import operateurs from "./src/shared/reducers/operateurs";
import schema from "./src/shared/reducers/schema";
import themeReducer from "./src/shared/reducers/theme";


export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: loginReducer,
    datatooltabs: datatooltabs,
    operateurs: operateurs,
    schema: schema,
  },
});
