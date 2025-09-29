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
    const videoSource1 = document.getElementById("video-source1");
    const videoSource2 = document.getElementById("video-source2");
    const videoSource3 = document.getElementById("video-source3");


    

    // Função para carregar o vídeo selecionado
// Função para carregar o vídeo do YouTube ao selecionar o atleta
function carregarVideo(atletaKey) {
  // Referência para o atleta no Firebase
  const atletaRef = ref(db, `avaliacaodejuradoE/classificatória/1º Jogo/juradoE/${atletaKey}`);
  
  onValue(atletaRef, (snapshot) => {
    const dadosAtleta = snapshot.val();

    if (dadosAtleta && dadosAtleta.video) {
      // Atualiza o título do vídeo com o nome do atleta
      const videoTitle = document.getElementById("video-title");
      videoTitle.textContent = dadosAtleta.nome;

      // Atualiza o iframe com o link do vídeo do YouTube
      const videoIframe = document.getElementById('video-atleta');
      videoIframe.src = `https://www.youtube.com/embed/${getYouTubeVideoId(dadosAtleta.video)}`;

      // Exibe o contêiner de vídeo
      const videoContainer = document.getElementById("video-container");
      videoContainer.style.display = "block"; // Exibe o contêiner de vídeo
      document.querySelector(".avaliacao-box1").style.display = "none"; // Esconde a seleção de atletas
    } else {
      alert("Vídeo não encontrado para este atleta.");
    }
  });
}

// Função para extrair o ID do vídeo do YouTube da URL
function getYouTubeVideoId(url) {
  const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/)([a-zA-Z0-9_-]{11}))/;
  const match = url.match(regex);
  return match && match[1] ? match[1] : null;
}


// Função para carregar atletas no seletor
function carregarAtletas() {
  const seletorAtletas = document.getElementById("atleta1");
  const atletasRef = ref(db, "avaliacaodejuradoE/classificatória/1º Jogo/juradoE");

  onValue(atletasRef, (snapshot) => {
    seletorAtletas.innerHTML = "<option value=''>Selecione um Atleta</option>"; // Limpa as opções
    snapshot.forEach(childSnapshot => {
      const atletaKey = childSnapshot.key;
      const atleta = childSnapshot.val();
      const option = document.createElement("option");
      option.value = atletaKey;
      option.textContent = atleta.nome;
      seletorAtletas.appendChild(option);
    });
  });
}

// Carregar atletas quando a página for carregada
window.onload = carregarAtletas;

  
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