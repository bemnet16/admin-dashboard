import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Opportunity {
  id: string;
  logoUrl: string;
  title: string;
  orgName: string;
  opType: string;
  image: string;
  description: string;
  location: string[];
  categories: string[];
}

interface OpportunityState {
  opportunities: Opportunity[];
}

const initialState: OpportunityState = {
  opportunities: [],
};

const opportunitySlice = createSlice({
  name: "opportunities",
  initialState,
  reducers: {
    setOpportunities(state, action: PayloadAction<Opportunity[]>) {
      state.opportunities = action.payload;
    },
    addOpportunity(state, action: PayloadAction<Opportunity>) {
      state.opportunities.push(action.payload);
    },
    removeOpportunity(state, action: PayloadAction<string>) {
      state.opportunities = state.opportunities.filter(
        (opp) => opp.id !== action.payload
      );
    },
  },
});

export const { setOpportunities, addOpportunity, removeOpportunity } =
  opportunitySlice.actions;

export default opportunitySlice.reducer;
