document.addEventListener("DOMContentLoaded", () => {

const modoMusico = window.location.search.includes("musico=true");

if (modoMusico) {
  document.getElementById("area-publico").style.display = "none";
}
else {
  document.getElementById("area-musico").style.display = "none";
}

let musicaSelecionada = "";
const firebaseConfig = {
    apiKey: "AIzaSyB737oHzYrErLPM4_wUpG0VTb299EEFpYI",
  authDomain: "setlist-app-499cc.firebaseapp.com",
  projectId: "setlist-app-499cc",
  storageBucket: "setlist-app-499cc.firebasestorage.app",
  messagingSenderId: "205963356649",
  appId: "1:205963356649:web:185961d891b3c848868378",
  measurementId: "G-Q9PNPX13BE"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
let pedidos = [];
const musicas = [
  "Tempo Perdido",
  "Evidências",
  "Anna Júlia",
  "Primeiros Erros",
  "Meu Erro"
];

const lista = document.getElementById("lista-musicas");

function mostrarMusicas(listaFiltrada) {
  lista.innerHTML = "";

  listaFiltrada.forEach(musica => {
    const item = document.createElement("li");
    item.textContent = musica;

   item.onclick = () => {
  musicaSelecionada = musica;

  document.getElementById("musica-selecionada").textContent = musica;

  document.getElementById("modal").classList.add("ativo");
};
   
    lista.appendChild(item);
  });
}

// Mostrar todas ao carregar
mostrarMusicas(musicas);
const busca = document.getElementById("busca");

busca.addEventListener("input", () => {
  const termo = busca.value.toLowerCase();

  const filtradas = musicas.filter(m =>
    m.toLowerCase().includes(termo)
  );

  mostrarMusicas(filtradas);
});
async function enviarPedido(musica, nome, mensagem) {
  try {
    console.log("🔥 Enviando pedido...");

    await db.collection("pedidos").add({
      musica: musica,
      nome: nome || "",
      mensagem: mensagem || "",
      timestamp: Date.now()
    });

    console.log("✅ Pedido enviado com sucesso!");

    mostrarAgradecimento();

  } catch (erro) {
    console.error("💥 ERRO AO ENVIAR:", erro);
    alert("Erro ao enviar pedido 😢");
  }
}
function mostrarAgradecimento() {
  document.body.innerHTML = `
    <div style="text-align:center; margin-top:50px;">
      <h2>🎤 Pedido enviado!</h2>

      <p>Se essa música tocar teu 💜 já valeu.</p>

      <p>
        👉 <a href="https://instagram.com/acabraljr" target="_blank">
        Me segue no Instagram
        </a>
      </p>

      <p style="margin-top:20px;">
        💸 Quer fortalecer ainda mais?
      </p>

      <button onclick="copiarPix()" style="margin:10px;">
        Copiar chave Pix
      </button>

      <br><br>

      <button onclick="voltarInicio()" style="margin-top:20px;">
        🔁 Pedir outra música
      </button>
    </div>
  `;
}
function copiarPix() {
  navigator.clipboard.writeText("00020126360014BR.GOV.BCB.PIX0114+55219935012375204000053039865802BR5920Amauri Cabral Junior6009SAO PAULO62140510VMJkKjdd2q6304E065");

  const aviso = document.createElement("div");
  aviso.innerHTML = "💸 Pix copiado! Agora é só colar no banco 😉";
  
  aviso.style.position = "fixed";
  aviso.style.bottom = "20px";
  aviso.style.left = "50%";
  aviso.style.transform = "translateX(-50%)";
  aviso.style.background = "#00ffcc";
  aviso.style.color = "black";
  aviso.style.padding = "12px 24px";
  aviso.style.borderRadius = "12px";
  aviso.style.fontWeight = "bold";
  aviso.style.boxShadow = "0 0 10px rgba(0,255,204,0.5)";

  document.body.appendChild(aviso);

  setTimeout(() => {
    aviso.remove();
  }, 2500);
}
function fecharModal() {
  document.getElementById("modal").classList.remove("ativo");
}

function confirmarPedido() {
  const nome = document.getElementById("nome").value;
  const mensagem = document.getElementById("mensagem").value;

  enviarPedido(musicaSelecionada, nome, mensagem);

  document.getElementById("nome").value = "";
  document.getElementById("mensagem").value = "";

  fecharModal();
}


window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    fecharModal();
  }
}
function atualizarFila() {
  const fila = document.getElementById("fila");
  fila.innerHTML = "";

  pedidos.forEach(pedido => {
    const item = document.createElement("li");

    item.innerHTML = `
      <strong>${pedido.musica}</strong> (${pedido.quantidade} pedidos)
      <br>
      <button onclick="marcarComoTocada('${pedido.musica}')">
        ✅ Tocada
      </button>
    `;

    fila.appendChild(item);
  });
}
async function marcarComoTocada(musica) {
  const snapshot = await db.collection("pedidos")
    .where("musica", "==", musica)
    .get();

  snapshot.forEach(doc => {
    doc.ref.delete();
  });
}
db.collection("pedidos")
  .orderBy("timestamp")
  .onSnapshot(snapshot => {
    pedidos = [];

    snapshot.forEach(doc => {
      const data = doc.data();

      const existente = pedidos.find(p => p.musica === data.musica);

      if (existente) {
        existente.quantidade++;
      } else {
        pedidos.push({
          musica: data.musica,
          quantidade: 1
        });
      }
    });

    atualizarFila();
  });

document.getElementById("btn-enviar").addEventListener("click", confirmarPedido);
document.getElementById("btn-cancelar").addEventListener("click", fecharModal);
window.copiarPix = copiarPix;
function voltarInicio() {
  window.location.reload();
}
window.voltarInicio = voltarInicio;
});