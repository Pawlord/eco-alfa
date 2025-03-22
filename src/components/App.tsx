import { useEffect } from 'react'

// Компоненты
import Header from './Header';
import ListItem from './ListItem';

// Стили
import '../styles/app.scss';

// Redux
import { fetchFood } from '@/store/foodSlice';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import ProductList from './ProductList';
import Empty from './Empty';

export const App = () => {
    const { products, filter, isLoading } = useAppSelector(state => state.food);
    const filteredProducts = filter === 'all'
        ? products
        : products.filter(product => product.like);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchFood());
    }, [dispatch])

    if (isLoading) {
        return <h2>Загрузка...</h2>
    }

    return (
        <div>
            <Header />
            <div className="list-container">
                {
                    filteredProducts.length > 0
                        ? <ProductList filteredProducts={filteredProducts} />
                        : <Empty />
                }
            </div>
        </div>
    )
}
