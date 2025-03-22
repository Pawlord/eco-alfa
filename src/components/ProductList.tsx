import ListItem from "./ListItem";
import type { FormatFoodItem } from "@/types/types";

type Props = {
    filteredProducts: FormatFoodItem[],
}

export default function ProductList({ filteredProducts }: Props) {
    return (
        <ul className='list'>
            {
                filteredProducts.map(item =>
                    <ListItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        imageUrl={item.image}
                        isLike={item.like}
                    />
                )
            }
        </ul>
    )
}