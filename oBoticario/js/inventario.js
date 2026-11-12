
// =====================================
// INVENTÁRIO - O BOTICÁRIO
// =====================================

const STORAGE_KEY = "inventarioBoticario";

// Produtos iniciais
const produtosIniciais = [
  {
    id: 1,
    nome: "Floratta Des. Colônia",
    codigo: "BOT001",
    categoria: "Perfumaria",
    quantidade: 35,
    valor: 189.90
  },
  {
    id: 2,
    nome: "Malbec Des. Colônia",
    codigo: "BOT002",
    categoria: "Perfumaria",
    quantidade: 28,
    valor: 159.90
  },
  {
    id: 3,
    nome: "Nativa SPA Ameixa",
    codigo: "BOT003",
    categoria: "Cuidados Pessoais",
    quantidade: 12,
    valor: 129.90
  },
  {
    id: 4,
    nome: "Kit Presente Cuide-se Bem",
    codigo: "BOT004",
    categoria: "Kits",
    quantidade: 18,
    valor: 99.90
  },
  {
    id: 5,
    nome: "Egeo Dolce",
    codigo: "BOT005",
    categoria: "Perfumaria",
    quantidade: 22,
    valor: 139.90
  },
  {
    id: 6,
    nome: "Shampoo Nativa SPA",
    codigo: "BOT006",
    categoria: "Cabelos",
    quantidade: 40,
    valor: 69.90
  }
];

// Carrega os dados salvos ou inicia com os exemplos
let produtos;

try {
  const dadosSalvos = localStorage.getItem(STORAGE_KEY);
  produtos = dadosSalvos
    ? JSON.parse(dadosSalvos)
    : produtosIniciais;

  if (!Array.isArray(produtos)) {
    produtos = produtosIniciais;
  }
} catch (erro) {
  produtos = produtosIniciais;
}

// Elementos HTML
const listaProdutos = document.getElementById("listaProdutos");
const totalProdutos = document.getElementById("totalProdutos");
const estoqueBaixo = document.getElementById("estoqueBaixo");
const semEstoque = document.getElementById("semEstoque");

const modal = document.getElementById("modalProduto");
const formulario = document.getElementById("formProduto");

const btnAdicionar = document.getElementById("btnAdicionar");
const btnCancelar = document.getElementById("btnCancelar");

const buscaProduto = document.getElementById("buscaProduto");
const buscaGeral = document.getElementById("buscaGeral");
const filtroCategoria = document.getElementById("filtroCategoria");

// Salvar no navegador
function salvarDados() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
}

