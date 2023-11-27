import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";

const initialState = {
  schema: [],
  current: 0,
};

export const schemaSlice: Slice = createSlice({
  name: "schema",
  initialState: initialState,
  reducers: {
    loadSchema: (state, action) => {
      state.schema = action.payload?.schema;
    },
  },
});

// Action creators are generated for each case reducer function
export const { actions, reducer } = schemaSlice;

export const { loadSchema } = actions;

export const getSchema = (state: any) => state.schema?.schema;

// export const getCurrentOperateur = (state: any) =>
//   state.schema.schema[state.schema?.current];

// export const getCurrentOperateurIndex = (state: any) =>
//   state.schema?.current;

export default reducer;
