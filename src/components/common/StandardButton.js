import global from './global.module.css'

// A standard button component that if the users want to, they add a onSubmit

function StandardButton({ label, type }) {
    return (
        <button className={global.StandardButton} type={type}>
            {label}
        </button>
    );
}

export default StandardButton;
