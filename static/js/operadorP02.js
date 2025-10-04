import { db3 } from './firebase.js';
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";


// Referências para os dados de árbitros no Firebase
const refArbitroA = ref(db3, 'arbitros/arbitroA');
const refArbitroB = ref(db3, 'arbitros/arbitroB');
const refArbitroC = ref(db3, 'arbitros/arbitroC');

// Função para preencher o campo de árbitro A
onValue(refArbitroA, (snapshot) => {
    const arbitroA = snapshot.val();  // Recupera o valor de arbitroA no Firebase
    if (arbitroA) {
        // Preenche o campo de entrada com o valor de arbitroA
        document.getElementById("arbitroA").value = arbitroA;
    } else {
        console.log("Arbitro A não encontrado no Firebase.");
    }
});

// Função para preencher o campo de árbitro B
onValue(refArbitroB, (snapshot) => {
    const arbitroB = snapshot.val();  // Recupera o valor de arbitroB no Firebase
    if (arbitroB) {
        // Preenche o campo de entrada com o valor de arbitroB
        document.getElementById("arbitroB").value = arbitroB;
    } else {
        console.log("Arbitro B não encontrado no Firebase.");
    }
});

// Função para preencher o campo de árbitro C
onValue(refArbitroC, (snapshot) => {
    const arbitroC = snapshot.val();  // Recupera o valor de arbitroC no Firebase
    if (arbitroC) {
        // Preenche o campo de entrada com o valor de arbitroC
        document.getElementById("arbitroC").value = arbitroC;
    } else {
        console.log("Arbitro C não encontrado no Firebase.");
    }
});





// ELEMENTOS PRINCIPAIS
const tabelaPrincipal = document.querySelector("#tabela-principal tbody");
const seletorRitmo = document.getElementById("seletor-ritmo");
const seletorCategoria = document.getElementById("seletor-categoria");
const textoRitmo = document.getElementById("ritmo-atual");
const seletorFaseGrupo = document.getElementById("seletor-fase-grupo");

let todosDados = [];
let categoriaSelecionada = "";
let mediasFinaisMap = new Map();

// Para evitar duplicar eventos
let listenersAtivos = [];

// EVENTOS
seletorRitmo.addEventListener("change", () => {
  textoRitmo.textContent = seletorRitmo.value;
  carregarDadosPorGrupoFase(seletorRitmo.value, seletorFaseGrupo.value);
});

seletorCategoria.addEventListener("change", () => {
  categoriaSelecionada = seletorCategoria.value;
  exibirLinhasFiltradas();
});

seletorFaseGrupo.addEventListener("change", () => {
  carregarDadosPorGrupoFase(seletorRitmo.value, seletorFaseGrupo.value);
});

// FUNÇÃO PRINCIPAL
function carregarDadosPorGrupoFase(ritmo, grupoFase) {
  const caminhos = {
    classificatória: {
      D: ref(db3, `classificatóriaD/${ritmo}`),
      E: ref(db3, `classificatóriaE/${ritmo}`),
      F: ref(db3, `classificatóriaF/${ritmo}`)
    },
    oitavas: {
      D: ref(db3, `oitavasD/${ritmo}`), // Alterado A para D
      E: ref(db3, `oitavasE/${ritmo}`), // Alterado B para E
      F: ref(db3, `oitavasF/${ritmo}`)  // Alterado C para F
    },
    quartas: {
      D: ref(db3, `quartasD/${ritmo}`), // Alterado A para D
      E: ref(db3, `quartasE/${ritmo}`), // Alterado B para E
      F: ref(db3, `quartasF/${ritmo}`)  // Alterado C para F
    },
    semifinal: {
      D: ref(db3, `semi-finalD/${ritmo}`), // Alterado A para D
      E: ref(db3, `semi-finalE/${ritmo}`), // Alterado B para E
      F: ref(db3, `semi-finalF/${ritmo}`)  // Alterado C para F
    },
    final: {
      D: ref(db3, `finalD/${ritmo}`), // Alterado A para D
      E: ref(db3, `finalE/${ritmo}`), // Alterado B para E
      F: ref(db3, `finalF/${ritmo}`)  // Alterado C para F
    }
  };

  if (!caminhos[grupoFase]) return;

  // Cancela os listeners anteriores
  listenersAtivos.forEach(unsub => unsub());
  listenersAtivos = [];

  const dados = { D: {}, E: {}, F: {} };

  Object.entries(caminhos[grupoFase]).forEach(([fase, caminhoRef]) => {
    // O retorno de onValue é uma função que remove o listener
    const unsubscribe = onValue(caminhoRef, snap => {
      dados[fase] = {};

      if (snap.exists()) {
        snap.forEach(child => {
          const atleta = child.val().atleta || "";
          const categoria = child.val().categoria || "";
          if (!atleta || !categoria) return;
          dados[fase][child.key] = child.val();
        });
      }

      // Sempre recalcula tabela quando qualquer jurado muda algo
      processarDados(dados);
    });

    listenersAtivos.push(unsubscribe);
  });
}

