// Стили
import '../styles/list-item.scss';

// Иконка
import { ReactComponent as LikeBtn } from '../assets/like.svg';
import DeleteButton from './DeleteButton';
import clsx from 'clsx';

// Redux
import { useAppDispatch } from '@/store/hook';
import { toggleLike, deleteProduct } from '@/store/foodSlice';

// React
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
    id: number,
    title: string,
    imageUrl: string,
    isLike: boolean,
}

export default function ListItem({ id, title, imageUrl, isLike }: Props) {
    const likeRef = useRef<HTMLDivElement | null>(null);
    const deleteRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const handleLikeClick = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
        e.stopPropagation();
        console.log('like click')
        if (likeRef.current?.contains(e.target as Node)) {
            dispatch(toggleLike(id))
        }
    }

    const handleDeleteClick = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
        e.stopPropagation();
        console.log('delete click')
        if (deleteRef.current?.contains(e.target as Node)) {
            dispatch(deleteProduct(id))
        }
    }

    const handleLinkClick = (e: React.MouseEvent<HTMLElement>) => {
        if (likeRef.current?.contains(e.target as Node) || deleteRef.current?.contains(e.target as Node)) {
            e.preventDefault();
        }
        console.log(id)
        navigate(`/product/${id}`)
    }

    return (
        <li className="list-item" onClick={e => handleLinkClick(e)}>
            <div className="image-container">
                <img className="image-container__img" src={imageUrl} alt="food" />
                <div
                    ref={likeRef}
                    onClick={e => handleLikeClick(e, id)}
                    className={clsx("like-btn-container", isLike && 'like-active', isLike ? 'visible' : 'invisible')}
                >
                    <LikeBtn />
                </div>
                <div
                    ref={deleteRef}
                    onClick={e => handleDeleteClick(e, id)}
                    className="delete-btn-container"
                >
                    <DeleteButton />
                </div>
            </div>
            <div className='divide-line' />
            <div className="list-item__title">
                {title}
            </div>
        </li>
    )
};

