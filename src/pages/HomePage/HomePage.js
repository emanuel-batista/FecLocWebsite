import { Logo } from "assets";
import styles from "./HomePage.module.css";
import { ArrowIcon } from "@mui/icons-material"



function HomePage() {
    return (
        <div className={styles.homepage}>
            <video
                className={styles.backgroundVideo}
                autoPlay
                src="https://www.pexels.com/download/video/3252649/"
                muted
                loop
            />
            <div className={styles.content}>
                <Logo />
                <span>O aplicativo de localização da FEC!</span>
                <a href="/login" className={styles.CTA}>USE AGORA TOTALMENTE ONLINE <ArrowIcon /></a>
            </div>

        </div>
    );
}

export default HomePage;