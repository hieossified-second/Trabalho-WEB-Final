// ==========================================================================
// PAINEL DE CLIENTES - O Boticário
// ==========================================================================

// ---------- "Banco de dados" mockado (troque depois por dados reais / API) ----------
let clientes = [
    {
        id: 1,
        nome: "Mariana Alves",
        cpf: "000.999.222-05",
        telefone: "(11) 00414-2313",
        email: "mari@exemplo.com",
        tipo: "pf",
        dataCadastro: "2025-01-10"
    },
    {
        id: 2,
        nome: "João Pereira",
        cpf: "111.222.333-44",
        telefone: "(11) 98888-1234",
        email: "joao.pereira@exemplo.com",
        tipo: "pf",
        dataCadastro: "2025-03-22"
    },
    {
        id: 3,
        nome: "Cosméticos Bela Ltda",
        cpf: "12.345.678/0001-90", // CNPJ, mas mantemos o mesmo campo
        telefone: "(11) 3333-4444",
        email: "contato@bela.com.br",
        tipo: "pj",
        dataCadastro: "2025-06-05"
    }
];

let proximoId = 4;
let clienteSelecionadoId = clientes[0]?.id ?? null;

// ---------- Referências aos elementos do DOM ----------
const tbody = document.querySelector("tbody");
const tfoot = document.querySelector("tfoot td");
const inputBusca = document.getElementById("Pesquisa"); // input dentro do formulário de filtro
const selectTipo = document.getElementById("Tipos");
const selectOrdem = document.getElementById("Ordem");
const btnCadastrar = document.querySelector(".cadastroCliente button");
const btnEditar = document.querySelector(".EditarCadastro button");
const form = document.querySelector(".conteiner form");

// Painel de detalhes
const detalheNome = document.querySelector(".registro h3");
const detalheCpf = document.querySelector(".cpf dd");
const detalheTelefone = document.querySelector(".telefone dd");
const detalheEmail = document.querySelector(".emailCli dd");
const detalheTipo = document.querySelector(".tipoPessoa dd");

// ---------- Utilidades ----------
function normalizar(texto) {
    return texto
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // remove acentos
}

function rotuloTipo(tipo) {
    return tipo === "pj" ? "Pessoa Jurídica" : "Pessoa Física";
}

// ---------- Filtro + ordenação ----------
function obterClientesFiltrados() {
    const termo = normalizar(inputBusca.value.trim());
    const tipo = selectTipo.value;
    const ordem = selectOrdem.value;

    let lista = clientes.filter((cliente) => {
        const bateBusca =
            termo === "" ||
            normalizar(cliente.nome).includes(termo) ||
            normalizar(cliente.cpf).includes(termo) ||
            normalizar(cliente.telefone).includes(termo);

        const bateTipo = tipo === "todos" || cliente.tipo === tipo;

        return bateBusca && bateTipo;
    });

    if (ordem === "az") {
        lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    } else if (ordem === "za") {
        lista.sort((a, b) => b.nome.localeCompare(a.nome, "pt-BR"));
    } else if (ordem === "recentes") {
        lista.sort((a, b) => new Date(b.dataCadastro) - new Date(a.dataCadastro));
    }

    return lista;
}