// PROCESSAMENTO
function processarDados(dados) {
  todosDados = [];
  mediasFinaisMap.clear();

  const chaves = new Set([
    ...Object.keys(dados.D),
    ...Object.keys(dados.E),
    ...Object.keys(dados.F)
  ]);

  chaves.forEach(key => {
    const d = dados.D[key] ?? {};
    const e = dados.E[key] ?? {};
    const f = dados.F[key] ?? {};

    const atleta = d.atleta || e.atleta || f.atleta || "";
    const categoria = d.categoria || e.categoria || f.categoria || "";
    if (!atleta || !categoria) return;

    // Notas separadas
    const vjogoA = parseFloat(d.vjogoA || e.vjogoA || f.vjogoA || 0);
    const solo = parseFloat(d.solo || e.solo || f.solo || 0);
    const aereo = parseFloat(d.aereo || e.aereo || f.aereo || 0);
    const vjogoB = parseFloat(d.vjogoB || e.vjogoB || f.vjogoB || 0);
    const publico = parseFloat(d.publico || e.publico || f.publico || 0);
    const bonus = parseFloat(d.bonus || e.bonus || f.bonus || 0);

    // Média final considerando as novas notas
    const somaNotas = vjogoA + solo + aereo + vjogoB + publico + bonus;
    const media = parseFloat((somaNotas).toFixed(1)); // Calculando a média de todas as notas

    mediasFinaisMap.set(atleta + "||" + categoria, media);

    todosDados.push({
      atleta,
      categoria,
      vjogoA,
      solo,
      aereo,
      vjogoB,
      publico,
      bonus,
      media,
      numero: d.numero || e.numero || f.numero || "",
      foto: d.foto || e.foto || f.foto || ""
    });

    salvarMediaNoFirebase({
      atleta,
      categoria,
      media,
      numero: d.numero || e.numero || f.numero || "",
      foto: d.foto || e.foto || f.foto || ""
    });
  });

  atualizarSeletorCategorias();
  exibirLinhasFiltradas();
}


// SALVAR MÉDIA NO FIREBASE
function salvarMediaNoFirebase(dado) {
  const mediaComDuasCasas = (Math.floor(dado.media * 100) / 100).toFixed(1);
  const fotoUrl = dado.foto ? dado.foto : "";
  const numero = dado.numero || "";

  const ritmoSelecionado = seletorRitmo.value;
  let mediaKey = "";

  switch (ritmoSelecionado) {
    case '1º Jogo': mediaKey = 'media1ºJogo'; break;
    case '2º Jogo': mediaKey = 'media2ºJogo'; break;
    case '3º Jogo': mediaKey = 'media3ºJogo'; break;
    default: return;
  }

  const mediaRef = ref(db3, `medias/${ritmoSelecionado}/${seletorFaseGrupo.value}/${dado.atleta}||${dado.categoria}`);
  
  set(mediaRef, {
    [mediaKey]: mediaComDuasCasas,
    atleta: dado.atleta,
    categoria: dado.categoria,
    numero: numero,
    foto: fotoUrl
  }).catch(error => {
    console.error("Erro ao salvar média no Firebase: ", error);
  });
}

