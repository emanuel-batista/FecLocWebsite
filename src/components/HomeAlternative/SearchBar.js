import styles from './homealternative.module.css'
import locIcon from '../../assets/icons/loc.png'; // <-- Import the image
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function SearchBar() {
    return (
        <div className={styles.SearchBar}>
            <img src={locIcon} alt="Ícone de pesquisa" className={styles.icon}/>
            <input type="text" placeholder="Pesquise por um curso para encontrar o stand!" className={styles.input}/>
            <AccountCircleIcon className={styles.accountIcon} sx={{ fontSize: 16 }}/>

        </div>
    );
}

export default SearchBar;