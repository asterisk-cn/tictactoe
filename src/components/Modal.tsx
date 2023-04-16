import "./Modal.css";

type Props = {
    message: string;
    onClick(): void;
};

export default function Modal({ message, onClick }: Props): JSX.Element {
    return (
        <div className="modal">
            <div className="modal-contents">
                <p>{message}</p>
                <button onClick={onClick}>Play Again</button>
            </div>
        </div>
    );
}
