import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Типы
import { FoodDetails, FoodState, IFetchFoodDetailsParams } from '@/types/reduxTypes';
import { FormatFoodItem, Response } from '@/types/types';

// Consts
import { API_KEY, API_URL } from '../consts/consts';

const initialState: FoodState = {
    products: [],
    localProductsDetails: [],
    productDetails: null,
    filter: 'all',
    isLoading: false,
    error: '',
};

export const fetchFood = createAsyncThunk(
    'food/fetchFood',
    async function () {

        const params = {
            apiKey: API_KEY ?? '',
        };

        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${API_URL}/complexSearch?${queryString}`);
        const data: Response = await response.json();

        return data.results.map(product => ({ ...product, like: false }));
    }
)

export const fetchFoodDetails = createAsyncThunk<any, IFetchFoodDetailsParams, { rejectValue: string }>(
    'food/fetchFoodDetails',
    async function ({ id, queryParams }: IFetchFoodDetailsParams, { rejectWithValue }) {
        try {
            const defaultQueryParams = {
                includeNutrition: false,
                addWinePairing: false,
                addTasteData: false
            }

            const params = {
                apiKey: API_KEY ?? '',
                ...(queryParams || defaultQueryParams),
            };
            const stringParams = Object.fromEntries(
                Object.entries(params).map(([key, value]) => [key, String(value)])
            );

            const queryString = new URLSearchParams(stringParams).toString();

            const response = await fetch(`${API_URL}/${id}/information?${queryString}`);

            if (!response.ok) {
                return rejectWithValue(`Request failed with status ${response.status}`);
            }

            const data = await response.json();

            const transformedData = {
                analyzedInstructions: data.analyzedInstructions[0].steps,
                title: data.title,
                diets: data.diets,
                extendedIngredients: data.extendedIngredients,
                image: data.image,
                pricePerServing: data.pricePerServing,
                readyInMinutes: data.readyInMinutes,
                id: data.id,
            };

            return transformedData;

        } catch (error: any) {
            return rejectWithValue(error.message);
        }
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
        },
        addProduct: (state, action: PayloadAction<FormatFoodItem>) => {
            state.products.push(action.payload);
        },
        addLocalProduct: (state, action: PayloadAction<{ foodItem: FormatFoodItem, foodDetails: FoodDetails }>) => {
            state.products.push(action.payload.foodItem);
            state.localProductsDetails.push(action.payload.foodDetails);
        },
        getLocalProductDetails: (state, action: PayloadAction<FormatFoodItem>) => {
            const newProductDetails = state.localProductsDetails.find(product => action.payload.id === product.id);
            state.productDetails = newProductDetails ? newProductDetails : null;
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
                const serverProducts = action.payload;


                const newProducts = serverProducts.filter(serverProduct =>
                    !state.products.some(existingProduct => existingProduct.id === serverProduct.id)
                );

                state.products = [...state.products, ...newProducts];
                state.error = '';
            })
            .addCase(fetchFood.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            // Обработчики для fetchFoodDetails
            .addCase(fetchFoodDetails.pending, (state) => {
                state.isLoading = true;
                state.error = '';
                state.productDetails = null;
            })
            .addCase(fetchFoodDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productDetails = action.payload;
                state.error = '';
            })
            .addCase(fetchFoodDetails.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
                state.productDetails = null;
            });
    },
});

export const { toggleLike, deleteProduct, setFilter, addProduct, addLocalProduct, getLocalProductDetails } = foodSlice.actions;
export default foodSlice.reducer;