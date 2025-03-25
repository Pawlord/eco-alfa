import { FormatFoodItem } from "./types";

export type FoodState = {
    products: FormatFoodItem[],
    localProductsDetails: FoodDetails[],
    productDetails: null | FoodDetails,
    filter: 'all' | 'liked',
    isLoading: boolean,
    error: string | undefined,
}

export interface FoodDetails {
    analyzedInstructions: Array<any>,
    title: string,
    diets: Array<string>,
    extendedIngredients: Array<any>,
    id: number,
    image: string,
    pricePerServing: number,
    readyInMinutes: number,
}

export interface IFetchFoodDetailsParams {
    id: string;
    queryParams?: {
        includeNutrition?: boolean;
        addWinePairing?: boolean;
        addTasteData?: boolean;
    };
}