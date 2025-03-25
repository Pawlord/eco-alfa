import '../styles/product-page.scss';
import { useEffect } from 'react';

// Redux
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { fetchFoodDetails, getLocalProductDetails } from '@/store/foodSlice';

// React router
import { useParams, Link } from 'react-router-dom';

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const { products, productDetails, isLoading, error } = useAppSelector(state => state.food);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (id) {
            const findProduct = products.find(product => Number(id) === product.id);

            if (findProduct?.isLocal) {
                dispatch(getLocalProductDetails(findProduct));
            } else {
                dispatch(fetchFoodDetails({ id }));
            }
        }
    }, [dispatch, id])

    if (isLoading) {
        return <div>Loading product details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!productDetails) {
        return <div>Product not found.</div>;
    }

    return (
        <div className="product-container">
            <div className="product-card">
                <div className="product">
                    <h1 className='product__title'>{productDetails.title}</h1>
                    <div className="product__ingredients">
                        <b>Ингредиенты:</b> {productDetails.extendedIngredients.map(item => (
                            <p key={item.id}>{item.aisle}</p>
                        ))}
                    </div>
                    <div className="product__instruction-cook">
                        <div className="image">
                            <img src={productDetails.image} alt="product" />
                        </div>
                        <div className="instruction">
                            <ul className="instruction__list">
                                {
                                    productDetails.analyzedInstructions.map(item => (
                                        <li className='instruction-item' key={item.number}>{item.step}</li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="product__diet">
                        <b>Подходит для диет:</b> {productDetails.diets.map((item, index) => (
                            <p key={index}>{item}</p>
                        ))}
                    </div>
                    <p className='product__price'><b>Цена:</b>{productDetails.pricePerServing}</p>
                    <p className='product__time-cooking'><b>Время приготовления (мин):</b>{productDetails.readyInMinutes} мин</p>
                    <Link className='product__back' to={'/'}>На главную</Link>
                </div>
            </div>
        </div>
    )
}