// Formatar valores em reais
function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// Evita inserir texto como HTML
function escaparHTML(texto) {
  return String(texto).replace(/[&<>"']/g, caractere => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[caractere]);
}

// Atualizar tabela
function renderizarProdutos() {
  const pesquisa = buscaProduto.value.toLowerCase().trim();
  const categoria = filtroCategoria.value;

  const filtrados = produtos.filter(produto => {
    const correspondePesquisa =
      produto.nome.toLowerCase().includes(pesquisa) ||
      String(produto.codigo || "").toLowerCase().includes(pesquisa);

    const correspondeCategoria =
      categoria === "" || produto.categoria === categoria;

    return correspondePesquisa && correspondeCategoria;
  });

  listaProdutos.innerHTML = "";

  if (filtrados.length === 0) {
    listaProdutos.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:25px;">
          Nenhum produto encontrado.
        </td>
      </tr>
    `;
  }

  filtrados.forEach(produto => {
    let estoqueHTML = produto.quantidade;

    if (produto.quantidade === 0) {
      estoqueHTML = `<span class="badge-perigo">Sem estoque</span>`;
    } else if (produto.quantidade <= 15) {
      estoqueHTML = `<span class="badge-alerta">${produto.quantidade}</span>`;
    }

    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>
        <div class="product-info">
          <span class="thumb"
            style="background-color: #E9A9A5;"></span>
          ${escaparHTML(produto.nome)}
        </div>
      </td>

      <td>${escaparHTML(produto.categoria)}</td>

      <td>${estoqueHTML}</td>

      <td>${formatarMoeda(produto.valor)}</td>

      <td class="col-acoes">
        <button class="btn-acao"
          type="button"
          title="Editar"
          aria-label="Editar produto"
          data-acao="editar"
          data-id="${produto.id}">✏️</button>

        <button class="btn-acao danger"
          type="button"
          title="Excluir"
          aria-label="Excluir produto"
          data-acao="excluir"
          data-id="${produto.id}">🗑️</button>
      </td>
    `;

    listaProdutos.appendChild(linha);
  });

  atualizarEstatisticas();
}

// Atualizar os cards
function atualizarEstatisticas() {
  const total = produtos.reduce(
    (soma, produto) => soma + Number(produto.quantidade), 0
  );

  const baixos = produtos.filter(
    produto => produto.quantidade > 0 &&
               produto.quantidade <= 15
  ).length;

  const zerados = produtos.filter(
    produto => produto.quantidade === 0
  ).length;

  totalProdutos.textContent = total;
  estoqueBaixo.textContent = baixos;
  semEstoque.textContent = zerados;
}

// Abrir formulário
function abrirModal(produto = null) {
  formulario.reset();

  if (produto) {
    document.getElementById("tituloModal").textContent =
      "Editar produto";

    document.getElementById("produtoId").value = produto.id;
    document.getElementById("nomeProduto").value = produto.nome;
    document.getElementById("codigoProduto").value =
      produto.codigo || "";
    document.getElementById("categoriaProduto").value =
      produto.categoria;
    document.getElementById("quantidadeProduto").value =
      produto.quantidade;
    document.getElementById("valorProduto").value =
      produto.valor;
  } else {
    document.getElementById("tituloModal").textContent =
      "Adicionar produto";

    document.getElementById("produtoId").value = "";
  }

  modal.hidden = false;
  document.getElementById("nomeProduto").focus();
}

// Fechar formulário
function fecharModal() {
  modal.hidden = true;
  formulario.reset();
}

// Cadastrar ou editar produto
formulario.addEventListener("submit", function(evento) {
  evento.preventDefault();

  const id = document.getElementById("produtoId").value;

  const nome = document.getElementById("nomeProduto").value.trim();
  const codigo = document.getElementById("codigoProduto").value.trim();
  const categoria = document.getElementById("categoriaProduto").value;
  const quantidade = Number(
    document.getElementById("quantidadeProduto").value
  );
  const valor = Number(
    document.getElementById("valorProduto").value
  );

  if (
    !nome ||
    !categoria ||
    !Number.isInteger(quantidade) ||
    quantidade < 0 ||
    !Number.isFinite(valor) ||
    valor < 0
  ) {
    alert("Preencha os campos corretamente.");
    return;
  }

  // Verificar código duplicado
  const codigoDuplicado = codigo && produtos.some(produto =>
    produto.codigo?.toLowerCase() === codigo.toLowerCase() &&
    String(produto.id) !== id
  );

  if (codigoDuplicado) {
    alert("Já existe um produto com esse código.");
    return;
  }

  if (id) {
    const indice = produtos.findIndex(
      produto => String(produto.id) === id
    );

    if (indice !== -1) {
      produtos[indice] = {
        ...produtos[indice],
        nome,
        codigo,
        categoria,
        quantidade,
        valor
      };
    }
  } else {
    produtos.push({
      id: Date.now(),
      nome,
      codigo,
      categoria,
      quantidade,
      valor
    });
  }

  salvarDados();
  renderizarProdutos();
  fecharModal();
});

// Botão adicionar
btnAdicionar.addEventListener("click", function() {
  abrirModal();
});

// Botão cancelar
btnCancelar.addEventListener("click", fecharModal);

// Editar e excluir produtos
listaProdutos.addEventListener("click", function(evento) {
  const botao = evento.target.closest("button[data-acao]");

  if (!botao) return;

  const id = Number(botao.dataset.id);

  if (botao.dataset.acao === "editar") {
    const produto = produtos.find(item => item.id === id);

    if (produto) {
      abrirModal(produto);
    }
  }

  if (botao.dataset.acao === "excluir") {
    const produto = produtos.find(item => item.id === id);

    if (!produto) return;

    const confirmar = confirm(
      `Deseja realmente excluir "${produto.nome}"?`
    );

    if (confirmar) {
      produtos = produtos.filter(item => item.id !== id);

      salvarDados();
      renderizarProdutos();
    }
  }
});

// Pesquisa e filtro
buscaProduto.addEventListener("input", renderizarProdutos);
filtroCategoria.addEventListener("change", renderizarProdutos);

// Pesquisa superior
buscaGeral.addEventListener("input", function() {
  buscaProduto.value = this.value;
  renderizarProdutos();
});

// Fechar modal clicando fora
modal.addEventListener("click", function(evento) {
  if (evento.target === modal) {
    fecharModal();
  }
});

// Inicializar página
salvarDados();
renderizarProdutos();