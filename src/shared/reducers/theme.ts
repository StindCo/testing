import { createSlice, Reducer, Slice } from "@reduxjs/toolkit";

const initialState = {
    theme: "dark"
};

export const themeSlice: Slice = createSlice({
    name: "theme",
    initialState: {
        theme: "light"
    },
    reducers: {
        changeTheme: (state) => {
            state.theme = (state.theme === "dark") ? "light" : "dark";
        },
    },
});

// Action creators are generated for each case reducer function
export const { changeTheme: changeTheme } = themeSlice.actions;

export const getCurrentTheme = (state: any) => state.theme;

export default themeSlice.reducer;
