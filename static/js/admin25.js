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
    // Botão e div para usuário
    const botaoUsuario = document.getElementById('usuario1');
    const containerCadastrarUsuario = document.getElementById('container-cadastrar-usuario');

    botaoUsuario.addEventListener('click', function() {
        // Esconde a div de categoria se estiver visível
        containerAdicionarCategoria.style.display = 'none';
        containerAdicionarAtleta.style.display = 'none';
        containerExcluirAtleta.style.display = 'none';
        containerExcluirCategoria.style.display = 'none';
        containerEnviarJurado.style.display = 'none';
        containerTabela.style.display = 'none';
        containerEO.style.display = 'none';
        
        // Alterna a visibilidade da div de usuário
        if (containerCadastrarUsuario.style.display === 'none' || containerCadastrarUsuario.style.display === '') {
            containerCadastrarUsuario.style.display = 'block'; // Mostrar
        } else {
            containerCadastrarUsuario.style.display = 'none'; // Esconder
        }
    });

    // Botão e div para categoria
    const botaoCategoria = document.getElementById('categoria1');
    const containerAdicionarCategoria = document.getElementById('adic-categoria');

    botaoCategoria.addEventListener('click', function() {
        // Esconde a div de usuário se estiver visível
        containerCadastrarUsuario.style.display = 'none';
        containerAdicionarAtleta.style.display = 'none';
        containerExcluirAtleta.style.display = 'none';
        containerExcluirCategoria.style.display = 'none';
        containerEnviarJurado.style.display = 'none';
        containerTabela.style.display = 'none';
        containerEO.style.display = 'none';

        // Alterna a visibilidade da div de categoria
        if (containerAdicionarCategoria.style.display === 'none' || containerAdicionarCategoria.style.display === '') {
            containerAdicionarCategoria.style.display = 'block'; // Mostrar
        } else {
            containerAdicionarCategoria.style.display = 'none'; // Esconder
        }
    });

    
    // Botão e div para atleta
    const botaoAtleta = document.getElementById('atleta1');
    const containerAdicionarAtleta = document.getElementById('adic-atleta');

    botaoAtleta.addEventListener('click', function() {
        // Esconde a div de usuário se estiver visível
        containerCadastrarUsuario.style.display = 'none';
        containerAdicionarCategoria.style.display = 'none';
        containerExcluirAtleta.style.display = 'none';
        containerExcluirCategoria.style.display = 'none';
        containerEnviarJurado.style.display = 'none';
        containerTabela.style.display = 'none';
        containerEO.style.display = 'none';

        // Alterna a visibilidade da div de categoria
        if (containerAdicionarAtleta.style.display === 'none' || containerAdicionarAtleta.style.display === '') {
            containerAdicionarAtleta.style.display = 'block'; // Mostrar
        } else {
            containerAdicionarAtleta.style.display = 'none'; // Esconder
        }
    });

    // Botão e div para  excuir atleta
    const botaoAtleta1 = document.getElementById('excluir-atleta1');
    const containerExcluirAtleta = document.getElementById('exc-atleta');

    botaoAtleta1.addEventListener('click', function() {
        // Esconde a div de usuário se estiver visível
        containerCadastrarUsuario.style.display = 'none';
        containerAdicionarCategoria.style.display = 'none';
        containerAdicionarAtleta.style.display = 'none';
        containerExcluirCategoria.style.display = 'none';
        containerEnviarJurado.style.display = 'none';
        containerTabela.style.display = 'none';
        containerEO.style.display = 'none';
        

        // Alterna a visibilidade da div de categoria
        if (containerExcluirAtleta.style.display === 'none' || containerExcluirAtleta.style.display === '') {
            containerExcluirAtleta.style.display = 'block'; // Mostrar
        } else {
            containerExcluirAtleta.style.display = 'none'; // Esconder
        }
    });

     // Botão e div para  excuir categoria
    const botaoCategoria1 = document.getElementById('excluir-categoria1');
    const containerExcluirCategoria = document.getElementById('exc-categoria');

    botaoCategoria1.addEventListener('click', function() {
        // Esconde a div de usuário se estiver visível
        containerCadastrarUsuario.style.display = 'none';
        containerAdicionarCategoria.style.display = 'none';
        containerAdicionarAtleta.style.display = 'none';
        containerExcluirAtleta.style.display = 'none';
        containerEnviarJurado.style.display = 'none';
        containerTabela.style.display = 'none';
        containerEO.style.display = 'none';
        

        // Alterna a visibilidade da div de categoria
        if (containerExcluirCategoria.style.display === 'none' || containerExcluirCategoria.style.display === '') {
            containerExcluirCategoria.style.display = 'block'; // Mostrar
        } else {
            containerExcluirCategoria.style.display = 'none'; // Esconder
        }
    });


    // Botão e div mandar atleta para operador
    const botaoJurado1 = document.getElementById('enviar-jurado1');
    const containerEnviarJurado = document.getElementById('operadorj1');

    botaoJurado1.addEventListener('click', function() {
        // Esconde a div de usuário se estiver visível
        containerCadastrarUsuario.style.display = 'none';
        containerAdicionarCategoria.style.display = 'none';
        containerAdicionarAtleta.style.display = 'none';
        containerExcluirAtleta.style.display = 'none';
        containerExcluirCategoria.style.display = 'none';
        containerTabela.style.display = 'none';
        containerEO.style.display = 'none';
        

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
        containerCadastrarUsuario.style.display = 'none';
        containerAdicionarCategoria.style.display = 'none';
        containerAdicionarAtleta.style.display = 'none';
        containerExcluirAtleta.style.display = 'none';
        containerExcluirCategoria.style.display = 'none';
        containerEnviarJurado.style.display = 'none';
        containerEO.style.display = 'none';

        // Alterna a visibilidade da div de categoria
        if (containerTabela.style.display === 'none' || containerTabela.style.display === '') {
            containerTabela.style.display = 'block'; // Mostrar
        } else {
            containerTabela.style.display = 'none'; // Esconder
        }
    });


    // Botão e div enviar para operador
    const botaoEO = document.getElementById('enviar-operador1');
    const containerEO = document.getElementById('operadorj2');

    botaoEO.addEventListener('click', function() {
        // Esconde a div de usuário se estiver visível
        containerCadastrarUsuario.style.display = 'none';
        containerAdicionarCategoria.style.display = 'none';
        containerAdicionarAtleta.style.display = 'none';
        containerExcluirAtleta.style.display = 'none';
        containerExcluirCategoria.style.display = 'none';
        containerEnviarJurado.style.display = 'none';
        containerTabela.style.display = 'none'; 
        

        // Alterna a visibilidade da div de categoria
        if (containerEO.style.display === 'none' || containerEO.style.display === '') {
            containerEO.style.display = 'block'; // Mostrar
        } else {
            containerEO.style.display = 'none'; // Esconder
        }
    });
});
