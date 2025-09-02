import global from '../global.module.css'

function Link({ href, children }) {
    return (
        <a href={href} className={global.link}>
            {children}
        </a>
    );
}

export default Link;