// ATUALIZA SELETOR DE CATEGORIAS
function atualizarSeletorCategorias() {
  const categorias = [...new Set(todosDados.map(d => d.categoria))].sort();
  seletorCategoria.innerHTML = '<option value="">Todas</option>';
  categorias.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    seletorCategoria.appendChild(opt);
  });
  seletorCategoria.value = categoriaSelecionada || "";
}

// MONTA A TABELA
function exibirLinhasFiltradas() {
  tabelaPrincipal.innerHTML = "";
  const mapaUnico = new Map();

  let filtrados = categoriaSelecionada
    ? todosDados.filter(d => d.categoria === categoriaSelecionada)
    : todosDados;

  filtrados.forEach(dado => {
    const id = dado.atleta + "||" + dado.categoria;
    if (!mapaUnico.has(id)) mapaUnico.set(id, dado);
  });

  const listaUnica = Array.from(mapaUnico.values()).sort((a, b) => b.media - a.media);

  listaUnica.forEach(dado => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${dado.atleta}</td>
    <td>${dado.categoria}</td>
    <td>${dado.aereo.toFixed(1)}</td>  <!-- Nota de Floreio Aéreo -->
    <td>${dado.vjogoB.toFixed(1)}</td>  <!-- Nota de Volume de Jogo B -->
    
  `;
    tabelaPrincipal.appendChild(tr);
  });
}

// ✅ Chamar já no início para não precisar trocar o seletor manualmente
window.addEventListener("load", () => {
  if (seletorRitmo.value && seletorFaseGrupo.value) {
    carregarDadosPorGrupoFase(seletorRitmo.value, seletorFaseGrupo.value);
  }
});

document.getElementById("PDF5").addEventListener("click", function() {
  const { jsPDF } = window.jspdf; // Usando a versão moderna do jsPDF
  const doc = new jsPDF(); // Criar novo documento PDF

  // Título do Documento
  doc.setFontSize(16);
  doc.text("Desafio Online Voando Alto 2025", 14, 20);

  // Data e Hora
  const dataHora = new Date();
  doc.setFontSize(12);
  doc.text(`Data: ${dataHora.toLocaleDateString()} - Hora: ${dataHora.toLocaleTimeString()}`, 14, 30);

  // Nome do Árbitro
  const arbitro = document.getElementById("arbitro").value || "Nome do Árbitro";
  doc.text(`Jurado: ${arbitro}`, 14, 40);

  // Adicionar a Tabela a partir do HTML
  doc.autoTable({
    html: '#tabela-principal1', // Usando a tabela HTML com id 'tabela-principal1'
    startY: 50, // Posição inicial na página para a tabela
    theme: 'grid', // Usar tema grid para a tabela
     headStyles: { fillColor: [255, 165, 0] }, // Cor de fundo laranja para os cabeçalhos
    columnStyles: {
      0: { cellWidth: 40 }, // Ajustando a largura da coluna "Atleta"
      1: { cellWidth: 40 }, // Ajustando a largura da coluna "Categoria"
      2: { cellWidth: 40 }, // Ajustando a largura da coluna "Floreio Aéreo"
      3: { cellWidth: 40 }, // Ajustando a largura da coluna "Volume de Jogo"
    },
  });

  // Adicionar linha para a assinatura
  const pageHeight = doc.internal.pageSize.height;
  doc.text("Assinatura do Jurado:", 14, pageHeight - 30);
  doc.line(14, pageHeight - 25, 100, pageHeight - 25); // Linha para a assinatura

  // Salvar o PDF
  doc.save('tabela-avaliacao.pdf');
});
