document.addEventListener("DOMContentLoaded", function () {
    const emailSalvo = localStorage.getItem("emailUsuario");

    // 1. Troca "Administrador" pelo e-mail salvo em qualquer página
    if (emailSalvo) {
        // Para financeiro.html
        const saudacaoFinanceiro = document.getElementById("saudacao-usuario");
        if (saudacaoFinanceiro) {
            saudacaoFinanceiro.textContent = `Olá, ${emailSalvo}`;
        }

        // Para Home.html (mantendo a imagem de perfil)
        const buscaHome = document.querySelector("#busca p");
        if (buscaHome && buscaHome.firstChild) {
            buscaHome.firstChild.textContent = `Olá, ${emailSalvo} `;
        }

        // Para clientes.html
        document.querySelectorAll("header p").forEach(function (p) {
            if (p.textContent.includes("Administrador")) {
                p.textContent = p.textContent.replace("Administrador", emailSalvo);
            }
        });

        // Para vendas.html e inventario.html
        document.querySelectorAll("header span").forEach(function (span) {
            if (span.textContent.includes("Administrador")) {
                span.textContent = span.textContent.replace("Administrador", emailSalvo);
            }
        });
    }

    // 2. Configura a navegação do menu lateral (todos na mesma pasta)
    const paginas = {
        "home": "Home.html",
        "clientes": "clientes.html",
        "vendas": "vendas.html",
        "financeiro": "financeiro.html",
        "inventário": "inventario.html",
        "inventario": "inventario.html"
    };

    document.querySelectorAll("aside a, aside button").forEach(function (item) {
        const texto = item.textContent.trim().toLowerCase();
        const destino = paginas[texto];

        if (destino) {
            if (item.tagName === "A") {
                item.setAttribute("href", destino);
            } else if (item.tagName === "BUTTON") {
                item.addEventListener("click", function (e) {
                    e.preventDefault();
                    window.location.href = destino;
                });
            }
        }
    });
});