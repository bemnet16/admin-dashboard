import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: null,
  email: null,
  password: null,
  role: null,
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    updateUser: (state, actions) => {
      const { name, email, password, role } = actions.payload;
      state.name = name;
      state.email = email;
      state.password = password;
      state.role = role;
    },
  },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
