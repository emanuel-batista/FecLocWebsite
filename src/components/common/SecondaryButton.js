import global from "./global.module.css";

function SecondaryButton({ label, onClick, disabled }) {
    return (
        <button
            className={global.secondaryButton}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
}

export default SecondaryButton;