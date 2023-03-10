import { createSlice, current } from '@reduxjs/toolkit'
export const companySlice = createSlice({
  name: 'company',
  initialState: {
    value: {  
      "docId": 12335,
      "link": {}
    },
    isLoading : false,
    cdnPath: "" 
  },
  reducers: {
    updateCmpDetails : (state, action)=>  {
      state.value = action.payload ;
    },
    showDetails : (state ) => {
        console.log("from company slice", current(state)) ;
    },
    showLoading : (state, action) => {
      state.isLoading = action.payload ;
    },
    updateCdnPath: (state, action) => {
      state.cdnPath = action.payload
    },
  },
})
const { actions , reducer } =companySlice ;
export const { updateCmpDetails, showDetails, showLoading, updateCdnPath} = actions ;
export default reducer ;