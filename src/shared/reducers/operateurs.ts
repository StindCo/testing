import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";

const initialState = {
  operateurs: [],
  current: 0,
};

export const operateurSlice: Slice = createSlice({
  name: "operateurs",
  initialState: initialState,
  reducers: {
    setCurrentOperateur: (state, action) => {
      state.current = action.payload?.index;
    },
    loadOperateurs: (state, action) => {
      state.operateurs = action.payload?.operateurs;
    },
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = operateurSlice;

export const { setCurrentOperateur, loadOperateurs } = actions;

export const getOperateurs = (state: any) => state.operateurs.operateurs;

export const getCurrentOperateur = (state: any) =>
  state.operateurs.operateurs[state.operateurs?.current];

export const getCurrentOperateurIndex = (state: any) =>
  state.operateurs?.current;

export default reducer;
