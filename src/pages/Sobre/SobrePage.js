import styles from "./SobrePage.module.css";
import Logotipo from '../../assets/Logotipo.svg'; 

function SobrePage() {
  return (
    <div className={styles.sobrePage}>
      <div className={styles.contentContainer}>

        <h1 className={styles.title}>Sobre o Fecloc</h1>
        <h2 className={styles.subtitle}>Conectando pessoas aos cursos da Uniara</h2>
        <img src={Logotipo} alt="Logo do Fecloc" style={{ width: '190px', marginBottom: '10px' }}/>
        
        <p>
          O Fecloc nasceu com uma missão divertida: o intuito é fazer com que o 
          visitante da fec consiga se localizar dentro do evento e motiva-lo a passar pelos
          stands de todos os cursos para conhecer e responder quizzes que podem garantir um prêmio
          no fim do dia!
        </p>
        <p>
          Com o Fecloc, você não apenas se 
          localiza, mas também faz parte de um evento vibrante cheio de experiências.
        </p>
      </div>
    </div>
  );
}

export default SobrePage;
