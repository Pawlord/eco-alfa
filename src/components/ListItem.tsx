// Стили
import '../styles/list-item.scss';

// Иконка
import { ReactComponent as LikeBtn } from '../assets/like.svg';
import DeleteButton from './DeleteButton';
import clsx from 'clsx';

// Redux
import { useAppDispatch } from '@/store/hook';
import { toggleLike, deleteProduct } from '@/store/foodSlice';

type Props = {
    id: number,
    title: string,
    imageUrl: string,
    isLike: boolean,
}

export default function ListItem({ id, title, imageUrl, isLike }: Props) {

    const dispatch = useAppDispatch();

    return (
        <li className="list-item">
            <div className="image-container">
                <img className="image-container__img" src={imageUrl} alt="food" />
                <div
                    onClick={() => dispatch(toggleLike(id))}
                    className={clsx("like-btn-container", isLike && 'like-active', isLike ? 'visible' : 'invisible')}
                >
                    <LikeBtn />
                </div>
                <div
                    onClick={() => dispatch(deleteProduct(id))}
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
}