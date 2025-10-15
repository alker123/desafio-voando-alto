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

const dbLeitura = getDatabase(appLeitura);
const dbEscrita = getDatabase(appEscrita);

// Caminho para o árbitro E
const refArbitroB = ref(dbEscrita, 'arbitros/arbitroB');

// Recuperar os dados do Firebase e preencher o campo de texto
onValue(refArbitroB, (snapshot) => {
    const arbitroB = snapshot.val();  // Recupera o valor de arbitroE no Firebase
    if (arbitroB) {
        // Preenche o campo de entrada com o valor de arbitroE
        document.getElementById("arbitro").value = arbitroB;
    } else {
        console.log("Arbitro B não encontrado no Firebase.");
    }
});

// ===== Elementos do DOM =====
const atletaSelect = document.getElementById("atleta");
const categoriaInput = document.getElementById("categoria");
const ritmoInput = document.getElementById("ritmo");
const faseInput = document.getElementById("fase");
const notaSelect = document.getElementById("nota");
const fotoAtleta = document.getElementById("foto-atleta");
const btnEnviar = document.getElementById("enviar");

let dadosAtletas = {};
const JURADO = "E";

// ===== Função para carregar atletas =====
function carregarAtletas() {
  onValue(ref(dbLeitura, `avaliacaodejuradoE`), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    atletaSelect.innerHTML = "<option value=''>Selecione um atleta</option>";
    dadosAtletas = {};

    for (const fase in data) {
      for (const ritmo in data[fase]) {
        const juradoData = data[fase][ritmo]?.juradoE || {};
        for (const id in juradoData) {
          const atleta = juradoData[id];
          const chave = `${atleta.nome}||${ritmo}`;
          dadosAtletas[chave] = {
            nome: atleta.nome,
            categoria: atleta.categoria,
            ritmo,
            id,
            foto: atleta.foto || "",
            video: atleta.video || "",  // Incluir o campo de vídeo
            fase,
            numero: atleta.numero,
          };

          const option = document.createElement("option");
          option.value = chave;
          option.textContent = `${atleta.numero} - ${atleta.nome}`;
          atletaSelect.appendChild(option);
        }
      }
    }
  });
}

// ===== Preencher seletor de notas 0.0 → 10.0 =====
function preencherNotas() {
  notaSelect.innerHTML = "<option value=''>Nota</option>";
  for (let i = 0.0; i <= 5.0; i += 1.0) {
    const option = document.createElement("option");
    option.value = i.toFixed(1);
    option.textContent = i.toFixed(1);
    notaSelect.appendChild(option);
  }
}

// ===== Atualiza categoria/ritmo/fase ao escolher atleta =====
function carregarFase() {
  const chave = atletaSelect.value;
  const dados = dadosAtletas[chave];

  if (dados) {
    categoriaInput.value = dados.categoria;
    ritmoInput.value = dados.ritmo;
    faseInput.value = dados.fase;
  } else {
    categoriaInput.value = "";
    ritmoInput.value = "";
    faseInput.value = "";
  }
}

// ===== Carregar foto e vídeo do atleta =====
function carregarFotoAtleta() {
  const chave = atletaSelect.value;
  const dados = dadosAtletas[chave];

  const fotoAtletaContainer = document.getElementById("foto-atleta-container");
  const nomeAtletaContainer = document.getElementById("nome-atleta-container");
  const nomeAtleta = document.getElementById("nome-atleta1");

  const videoAtletaContainer = document.getElementById("video-atleta-container");
  const videoAtleta = document.getElementById("video-atleta");
  const videoSource = document.getElementById("video-source");

  if (dados) {
    // Carregar foto do atleta
    if (dados.foto) {
      fotoAtleta.src = dados.foto;
      fotoAtletaContainer.style.display = "block";
    } else {
      fotoAtletaContainer.style.display = "none";
    }

    // Carregar nome do atleta
    nomeAtleta.textContent = dados.nome;
    nomeAtletaContainer.style.display = "block";

   
    // Caso nenhum atleta esteja selecionado, esconder foto e vídeo
    fotoAtletaContainer.style.display = "none";
    nomeAtletaContainer.style.display = "none";
    videoAtletaContainer.style.display = "none";
  }
}


