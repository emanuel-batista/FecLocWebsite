import global from './global.module.css';

function StandardInput({ type, placeholder, value, onChange }) {
    return (
        <input
            className={global.StandardInput}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
}

export default StandardInput;
