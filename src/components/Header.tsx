// Стили
import '../styles/header.scss';

// Redux
import { useAppDispatch } from '@/store/hook';
import { setFilter } from '@/store/foodSlice';

// React
import { useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

export default function Header() {
    const [activeFilter, setActiveFilter] = useState('all');
    const dispatch = useAppDispatch();

    return (
        <div className="header">
            <Link to={'/create-product'} className='create-product-link'>Создать</Link>
            <div className="header__filters">
                <button
                    className={clsx('all-filter filter', activeFilter === 'all' && 'active')}
                    onClick={() => {
                        dispatch(setFilter('all'));
                        setActiveFilter('all')
                    }}
                >
                    Все
                </button>
                <button
                    className={clsx('liked-filter filter', activeFilter === 'liked' && 'active')}
                    onClick={() => {
                        dispatch(setFilter('liked'));
                        setActiveFilter('liked');
                    }}
                >
                    Избранное
                </button>
            </div>
        </div>
    )
}