/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */

//Slice, ответственный за 
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchCatalog = createAsyncThunk(
  'catalogList/fetchCatalog',
  async (url) => {
    const result = await fetch(url).then((o) => o.json());
    return result;
  },
);

export const handleMore = createAsyncThunk(
  'catalogList/handleMore',
  async (url) => {
    const result = await fetch(url).then((o) => o.json());
    return result;
  },
);

export const catalogListSlice = createSlice({
  name: 'catalogList',
  initialState: {
    list: [],
    status: null,
    error: null,
    loadMoreVisible: '',
  },
  reducers: {
    toggleVisible: (state, action) => {
      state.loadMoreVisible = action.payload;
    },
  },
  extraReducers: {
    [fetchCatalog.pending]: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    [fetchCatalog.fulfilled]: (state, action) => {
      state.status = null;
      state.error = null;
      state.loadMoreVisible = '';
      state.list = action.payload;
    },
    [fetchCatalog.rejected]: (state) => {
      state.error = new Error('При загрузке возникла ошибка');
      state.status = null;
    },
    [handleMore.pending]: (state) => {
      state.error = null;
    },
    [handleMore.fulfilled]: (state, action) => {
      state.status = null;
      state.error = null;
      if (action.payload.length < 6) state.loadMoreVisible = ' invisible';
      state.list = [...state.list, ...action.payload];
    },
    [handleMore.rejected]: (state) => {
      state.error = new Error('При загрузке возникла ошибка');
    },
  },
});

export const { changeCategory, reloadList, toggleVisible } = catalogListSlice.actions;

export default catalogListSlice.reducer;
