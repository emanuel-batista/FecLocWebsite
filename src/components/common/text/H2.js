import global from "../global.module.css";

function H2({ children }) {
    //if h2 has more than 15 charachters, reduce its size to 16px
    const fontSize = children.length > 15 ? "16px" : "24px";
    return <h2 className={global.h2} style={{ fontSize }}>{children}</h2>;
}

export default H2;