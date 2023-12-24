import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'recipes-private',
  initialState: {
    initialized: {
      created: false,
      bookmark: false,
      like: false
    },
    created: undefined,
    bookmark: undefined,
    like: undefined
  },
  reducers: {
    setInit: (state, action) => {
      if (action.payload === 'created') {
        state.initialized.created = true
      } else if (action.payload === 'bookmark') {
        state.initialized.bookmark = true
      } else if (action.payload === 'like') {
        state.initialized.like = true
      }
    },
    setCreated: (state, action) => {
      state.created = action.payload
    },
    setBookmark: (state, action) => {
      state.bookmark = action.payload
    },
    setLike: (state, action) => {
      state.like = action.payload
    }
  }
})

export const { setInit, setCreated, setBookmark, setLike } = counterSlice.actions
export default counterSlice.reducer
