import styles from './homealternative.module.css'
import locIcon from '../../assets/icons/loc.png'; // <-- Import the image

function SearchBar() {
    return (
        <div className={styles.SearchBar}>
            <img src={locIcon} alt="Ícone de pesquisa" className={styles.icon}/>
            <input type="text" placeholder="Pesquise por um curso para encontrar o stand!" className={styles.input}/>
        </div>
    );
}

export default SearchBar;