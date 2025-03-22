// Стили
import '../styles/delete-button.scss';
import { ReactComponent as DeleteBtn } from '../assets/delete.svg';

export default function DeleteButton() {
    return (
        <div className="delete">
            <DeleteBtn />
        </div>
    )
}