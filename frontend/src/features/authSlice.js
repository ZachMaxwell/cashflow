import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser = createAsyncThunk(
    'auth/register',
    async ({ name, email, password }, {rejectWithValue}) => {

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        const { data } = await axios.post('/api/users/register/', { name, email, password }, config)
        console.log('In registerUser - should be getting all the user info data back:', data)
        localStorage.setItem('userInfo', JSON.stringify(data))
        localStorage.setItem('token', JSON.stringify(data.token))
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else {
                return rejectWithValue(error.message)
            }
        }

})

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, {rejectWithValue}) => {
        
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        const { data } = await axios.post('/api/users/login/', { 'username': email, 'password': password }, config)
        console.log('This is the reponse being sent from the login POST request:', data);
        localStorage.setItem('userInfo', JSON.stringify(data))
        localStorage.setItem('token', JSON.stringify(data.token))
        
        return data
        } catch (error) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message)
            } else { 
                return rejectWithValue(error.response.data.detail)
            }
    }
})


const userInfo = localStorage.getItem('userInfo')
    ? localStorage.getItem('userInfo')
    : null;
console.log('logging the user info from local storage:', userInfo);

const userToken = localStorage.getItem('token')
console.log('logging the user token from local storage',userToken);


export const authSlice = createSlice({ 
    name: 'auth',
    initialState: {
        loading: false,
        userInfo, // for the user object
        userToken, // for storing the JWT
        error: null,
        success: false,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            state.userInfo = null;
            state.userToken = null;
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: {
        [loginUser.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [loginUser.fulfilled]: (state, { payload }) => {
            state.loading = false;
            state.success = true;
            state.userInfo = payload;
            state.userToken = payload.token;
        }, 
        [loginUser.rejected]: (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        },
        [registerUser.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [registerUser.fulfilled]: (state, { payload }) => {
            state.loading = false;
            state.success = true;
            state.userInfo = payload;
            state.userToken = payload;       
        },
        [registerUser.rejected]: (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        },
    },   

});

export const { logout } = authSlice.actions;

export default authSlice.reducer;