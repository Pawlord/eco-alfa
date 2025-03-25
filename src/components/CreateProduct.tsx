import '../styles/create-product.scss';
import { FoodDetails } from '@/types/reduxTypes';
import { FormatFoodItem } from '@/types/types';

// React
import { useRef } from 'react';
import clsx from 'clsx';

// Кастомные хуки
import { useForm } from '@/lib/useForm';

// Redux
import { useAppDispatch } from '@/store/hook';
import { addLocalProduct } from '@/store/foodSlice';
import { Link, useNavigate } from 'react-router-dom';

export default function CreateProduct() {
    const { formProduct, ingredientsString, handleBlur, handleTextClick, handleChange, handleFileChange, addStep, handleIngredientsChange, handleInstructionsChange, handleDietsChange, setFormProduct } = useForm();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const fileInput = useRef<HTMLInputElement>(null);

    const handleDivClick = () => {
        if (fileInput.current) {
            fileInput.current.click();
        }
    }

    const validateForm = (): boolean => {
        let isValid = true;
        const newFormProduct = { ...formProduct };

        // Валидация title
        if (formProduct.title.value.trim() === '') {
            newFormProduct.title.error = 'This field is required';
            isValid = false;
        } else {
            newFormProduct.title.error = '';
        }

        // Валидация extendedIngredients (минимум 1 ингредиент)
        if (formProduct.extendedIngredients.value.length === 0 || formProduct.extendedIngredients.value[0].aisle === '') {
            newFormProduct.extendedIngredients.error = 'This field is required';
            isValid = false;
        } else {
            newFormProduct.extendedIngredients.error = '';
        }

        // Валидация image (обязательно наличие изображения)
        if (!formProduct.image.value) {
            newFormProduct.image.error = 'This field is required';
            isValid = false;
        } else {
            newFormProduct.image.error = '';
        }

        //Валидация analyzedInstructions
        if (formProduct.analyzedInstructions.value.length === 0 || formProduct.analyzedInstructions.value[0].step === '') {
            newFormProduct.analyzedInstructions.error = 'This field is required'
            isValid = false;
        } else {
            newFormProduct.analyzedInstructions.error = ''
        }

        //Валидация diets
        if (formProduct.diets.value.length === 0 || formProduct.diets.value[0] === '') {
            newFormProduct.diets.error = 'This field is required'
            isValid = false;
        } else {
            newFormProduct.diets.error = ''
        }

        // Валидация pricePerServing (должно быть больше 0)
        if (formProduct.pricePerServing.value <= 0) {
            newFormProduct.pricePerServing.error = 'Price must be greater than 0';
            isValid = false;
        } else {
            newFormProduct.pricePerServing.error = '';
        }

        // Валидация readyInMinutes (должно быть больше 0)
        if (formProduct.readyInMinutes.value <= 0) {
            newFormProduct.readyInMinutes.error = 'Ready in minutes must be greater than 0';
            isValid = false;
        } else {
            newFormProduct.readyInMinutes.error = '';
        }


        setFormProduct(newFormProduct);

        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const isValid = validateForm();

        if (!isValid) {
            alert('Проверьте правильность заполнения формы! Все поля должны быть заполнены!')
        } else {
            alert('Форма успешно прошла валидацию!');
            const previewProduct: FormatFoodItem = {
                id: formProduct.id,
                title: formProduct.title.value,
                image: formProduct.image.value,
                like: false,
                isLocal: true,
            }
            const productDetails: FoodDetails = {
                id: formProduct.id,
                title: formProduct.title.value,
                extendedIngredients: formProduct.extendedIngredients.value,
                image: formProduct.image.value,
                analyzedInstructions: formProduct.analyzedInstructions.value,
                diets: formProduct.diets.value,
                pricePerServing: formProduct.pricePerServing.value,
                readyInMinutes: formProduct.readyInMinutes.value,
            }
            dispatch(addLocalProduct({ foodItem: previewProduct, foodDetails: productDetails }));
            navigate('/');
        }
    }

    return (
        <div className="create-container">
            <Link to={'/'} className='home-link'>На главную</Link>
            <div className="create-window">
                <div className="create-wrapper">
                    <h2>Создание продукта</h2>

                    <form className="create-form">
                        <div className="create-form__title input-block">
                            {
                                formProduct.title.isEdit
                                    ? (
                                        <>
                                            <input
                                                name='title'
                                                onChange={e => handleChange(e)}
                                                onBlur={() => handleBlur('title')}
                                                type='text'
                                                className={clsx('title-input input', formProduct.title.error && 'input-error')}
                                                placeholder='Название рецепта...'
                                                value={formProduct.title.value}
                                                required
                                            />
                                            {
                                                formProduct.title.error &&
                                                <span className='error-message'>
                                                    {formProduct.title.error}
                                                </span>
                                            }
                                        </>
                                    )
                                    : <h2
                                        className='editing-block'
                                        onClick={() => handleTextClick('title')}>
                                        {formProduct.title.value}
                                    </h2>
                            }
                        </div>

                        <div className="create-form__ingredients input-block">
                            {
                                formProduct.extendedIngredients.isEdit
                                    ? (
                                        <>
                                            <input
                                                type='text'
                                                onBlur={() => { formProduct.extendedIngredients.value && handleBlur('extendedIngredients') }}
                                                onChange={e => handleIngredientsChange(e)}
                                                value={ingredientsString}
                                                className={clsx('ingredients-input input', formProduct.extendedIngredients.error && 'input-error')}
                                                name='extendedIngredients'
                                                placeholder='Ингредиенты...'
                                                required
                                            />
                                            {
                                                formProduct.extendedIngredients.error &&
                                                <span className='error-message'>
                                                    {formProduct.extendedIngredients.error}
                                                </span>
                                            }
                                        </>
                                    )
                                    : <p
                                        style={{ width: '100%' }}
                                        className='editing-block'
                                        onClick={() => handleTextClick('extendedIngredients')}
                                    >
                                        <b>Ингредиенты:</b> {ingredientsString}
                                    </p>
                            }
                        </div>

                        <div className="create-form__instructions input-block">
                            <div className="image">
                                {
                                    formProduct.image.value
                                        ? (<div className='uploaded-image'>
                                            <img src={formProduct.image.value} alt='product' />
                                        </div>)
                                        : (
                                            <div
                                                className={clsx("image__upload-button", formProduct.image.error && 'image-error')}
                                                onClick={handleDivClick}
                                            >
                                                <p className='upload-text'>Загрузить фото</p>
                                                <input
                                                    onChange={e => handleFileChange(e)}
                                                    className='image__input'
                                                    type="file"
                                                    name='image'
                                                    ref={fileInput}
                                                    accept="image/*"
                                                />
                                            </div>)
                                }


                            </div>
                            <div className="instructions">
                                <button
                                    type='button'
                                    onClick={addStep}
                                    className='instructions__add-step form-button'
                                >
                                    Добавить шаг
                                </button>

                                <ul className='instructions__list'>
                                    {
                                        formProduct.analyzedInstructions.value.map(step => (
                                            <li key={step.number}>
                                                {
                                                    formProduct.analyzedInstructions.isEdit
                                                        ? (
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    className={clsx('instruction-input input', formProduct.analyzedInstructions.error && 'input-error')}
                                                                    onChange={e => handleInstructionsChange(e, step.number)}
                                                                    onBlur={() => handleBlur('analyzedInstructions')}
                                                                    value={step.step}
                                                                    placeholder='Рецепт...'
                                                                    required
                                                                />
                                                                {
                                                                    formProduct.analyzedInstructions.error &&
                                                                    <span className='error-message'>
                                                                        {formProduct.analyzedInstructions.error}
                                                                    </span>
                                                                }
                                                            </>

                                                        )
                                                        : <p
                                                            className='editing-block'
                                                            onClick={() => handleTextClick('analyzedInstructions')}
                                                        >
                                                            {step.step}
                                                        </p>
                                                }

                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>

                        <div className="create-form__diets input-block">
                            {
                                formProduct.diets.isEdit
                                    ? (
                                        <>
                                            <input
                                                onBlur={() => handleBlur('diets')}
                                                onChange={e => handleDietsChange(e)}
                                                value={formProduct.diets.value}
                                                className={clsx('diets-input input', formProduct.diets.error && 'input-error')}
                                                name='diets'
                                                placeholder='Для каких диет...'
                                            />
                                            {
                                                formProduct.diets.error &&
                                                <span className='error-message'>
                                                    {formProduct.diets.error}
                                                </span>
                                            }
                                        </>
                                    )
                                    : <p
                                        style={{ width: '100%' }}
                                        className='editing-block'
                                        onClick={() => handleTextClick('diets')}
                                    >
                                        <b>Диеты:</b> {formProduct.diets.value}
                                    </p>
                            }
                        </div>

                        <div className="create-form__price input-block">
                            {
                                formProduct.pricePerServing.isEdit
                                    ? (
                                        <>
                                            <input
                                                type='number'
                                                onBlur={() => handleBlur('pricePerServing')}
                                                onChange={e => handleChange(e)}
                                                value={formProduct.pricePerServing.value || ''}
                                                className={clsx('price-input input', formProduct.pricePerServing.error && 'input-error')}
                                                name='pricePerServing'
                                                placeholder={'Цена'}
                                            />

                                            {
                                                formProduct.pricePerServing.error &&
                                                <span className='error-message'>
                                                    {formProduct.pricePerServing.error}
                                                </span>
                                            }
                                        </>
                                    )
                                    : <p
                                        style={{ width: '100%' }}
                                        className='editing-block'
                                        onClick={() => handleTextClick('pricePerServing')}
                                    >
                                        <b>Цена:</b> {formProduct.pricePerServing.value}
                                    </p>
                            }
                        </div>

                        <div className="create-form__time input-block">
                            {
                                formProduct.readyInMinutes.isEdit
                                    ? (
                                        <>
                                            <input
                                                type='number'
                                                onBlur={() => handleBlur('readyInMinutes')}
                                                onChange={e => handleChange(e)}
                                                value={formProduct.readyInMinutes.value || ''}
                                                className={clsx('time-input input', formProduct.readyInMinutes.error && 'input-error')}
                                                name='readyInMinutes'
                                                placeholder={'Время приготовления'}
                                                required
                                            />
                                            {
                                                formProduct.readyInMinutes.error &&
                                                <span className='error-message'>
                                                    {formProduct.readyInMinutes.error}
                                                </span>
                                            }
                                        </>
                                    )
                                    : <p
                                        style={{ width: '100%' }}
                                        className='editing-block'
                                        onClick={() => handleTextClick('readyInMinutes')}
                                    >
                                        <b>Время приготовления (мин):</b> {formProduct.readyInMinutes.value}
                                    </p>
                            }
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="create-form__create-button form-button"
                        >
                            Создать
                        </button>
                    </form>
                </div>
            </div >
        </div >
    )
}