import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';


export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts');
    return data;
});


export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const { data } = await axios.get('/tags');
    return data;
});


export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
    const { data } = await axios.delete(`/posts/${id}`);
    return data;
});


const unique = (arr) => {
    let result = [];
  
    for (let str of arr) {
        if (!result.includes(str)) {
            result.push(str);
        }
    }
    return result;
}

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    }
};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducer: {},
    extraReducers: {
        // POSTS
        [fetchPosts.pending]: (state, action) => {
            state.posts.status = 'loading';

        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'loaded';
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = 'error';
        },
        // TAGS
        [fetchTags.pending]: (state, action) => {
            state.tags.status = 'loading';

        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = unique(action.payload);
            state.tags.status = 'loaded';
        },
        [fetchTags.rejected]: (state) => {
            state.tags.status = 'error';
            state.tags.items = [];
        },
        // DELETE POST
        [fetchRemovePost.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg);
        },
    }
});

export const postsReducer = postSlice.reducer;
