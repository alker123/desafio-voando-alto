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

const db = getDatabase(appLeitura);
const db1 = getDatabase(appEscrita);
 
 // Elementos do DOM
    const atletaSelect = document.getElementById("atleta1");
    const videoContainer = document.getElementById("video-container");
    const videoTitle = document.getElementById("video-title");
    const videoAtleta = document.getElementById("video-atleta");
    const videoSource = document.getElementById("video-source");


    // Função para carregar os atletas do Firebase
    function carregarAtletas() {
      const atletaRef = ref(db, "avaliacaodejuradoE/classificatória/1º Jogo/juradoE");
      onValue(atletaRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          for (const atletaId in data) {
            const atleta = data[atletaId];
            const option = document.createElement("option");
            option.value = atletaId;  // Usando o ID único do atleta
            option.textContent = atleta.nome;  // Nome do atleta
            atletaSelect.appendChild(option);
          }
        }
      });
    }

    // Função para carregar o vídeo selecionado
    function carregarVideo(atletaKey) {
      const atletaRef = ref(db, `avaliacaodejuradoE/classificatória/1º Jogo/juradoE/${atletaKey}`);
      onValue(atletaRef, (snapshot) => {
        const dadosAtleta = snapshot.val();
        if (dadosAtleta && dadosAtleta.video) {
          // Atualiza o título do vídeo e o caminho
          videoTitle.textContent = dadosAtleta.nome;
          videoSource.src = dadosAtleta.video; // Caminho do vídeo (local)
          videoAtleta.load(); // Recarrega o vídeo
          videoContainer.style.display = "block"; // Exibe o contêiner
        }
      });
    }

    function carregarVideo(videoIndex) {
    const videoAtleta = document.getElementById('video-atleta');
    const sources = videoAtleta.getElementsByTagName('source');
    
    // Verifica se o índice é válido
    if (videoIndex >= 0 && videoIndex < sources.length) {
        // Altera o 'src' do source selecionado
        sources[videoIndex].src = "{{ url_for('static', filename='videos/video" + (videoIndex + 1) + ".mp4') }}";
        videoAtleta.load();  // Recarrega o vídeo
        videoAtleta.play();  // Inicia o vídeo
    }
}


    // Carregar atletas ao iniciar
    carregarAtletas();

    // Evento para selecionar um atleta
    atletaSelect.addEventListener("change", (event) => {
      const atletaKey = event.target.value;
      if (atletaKey) {
        carregarVideo(atletaKey); // Carregar o vídeo do atleta selecionado
      } else {
        videoContainer.style.display = "none"; // Esconder o vídeo se nenhum atleta for selecionado
      }
    });