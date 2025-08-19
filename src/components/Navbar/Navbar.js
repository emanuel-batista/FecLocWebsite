import { Link } from 'react-router-dom';
import { Menu, Logo } from "assets";
import styles from "./Navbar.module.css";
import { useState } from "react";

function Navbar() {
    const [menuAberto, setMenuAberto] = useState(false);

    return (
        // Use className e o objeto 'styles' para aplicar a classe
         <div className={styles.navbar}>
      <Link to="/"><Logo /></Link>

      <ul className={menuAberto ? `${styles.itensNav} ${styles.active}` : styles.itensNav}>
        <li className={styles.itemNav}><Link to="/sobre">Sobre</Link></li>
        <li className={styles.itemNav}><Link to="/contato">Contato</Link></li>             
      </ul>

      <Link to="/" className={styles.ctaButton}>Baixe agora!</Link> 
      <Menu onClick={() => setMenuAberto(!menuAberto)} className={styles.menu}/>
    </div>
    );
}

export default Navbar;