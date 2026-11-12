// ===== VARIÁVEIS =====

// lista dos produtos que estão no carrinho
// cada item é um objeto: { nome, preco, quantidade }
let carrinho = [];

// números dos cards lá de cima
let totalVendas = 48;
let faturamento = 4315.20;   // 48 vendas x R$ 89,90

// ===== PEGANDO OS ELEMENTOS DO HTML =====
const formVenda = document.querySelector("#form-venda");
const selectCliente = document.querySelector("#cliente");
const selectProduto = document.querySelector("#produto");
const inputQuantidade = document.querySelector("#quantidade");
const listaCarrinho = document.querySelector("#lista-carrinho");
const totalCarrinho = document.querySelector("#total-carrinho");
const btnFinalizar = document.querySelector("#btn-finalizar");
const btnNovaVenda = document.querySelector("#btn-nova-venda");
const campoBusca = document.querySelector("#busca");
const corpoTabela = document.querySelector("#tabela-vendas");

const textoTotalVendas = document.querySelector("#total-vendas");
const textoFaturamento = document.querySelector("#faturamento");
const textoTicketMedio = document.querySelector("#ticket-medio");


// ===== FUNÇÕES =====

// transforma 249.8 em "R$ 249,80"
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// soma preço x quantidade de cada item do carrinho
function calcularTotal() {
  let total = 0;
  for (let i = 0; i < carrinho.length; i++) {
    total = total + carrinho[i].preco * carrinho[i].quantidade;
  }
  return total;
}

// desenha o carrinho na tela de acordo com a lista "carrinho"
// (chamo essa função toda vez que a lista muda)
function mostrarCarrinho() {
  listaCarrinho.innerHTML = "";   // limpa a lista antes de desenhar de novo

  if (carrinho.length === 0) {
    listaCarrinho.innerHTML = "<li class='item vazio'>Nenhum produto no carrinho.</li>";
  }

  for (let i = 0; i < carrinho.length; i++) {
    const item = carrinho[i];
    const subtotal = item.preco * item.quantidade;

    const li = document.createElement("li");
    li.className = "item";
    li.innerHTML =
      "<span class='qtd'>" + item.quantidade + "x</span>" +
      "<span class='nome'>" + item.nome + "</span>" +
      "<span class='preco'>" + formatarMoeda(subtotal) + "</span>" +
      "<button class='btn-remover'>🗑️</button>";

    // botão da lixeira: remove o item que está na posição i da lista
    const botaoRemover = li.querySelector(".btn-remover");
    botaoRemover.addEventListener("click", function () {
      carrinho.splice(i, 1);
      mostrarCarrinho();
    });

    listaCarrinho.appendChild(li);
  }

  totalCarrinho.textContent = formatarMoeda(calcularTotal());
}

// escreve os números nos 3 cards do topo
function atualizarResumo() {
  textoTotalVendas.textContent = totalVendas;
  textoFaturamento.textContent = formatarMoeda(faturamento);
  // ticket médio = quanto faturou dividido pelo número de vendas
  textoTicketMedio.textContent = formatarMoeda(faturamento / totalVendas);
}

// esconde as linhas da tabela que não têm o texto digitado na busca
function filtrarTabela() {
  const termo = campoBusca.value.toLowerCase();

  for (let i = 0; i < corpoTabela.rows.length; i++) {
    const linha = corpoTabela.rows[i];
    const textoDaLinha = linha.textContent.toLowerCase();

    if (textoDaLinha.includes(termo)) {
      linha.style.display = "";       // mostra
    } else {
      linha.style.display = "none";   // esconde
    }
  }
}


// ===== EVENTOS =====

// 1) Adicionar ao carrinho (quando o formulário é enviado)
formVenda.addEventListener("submit", function (evento) {
  // sem isso a página recarrega e perde o carrinho
  evento.preventDefault();

  // o texto da opção é o nome e o value é o preço
  const nomeProduto = selectProduto.options[selectProduto.selectedIndex].text;
  const preco = Number(selectProduto.value);
  const quantidade = parseInt(inputQuantidade.value);

  if (isNaN(quantidade) || quantidade < 1) {
    alert("Digite uma quantidade válida (mínimo 1).");
    return;
  }

  // se o produto já está no carrinho, só aumenta a quantidade
  let jaExiste = false;
  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome === nomeProduto) {
      carrinho[i].quantidade = carrinho[i].quantidade + quantidade;
      jaExiste = true;
    }
  }

  // se não estava, adiciona um item novo
  if (jaExiste === false) {
    carrinho.push({ nome: nomeProduto, preco: preco, quantidade: quantidade });
  }

  mostrarCarrinho();

  // deixa o produto e a quantidade prontos para o próximo item
  selectProduto.selectedIndex = 0;
  inputQuantidade.value = 1;
});


// 2) Finalizar venda
btnFinalizar.addEventListener("click", function () {
  if (carrinho.length === 0) {
    alert("Adicione pelo menos um produto ao carrinho.");
    return;
  }

  if (selectCliente.value === "") {
    alert("Escolha um cliente antes de finalizar.");
    return;
  }

  const cliente = selectCliente.value;
  const total = calcularTotal();

  // monta o texto da coluna "Produto(s)": "2x Malbec + Egeo Dolce"
  let produtos = "";
  for (let i = 0; i < carrinho.length; i++) {
    if (i > 0) {
      produtos = produtos + " + ";
    }
    if (carrinho[i].quantidade > 1) {
      produtos = produtos + carrinho[i].quantidade + "x ";
    }
    produtos = produtos + carrinho[i].nome;
  }

  // insertRow(0) cria uma linha nova no topo da tabela
  const novaLinha = corpoTabela.insertRow(0);
  const dataHoje = new Date().toLocaleDateString("pt-BR");
  novaLinha.innerHTML =
    "<td>" + dataHoje + "</td>" +
    "<td>" + cliente + "</td>" +
    "<td>" + produtos + "</td>" +
    "<td>" + formatarMoeda(total) + "</td>" +
    "<td><span class='badge'>Concluída</span></td>";

  // a tabela mostra só as 5 últimas vendas: apaga a mais antiga
  if (corpoTabela.rows.length > 5) {
    corpoTabela.deleteRow(corpoTabela.rows.length - 1);
  }

  // atualiza os cards do topo
  totalVendas = totalVendas + 1;
  faturamento = faturamento + total;
  atualizarResumo();

  // limpa tudo para a próxima venda
  carrinho = [];
  mostrarCarrinho();
  formVenda.reset();
  filtrarTabela();

  alert("Venda registrada para " + cliente + "! Total: " + formatarMoeda(total));
});


// 3) Busca: filtra a tabela a cada letra digitada
campoBusca.addEventListener("input", filtrarTabela);


// 4) Botão "Nova venda": coloca o cursor no campo de cliente
btnNovaVenda.addEventListener("click", function () {
  selectCliente.focus();
});


// ===== QUANDO A PÁGINA ABRE =====
mostrarCarrinho();
atualizarResumo();