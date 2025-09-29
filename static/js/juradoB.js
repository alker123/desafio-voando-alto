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

// ===== Elementos do DOM =====
const atletaSelect = document.getElementById("atleta");
const categoriaInput = document.getElementById("categoria");
const ritmoInput = document.getElementById("ritmo");
const faseInput = document.getElementById("fase");
const notaSelect = document.getElementById("nota");
const fotoAtleta = document.getElementById("foto-atleta");
const btnEnviar = document.getElementById("enviar");

let dadosAtletas = {};
const JURADO = "B";

// ===== Função para carregar atletas =====
function carregarAtletas() {
  onValue(ref(dbLeitura, `avaliacaodejuradoB`), (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    atletaSelect.innerHTML = "<option value=''>Selecione um atleta</option>";
    dadosAtletas = {};

    for (const fase in data) {
      for (const ritmo in data[fase]) {
        const juradoData = data[fase][ritmo]?.juradoA || {};
        for (const id in juradoData) {
          const atleta = juradoData[id];
          const chave = `${atleta.nome}||${ritmo}`;
          dadosAtletas[chave] = {
            nome: atleta.nome,
            categoria: atleta.categoria,
            ritmo,
            id,
            foto: atleta.foto || "",
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
  notaSelect.innerHTML = "<option value=''>Selecionar nota</option>";
  for (let i = 0.0; i <= 10.0; i += 1.0) {
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

// ===== Carregar foto do atleta =====
function carregarFotoAtleta() {
  const chave = atletaSelect.value;
  const dados = dadosAtletas[chave];

  const fotoAtletaContainer = document.getElementById("foto-atleta-container");
  const nomeAtletaContainer = document.getElementById("nome-atleta-container");
  const nomeAtleta = document.getElementById("nome-atleta1");

  if (dados && dados.foto) {
    fotoAtleta.src = dados.foto;
    fotoAtletaContainer.style.display = "block";
    nomeAtleta.textContent = dados.nome;
    nomeAtletaContainer.style.display = "block";
  } else {
    fotoAtletaContainer.style.display = "none";
    nomeAtletaContainer.style.display = "none";
  }
}

// ===== Enviar nota =====
async function enviarNota() {
  const chave = atletaSelect.value;
  const dados = dadosAtletas[chave];
  const faseSelecionada = faseInput.value;
  const nota = parseFloat(notaSelect.value);

  if (!dados || !faseSelecionada || isNaN(nota)) {
    alert("❌ Selecione um atleta e uma nota válida.");
    return;
  }

  const confirmar = confirm(
    `Deseja realmente enviar a nota ${nota.toFixed(1)} para ${dados.nome}?`
  );
  if (!confirmar) return;

  const dadosNota = {
    atleta: dados.nome,
    categoria: dados.categoria,
    foto: dados.foto || "",
    numero: dados.numero || "",
    jurado: JURADO,
    nota: nota.toFixed(1),
    ritmo: dados.ritmo,
    fase: faseSelecionada,
  };

  const chavePadrao = `${dados.nome}_${dados.categoria}_${dados.ritmo}`
    .toLowerCase()
    .replace(/\s+/g, "_");

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

    // 🔹 Limpa o campo de nota após enviar
    notaSelect.value = "";

    alert(`✅ Nota ${nota.toFixed(1)} enviada para ${dados.nome}`);
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
