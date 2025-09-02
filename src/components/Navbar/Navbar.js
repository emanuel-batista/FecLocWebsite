import { Link } from 'react-router-dom';
import { Logo } from "assets";
import styles from "./Navbar.module.css";


function Navbar() {


  return (
    // Use className e o objeto 'styles' para aplicar a classe
    <div className={styles.navbar}>
      <Link to="/home"><Logo className={styles.Logo} /></Link>
    </div>
  );
}

export default Navbar;