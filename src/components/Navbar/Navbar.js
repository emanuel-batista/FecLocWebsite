import { Menu, Logo } from "assets";
import styles from "./Navbar.module.css";
import { useState } from "react";

function Navbar() {
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        // Use className e o objeto 'styles' para aplicar a classe
        <div className={styles.navbar}>
            <a href=".navbar"><Logo /></a>

            <ul className={menuAberto ? `${styles.itensNav} ${styles.active}` : styles.itensNav}>
                <li className={styles.itemNav}><a href="/">Sobre</a></li>
                <li className={styles.itemNav}><a href="/">Contato</a></li>             
            </ul>
            <a href="/" className={styles.ctaButton}>Baixe agora!</a> 
            <Menu onClick={() => setMenuAberto(!menuAberto)} className={styles.menu}/>
        </div>
    );
}

export default Navbar;