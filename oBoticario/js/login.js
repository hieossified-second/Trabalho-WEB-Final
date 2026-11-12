// login.js
document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector("form");
    const inputEmail = document.getElementById("Email");

    if (formulario && inputEmail) {
        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault(); // Evita o recarregamento padrão do form

            const emailDigitado = inputEmail.value.trim();

            if (emailDigitado) {
                // Pega apenas a parte antes do "@" para ficar mais bonito no cabeçalho
                // Se quiser o e-mail completo, basta usar: const nomeUsuario = emailDigitado;
                const nomeUsuario = emailDigitado.split("@")[0];

                // Salva no localStorage para todas as páginas acessarem
                localStorage.setItem("usuarioLogado", nomeUsuario);

                // Redireciona para a Home (ajuste o caminho se o login.html estiver em outra pasta)
                window.location.href = "Home.html";
            }
        });
    }
});