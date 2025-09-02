import styles from "./SobrePage.module.css";
import Logotipo from '../../assets/Logotipo.svg'; 
import Emanuel from "../../assets/emanuel.jpeg";
import Otavio from "../../assets/otavio.jpg";

function SobrePage() {

const membros = [
    {
      nome: "Otavio Chile",
      especialidade: "Java, C e MySql",
      foto: Otavio,
      github: "https://github.com/seu-github",
      linkedin: "https://linkedin.com/in/seu-linkedin",
    },
    {
      nome: "Emanuel Batista",
      especialidade: "Java e C",
      foto: Emanuel,
      github: "https://www.github.com/emanuel-batista",
      linkedin: "https://www.linkedin.com/in/emanuel-b-silva",
    },
    {
      nome: "Paulo Martins",
      especialidade: "Java e C",
      foto: Otavio,
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
    },
    {
      nome: "Gabriela Fernanda",
      especialidade: "Java e C",
      foto: Emanuel,
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
    },
    {
      nome: "Mariana Barbosa",
      especialidade: "Java e C",
      foto: Otavio,
      github: "https://github.com/",
      linkedin: "https://linkedin.com/in/",
    },
  ];


  return (
    <div className={styles.sobrePage}>
      <div className={styles.contentContainer}>

        <h1 className={styles.title}>Sobre o Fecloc</h1>
        <h2 className={styles.subtitle}>Conectando pessoas aos cursos da Uniara</h2>
        <img src={Logotipo} alt="Logo do Fecloc" style={{ width: '190px', marginBottom: '10px' }}/>
        
        <p>
          O Fecloc nasceu com uma missão divertida: o intuito de fazer com que o 
          visitante da fec consiga se <b>localizar</b> dentro do evento e <b>motivá-lo</b> a passar pelos
          stands de todos os cursos para conhecer e <b>responder quizzes</b> que podem garantir um <b>prêmio</b> no fim do dia!
        </p>
        <p>
          Com o Fecloc, você não apenas se 
          localiza, mas também faz parte de um evento vibrante cheio de experiências.
        </p>
      </div>

      <div className={styles.contentContainer}>
      <h1 className={styles.title}>Sobre o Time</h1>

        <div className={styles.teamContainer}>
          {membros.map((membro, index) => (
            <div key={index} className={styles.memberCard}>
              <img src={membro.foto} alt={`Foto de ${membro.nome}`} />
              <h3>{membro.nome}</h3>
              <h5>{membro.especialidade}</h5>
              <a href={membro.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={membro.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          ))}
        </div>

    </div>
    </div>
  );
}

export default SobrePage;
