import { FormatFoodItem } from "./types";

export type FoodState = {
    products: FormatFoodItem[],
    filter: 'all' | 'liked', // 'all', 'liked'
    isLoading: boolean,
    error: string | undefined,
}