// ---------- Renderização da tabela ----------
function renderizarTabela() {
    const lista = obterClientesFiltrados();
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">Nenhum cliente encontrado.</td>
            </tr>`;
        tfoot.textContent = "0 clientes encontrados";
        renderizarDetalhes(null);
        return;
    }

    lista.forEach((cliente) => {
        const tr = document.createElement("tr");
        tr.dataset.id = cliente.id;
        if (cliente.id === clienteSelecionadoId) {
            tr.classList.add("selecionada");
        }

        tr.innerHTML = `
            <td>${cliente.nome}</td>
            <td>${cliente.cpf}</td>
            <td>${cliente.telefone}</td>
            <td>${rotuloTipo(cliente.tipo)}</td>
            <td>
                <button type="button" class="acao editar" data-id="${cliente.id}">Editar</button>
                <button type="button" class="acao excluir" data-id="${cliente.id}">Excluir</button>
            </td>
        `;

        // Clique na linha (fora dos botões) seleciona o cliente
        tr.addEventListener("click", (evento) => {
            if (evento.target.closest("button")) return;
            selecionarCliente(cliente.id);
        });

        tbody.appendChild(tr);
    });

    tfoot.textContent = `${lista.length} cliente(s) encontrado(s)`;

    // Liga os botões de ação recém-criados
    tbody.querySelectorAll(".acao.editar").forEach((btn) => {
        btn.addEventListener("click", () => editarCliente(Number(btn.dataset.id)));
    });
    tbody.querySelectorAll(".acao.excluir").forEach((btn) => {
        btn.addEventListener("click", () => excluirCliente(Number(btn.dataset.id)));
    });

    // Garante que o painel de detalhes reflete o cliente selecionado (ou o primeiro da lista)
    const aindaExiste = lista.some((c) => c.id === clienteSelecionadoId);
    if (!aindaExiste) {
        clienteSelecionadoId = lista[0].id;
    }
    renderizarDetalhes(clientes.find((c) => c.id === clienteSelecionadoId));
}

// ---------- Painel de detalhes ----------
function renderizarDetalhes(cliente) {
    if (!cliente) {
        detalheNome.textContent = "Nenhum cliente selecionado";
        detalheCpf.textContent = "-";
        detalheTelefone.textContent = "-";
        detalheEmail.textContent = "-";
        detalheTipo.textContent = "-";
        return;
    }

    detalheNome.textContent = `Nome Cliente: ${cliente.nome}`;
    detalheCpf.textContent = cliente.cpf;
    detalheTelefone.textContent = cliente.telefone;
    detalheEmail.textContent = cliente.email;
    detalheTipo.textContent = rotuloTipo(cliente.tipo);
}

function selecionarCliente(id) {
    clienteSelecionadoId = id;
    renderizarTabela();
}

// ---------- Cadastro ----------
function cadastrarCliente() {
    const nome = prompt("Nome do cliente:");
    if (!nome) return;

    const cpf = prompt("CPF ou CNPJ:") || "";
    const telefone = prompt("Telefone:") || "";
    const email = prompt("E-mail:") || "";
    const tipo = confirm("Clique OK para Pessoa Jurídica, ou Cancelar para Pessoa Física")
        ? "pj"
        : "pf";

    const novoCliente = {
        id: proximoId++,
        nome,
        cpf,
        telefone,
        email,
        tipo,
        dataCadastro: new Date().toISOString()
    };

    clientes.push(novoCliente);
    clienteSelecionadoId = novoCliente.id;
    renderizarTabela();
}

// ---------- Edição ----------
function editarCliente(id) {
    const cliente = clientes.find((c) => c.id === id);
    if (!cliente) return;

    const nome = prompt("Nome do cliente:", cliente.nome);
    if (nome === null) return; // cancelou

    const cpf = prompt("CPF ou CNPJ:", cliente.cpf) ?? cliente.cpf;
    const telefone = prompt("Telefone:", cliente.telefone) ?? cliente.telefone;
    const email = prompt("E-mail:", cliente.email) ?? cliente.email;

    cliente.nome = nome || cliente.nome;
    cliente.cpf = cpf;
    cliente.telefone = telefone;
    cliente.email = email;

    clienteSelecionadoId = cliente.id;
    renderizarTabela();
}

// ---------- Exclusão ----------
function excluirCliente(id) {
    const cliente = clientes.find((c) => c.id === id);
    if (!cliente) return;

    const confirmou = confirm(`Tem certeza que deseja excluir "${cliente.nome}"?`);
    if (!confirmou) return;

    clientes = clientes.filter((c) => c.id !== id);

    if (clienteSelecionadoId === id) {
        clienteSelecionadoId = clientes[0]?.id ?? null;
    }

    renderizarTabela();
}

// ---------- Eventos ----------
form.addEventListener("submit", (e) => e.preventDefault()); // evita reload ao dar Enter

inputBusca.addEventListener("input", renderizarTabela);
selectTipo.addEventListener("change", renderizarTabela);
selectOrdem.addEventListener("change", renderizarTabela);

btnCadastrar.addEventListener("click", cadastrarCliente);

btnEditar.addEventListener("click", () => {
    if (clienteSelecionadoId) editarCliente(clienteSelecionadoId);
});

// ---------- Inicialização ----------
document.addEventListener("DOMContentLoaded", renderizarTabela);
// Caso o script seja carregado no fim do body (depois do DOM já pronto):
if (document.readyState !== "loading") {
    renderizarTabela();
}

document.addEventListener("DOMContentLoaded", function () {
    const nomeSalvo = localStorage.getItem("usuarioLogado");
    const emailSalvo = localStorage.getItem("emailLogado");

    const elNome = document.getElementById("nome-usuario");
    const elEmail = document.getElementById("email-usuario");

    if (nomeSalvo && elNome) {
        elNome.textContent = nomeSalvo;
    }

    if (emailSalvo && elEmail) {
        elEmail.textContent = emailSalvo;
    }
});