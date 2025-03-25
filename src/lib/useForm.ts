import { useMemo, useState } from 'react';

type StringFieldState = {
    value: string,
    isEdit: boolean,
    error: string,
}

type NumFieldState = {
    value: number,
    isEdit: boolean,
    error: string,
}

type ArrFieldState = {
    value: Array<any>,
    isEdit: boolean,
    error: string,
}

interface IFormProductState {
    id: number,
    title: StringFieldState,
    extendedIngredients: ArrFieldState,
    image: {
        value: string | '',
        isEdit: boolean,
        error: string,
    },
    analyzedInstructions: ArrFieldState,
    diets: ArrFieldState,
    pricePerServing: NumFieldState,
    readyInMinutes: NumFieldState,
}

export const useForm = () => {
    const [formProduct, setFormProduct] = useState<IFormProductState>({
        id: Math.floor(Math.random() * 1000000),
        title: {
            value: '',
            isEdit: true,
            error: '',
        },
        extendedIngredients: {
            value: [],
            isEdit: true,
            error: '',
        },
        image: {
            value: '',
            isEdit: true,
            error: '',
        },
        analyzedInstructions: {
            value: [],
            isEdit: true,
            error: '',
        },
        diets: {
            value: [],
            isEdit: true,
            error: '',
        },
        pricePerServing: {
            value: 0,
            isEdit: true,
            error: '',
        },
        readyInMinutes: {
            value: 0,
            isEdit: true,
            error: '',
        },
    })

    const concatString = (arr: Array<any>) => {
        const temp: Array<string> = arr.map(item => item.aisle);

        return temp.join(',');
    }

    const ingredientsString = useMemo(() => {
        return concatString(formProduct.extendedIngredients.value);
    }, [formProduct.extendedIngredients]);


    const handleBlur = (fieldName: keyof IFormProductState) => {
        setFormProduct(prevFormProduct => {
            const fieldValue = prevFormProduct[fieldName];

            if (typeof fieldValue === 'object' && fieldValue !== null) {
                return {
                    ...prevFormProduct,
                    [fieldName]: {
                        ...fieldValue,
                        isEdit: false
                    }
                };
            } else {
                return prevFormProduct;
            }
        })
    }

    const handleTextClick = (fieldName: keyof IFormProductState) => {
        setFormProduct(prevFormProduct => {
            const fieldValue = prevFormProduct[fieldName];

            if (typeof fieldValue === 'object' && fieldValue !== null) {
                return {
                    ...prevFormProduct,
                    [fieldName]: {
                        ...fieldValue,
                        isEdit: true,
                    }
                };
            } else {
                return prevFormProduct;
            }
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof IFormProductState;
        const value = e.target.value;

        setFormProduct(prevFormProduct => {
            const fieldValue = prevFormProduct[name];

            if (typeof fieldValue === 'object' && fieldValue !== null) {
                return {
                    ...prevFormProduct,
                    [name]: {
                        ...fieldValue,
                        value,
                        error: '',
                    }
                }
            } else {
                return prevFormProduct;
            }

        });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            console.log(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                console.log(reader)
                setFormProduct({
                    ...formProduct,
                    image: {
                        ...formProduct.image,
                        value: reader.result as string,
                    },
                })
            }
            reader.readAsDataURL(file);
        } else {
            setFormProduct({
                ...formProduct,
                image: {
                    ...formProduct.image,
                    value: '',
                },
            });
        }
    }

    const addStep = () => {
        setFormProduct({
            ...formProduct,
            analyzedInstructions: {
                ...formProduct.analyzedInstructions,
                value: [...formProduct.analyzedInstructions.value, { number: formProduct.analyzedInstructions.value.length + 1, step: '' }]
            }
        })
    }

    const handleIngredientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const ingArr = e.target.value.split(',');
        const newIngredients = ingArr.map((item, index) => ({ id: index + 1, aisle: item }));
        setFormProduct({
            ...formProduct,
            extendedIngredients: {
                ...formProduct.extendedIngredients,
                value: newIngredients,
                error: '',
            },
        })
    }

    const handleInstructionsChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const newStep = formProduct.analyzedInstructions.value.map(step => {
            if (step.number === id) {
                return { ...step, step: e.target.value }
            } else {
                return step
            }
        })
        setFormProduct({
            ...formProduct,
            analyzedInstructions: {
                ...formProduct.analyzedInstructions,
                value: newStep,
            },
        });
    }

    const handleDietsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const res = e.target.value.split(',');
        setFormProduct({
            ...formProduct,
            diets: {
                ...formProduct.diets,
                value: res,
                error: '',
            },
        })
    }

    return {
        formProduct,
        ingredientsString,
        handleBlur,
        handleTextClick,
        handleChange,
        handleFileChange,
        addStep,
        handleIngredientsChange,
        handleInstructionsChange,
        handleDietsChange,
        setFormProduct,
    }
}