import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: null,
  lastName: null,
  email: null,
  password: null,
  role: null,
  gender: null,
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    updateUser: (state, actions) => {
      const { firstName, lastName, email, password, role } = actions.payload;
      state.firstName =firstName ;
      state.lastName = lastName;
      state.email = email;
      state.password = password;
      state.role = role;
    },
  },
});

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;
