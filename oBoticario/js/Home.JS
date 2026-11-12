// Home.JS
document.addEventListener("DOMContentLoaded", function () {
    // Mapeia o texto de cada botão para o ficheiro correspondente na mesma pasta
    const paginas = {
        "home": "Home.html",
        "clientes": "clientes.html",
        "vendas": "vendas.html",
        "financeiro": "financeiro.html",
        "inventário": "inventario.html",
        "inventario": "inventario.html"
    };

    // Seleciona todos os botões dentro do <nav> do menu lateral
    const botoesMenu = document.querySelectorAll(".menu nav button");

    botoesMenu.forEach(function (botao) {
        botao.addEventListener("click", function () {
            const textoBotao = botao.textContent.trim().toLowerCase();
            const destino = paginas[textoBotao];

            if (destino) {
                // Redireciona na mesma aba (troque por window.open(destino, "_blank") se quiser nova aba)
                window.location.href = destino;
            }
        });
    });
});