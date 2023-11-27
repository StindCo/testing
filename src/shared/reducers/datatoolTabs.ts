import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";

const initialState = {
  tabs: [
    {
      name: "Principal",
      data: {},
      type: "main",
      is_revokable: false,
    },
  ],
  current: 0,
};

export const dataToolTabsSlice: Slice = createSlice({
  name: "datatooltabs",
  initialState: initialState,
  reducers: {
    addTabs: (state, action) => {
      state.tabs.push(action.payload?.tab);
      state.current = state.tabs.length - 1;
    },
    modifyData: (state, action) => {
      state.tabs[action?.payload?.index].data = action?.payload?.data;
    },
    setCurrent: (state, action) => {
      state.current = action.payload?.index;
    },
    removeTabs: (state, action) => {
      if (state.tabs[action.payload?.index]?.is_revokable == false) {
        return;
      }
      state.tabs.splice(action.payload?.index, 1);
      state.current = state.current == 0 ? state.current : state.current--;
      if (state.tabs[state.current] == null) state.current = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = dataToolTabsSlice;

export const { addTabs, setCurrent, removeTabs } = actions;

export const getCurrent = (state: any) => state.datatooltabs?.current;
export const getCurrentTab = (state: any) =>
  state.datatooltabs?.tabs[state.datatooltabs?.current];
export const getTabs = (state: any) => state.datatooltabs?.tabs;

export default reducer;
