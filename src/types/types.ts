export type FoodItem = {
    id: number,
    title: string,
    image: string,
    imageType?: string,
    isLocal?: boolean,
}

export type Like = {
    like: boolean,
}

export type FormatFoodItem = FoodItem & Like;

export type Response = {
    number: number,
    offset: number,
    results: FoodItem[],
    totalResult: number,
}