// ===== Enviar nota =====
async function enviarNota() {
  const chave = atletaSelect.value;
  const dados = dadosAtletas[chave];
  const faseSelecionada = faseInput.value;
  const vjogoA = parseFloat(document.getElementById("nota").value); // Nota do VJogoA
  const solo = parseFloat(document.getElementById("floreio").value); // Nota do Solo

  // Verificação se as notas são válidas
  if (!dados || !faseSelecionada || isNaN(vjogoA) || isNaN(solo)) {
    alert("❌ Selecione um atleta e insira notas válidas.");
    return;
  }

  const confirmar = confirm(
    `Deseja realmente enviar as notas separadas (VJogoA: ${vjogoA.toFixed(1)}, Solo: ${solo.toFixed(1)}) para ${dados.nome}?`
  );
  if (!confirmar) return;

  const dadosNota = {
    atleta: dados.nome,
    categoria: dados.categoria,
    foto: dados.foto || "",
    numero: dados.numero || "",
    jurado: JURADO,
    vjogoA: vjogoA.toFixed(1), // Envia a nota de VJogoA separada
    solo: solo.toFixed(1), // Envia a nota de Solo separada
    ritmo: dados.ritmo,
    fase: faseSelecionada,
  };

  const chavePadrao = `${dados.nome}_${dados.categoria}_${dados.ritmo}`.toLowerCase().replace(/\s+/g, "_");

  try {
    await set(
      ref(dbEscrita, `${faseSelecionada}${JURADO}/${dados.ritmo}/${chavePadrao}`),
      dadosNota
    );
    await set(ref(dbEscrita, `avaliado${JURADO}/${dados.ritmo}/${chavePadrao}`), true);

    await set(
      ref(
        dbLeitura,
        `avaliacaodejurado${JURADO}/${faseSelecionada}/${dados.ritmo}/jurado${JURADO}/${dados.id}`
      ),
      null
    );

    // Remove atleta do dropdown e do objeto
    delete dadosAtletas[chave];
    atletaSelect.querySelector(`option[value="${chave}"]`)?.remove();

    // 🔹 Limpa os campos após enviar
    notaSelect.value = "";
    document.getElementById("floreio").value = ""; // Limpar o campo de nota do Solo

    alert(`✅ Notas enviadas separadas para ${dados.nome} (VJogoA: ${vjogoA.toFixed(1)}, Solo: ${solo.toFixed(1)})`);
  } catch (error) {
    console.error("Erro ao enviar a nota:", error);
    alert("❌ Erro ao enviar a nota.");
  }
}


// ===== Eventos =====
atletaSelect.addEventListener("change", () => {
  carregarFase();
  carregarFotoAtleta();
});

// Envio ao clicar no botão
btnEnviar.addEventListener("click", enviarNota);

// ===== Inicialização =====
carregarAtletas();
preencherNotas();

// Obtendo os elementos
    const mostrarVideoBtn = document.getElementById('mostrar-video');
    const voltarBtn = document.getElementById('voltar');
    const avaliacaoBox = document.querySelector('.avaliacao-box');
    const avaliacaoBox1 = document.querySelector('.avaliacao-box1');

    // Adicionando o evento de clique no botão "Ver Vídeo"
    mostrarVideoBtn.addEventListener('click', () => {
      // Esconde a avaliação-box e exibe a avaliação-box1
      avaliacaoBox.style.display = 'none';
      avaliacaoBox1.style.display = 'block';
    });

    // Adicionando o evento de clique no botão "Voltar"
    voltarBtn.addEventListener('click', () => {
      // Volta para a avaliação-box e esconde a avaliação-box1
      avaliacaoBox.style.display = 'block';
      avaliacaoBox1.style.display = 'none';
    });

document.addEventListener('DOMContentLoaded', function() {
  const selectAtleta = document.getElementById('atleta1');
  const iframe = document.getElementById('video1');
  
  // Objetos com os links dos vídeos dos atletas
  const videos = {
    "atleta1": "https://www.youtube.com/embed/cM_BMLOynno?si=bPKAhPDZrsA21X0K",
    "atleta2": "https://www.youtube.com/embed/Pm94zvEyp0s?si=0rdyw8MNd60ed45B" , // Substitua com o URL real 
    "atleta3": "https://www.youtube.com/embed/UKD2Mhf6Gpc?si=_3TjlrJHauWnRCb4" ,  // Substitua com o URL real
    "atleta4": "https://www.youtube.com/embed/TOftQvOprtE?si=_l2_gWDoFsOLHC8Z" // Substitua com o URL real
  };

  // Evento que detecta mudança no seletor de atletas
  selectAtleta.addEventListener('change', function() {
    const atletaSelecionado = selectAtleta.value;

    if (atletaSelecionado && videos[atletaSelecionado]) {
      // Altera o src do iframe para o vídeo do atleta
      iframe.src = videos[atletaSelecionado];
      
      // Exibe o iframe
      iframe.style.display = 'block';
    } else {
      // Se não houver seleção válida, esconde o iframe
      iframe.style.display = 'none';
    }
  });
});
