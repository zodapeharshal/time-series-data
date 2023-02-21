import { createSlice, current } from '@reduxjs/toolkit'
export const companySlice = createSlice({
  name: 'company',
  initialState: {
    value: {  
      "docId": 12335,
      "a": "" 
    },
  },
  reducers: {
    updateCmpDetails : (state, action)=>  {
      state.value = action.payload ;
    },
    showDetails : (state ) => {
        console.log("from company slice", current(state)) ;
    },
  },
})
const { actions , reducer } =companySlice ;
export const { updateCmpDetails, showDetails} = actions ;
export default reducer ;