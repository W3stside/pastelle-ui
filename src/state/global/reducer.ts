import { createSlice } from '@reduxjs/toolkit'
// import { HYDRATE } from 'next-redux-wrapper'

const globalSSRReducer = createSlice({
  name: 'global',
  initialState: {
    app: 'init',
    page: 'init',
  },
  reducers: {
    // [HYDRATE]: (state, action) => {
    //   console.log('HYDRATE', state, action.payload)
    //   if (action.payload.app === 'init') delete action.payload.app
    //   if (action.payload.page === 'init') delete action.payload.page
    //   return { ...state, ...action.payload }
    // },
    APP: (state, action) => {
      return { ...state, app: action.payload }
    },
    PAGE: (state, action) => {
      return { ...state, page: action.payload }
    },
  },
})

export const { APP, PAGE } = globalSSRReducer.actions
export const hydrateSSR = globalSSRReducer.reducer
