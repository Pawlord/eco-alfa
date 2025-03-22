import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Типы
import { FoodState } from '@/types/reduxTypes';
import { FormatFoodItem, Response } from '@/types/types';

const initialState: FoodState = {
    products: [],
    filter: 'all',
    isLoading: false,
    error: '',
};

export const fetchFood = createAsyncThunk(
    'food/fetchFood', //Имя экшона, в данном случае имя слайса + название переменной
    async function () { //Асинхронная функция, которая будет выполняться
        const API_URL = process.env.REACT_APP_API_URL;
        const API_KEY = process.env.REACT_APP_API_KEY;

        const params = {
            apiKey: API_KEY ?? '',
        };

        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/complexSearch?${queryString}`);
        const data: Response = await response.json();

        return data.results.map(product => ({ ...product, like: false }));
    }
)

const foodSlice = createSlice({
    name: 'food',
    initialState,
    reducers: {
        toggleLike: (state, action: PayloadAction<number>) => {
            const productId = action.payload;
            const findProduct = state.products.find(product => product.id === productId);

            if (findProduct) {
                findProduct.like = !findProduct.like
            }
        },
        deleteProduct: (state, action: PayloadAction<number>) => {
            const productId = action.payload;
            state.products = state.products.filter(product => product.id !== productId);
        },
        setFilter: (state, action: PayloadAction<'all' | 'liked'>) => {
            state.filter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFood.pending, (state) => {
                state.isLoading = true;
                state.error = '';
            })
            .addCase(fetchFood.fulfilled, (state, action: PayloadAction<FormatFoodItem[]>) => {
                state.isLoading = false;
                state.products = action.payload;
                state.error = '';
            })
            .addCase(fetchFood.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { toggleLike, deleteProduct, setFilter } = foodSlice.actions;
export default foodSlice.reducer;