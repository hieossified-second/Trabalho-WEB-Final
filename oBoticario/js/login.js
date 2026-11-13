document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector("form");
    const inputNome = document.getElementById("Nome");
    const inputEmail = document.getElementById("Email");

    if (formulario && inputNome && inputEmail) {
        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault(); // Evita o recarregamento padrão do form

            const nomeDigitado = inputNome.value.trim();
            const emailDigitado = inputEmail.value.trim();

            if (nomeDigitado && emailDigitado) {
                // Salva o nome e o e-mail separadamente no localStorage
                localStorage.setItem("usuarioLogado", nomeDigitado);
                localStorage.setItem("emailLogado", emailDigitado);

                // Redireciona para a Home
                window.location.href = "Home.html";
            }
        });
    }
});