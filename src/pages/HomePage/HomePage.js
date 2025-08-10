import styles from "./HomePage.module.css";
import googleBadge from "../../assets/google-badge.webp";
import aplleBadge from "../../assets/apple-badge.webp";
import printApp from "../../assets/print-app.jpg";


function HomePage() {
    return (
        <div className={styles.homepage}>
            <div className={styles.container}>
                <h1 className={styles.title}>Fecloc: o aplicativo de localização da <span className={styles.fec}>Fec!</span></h1>
                <div className={styles.downloads}>
                    <img src={googleBadge} alt="Download no Google Play Store" className={styles.badgeplay}/>
                </div>
            </div>
            <img src={printApp} alt="Aplicativo Fecloc" className={styles.printApp}/>
        </div>
    );
}

export default HomePage;