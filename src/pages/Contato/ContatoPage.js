import styles from "./ContatoPage.module.css";

function ContatoPage() {
  return (
    <div className={styles.contatoPage}>
      <h1>Contato</h1>
      <p>
        Fale conosco pelo email: contato@fecloc.com <br />
        Telefone: (11) 99999-9999
      </p>
    </div>
  );
}

export default ContatoPage;
