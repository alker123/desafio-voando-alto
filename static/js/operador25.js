import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// ===== Configurações Firebase =====
const appLeitura = initializeApp(
  { databaseURL: "https://sengu-abc16-default-rtdb.firebaseio.com/" },
  "leitura"
);
const appEscrita = initializeApp(
  { databaseURL: "https://princi-4dfd7-default-rtdb.firebaseio.com/" },
  "Escrita"
);

const db1 = getDatabase(appLeitura);
const db2 = getDatabase(appEscrita);

document.addEventListener("DOMContentLoaded", function() {


    // Botão e div mandar atleta para operador
    const botaoJurado1 = document.getElementById('enviar-jurado1');
    const containerEnviarJurado = document.getElementById('operadorj1');

    botaoJurado1.addEventListener('click', function() {
        // Esconde a div de usuário se estiver visível
        
        
        containerTabela.style.display = 'none';
        containerTela.style.display = 'none'; // Esconder
        
        

        // Alterna a visibilidade da div de categoria
        if (containerEnviarJurado.style.display === 'none' || containerEnviarJurado.style.display === '') {
            containerEnviarJurado.style.display = 'block'; // Mostrar
        } else {
            containerEnviarJurado.style.display = 'none'; // Esconder
        }
    });


    // Botão e div tabela
    const botaoTabela = document.getElementById('planilha1');
    const containerTabela = document.getElementById('container-tabelas');

    botaoTabela.addEventListener('click', function() {
        // Esconde a div de usuário se estiver visível
        
        
        containerEnviarJurado.style.display = 'none';
        containerTela.style.display = 'none'; // Esconder
        

        // Alterna a visibilidade da div de categoria
        if (containerTabela.style.display === 'none' || containerTabela.style.display === '') {
            containerTabela.style.display = 'block'; // Mostrar
        } else {
            containerTabela.style.display = 'none'; // Esconder
        }
    });

    // Botão e div tela
    const botaoTela = document.getElementById('tela1');
    const containerTela = document.getElementById('container-tela');
    const containerTela1 = document.getElementById('header');
    const containerTela3 = document.getElementById('header3');

    botaoTela.addEventListener('click', function() {
        // Esconde a div de usuário se estiver visível
        
        
        containerEnviarJurado.style.display = 'none';
        containerTabela.style.display = 'none'; // Esconder
        containerTela1.style.display = 'none'; // Esconder
        containerTela3.style.display = 'none'; // Esconder
        

        // Alterna a visibilidade da div de categoria
        if (containerTela.style.display === 'none' || containerTela.style.display === '') {
            containerTela.style.display = 'block'; // Mostrar
        } else {
            containerTela.style.display = 'none'; // Esconder
        }
    });

    // Botão e div tabela
    const botaoVoltar3 = document.getElementById('voltar3');
    

    botaoVoltar3.addEventListener('click', function() {
        // Esconde a div de usuário se estiver visível
        
        
        containerEnviarJurado.style.display = 'none';
        containerTela.style.display = 'none'; // Esconder
        containerTela1.style.display = 'block'; // Esconder
        containerTela3.style.display = 'block'; // Esconder
        
    });

});
