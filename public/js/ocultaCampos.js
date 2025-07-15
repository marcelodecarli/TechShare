document.addEventListener("DOMContentLoaded", () => {
  // Botões do cabeçalho
  const btnLogin      = document.getElementById("btnLogin");
  const btnCadastrar  = document.getElementById("btnCadastrar");
  const btnSair       = document.getElementById("btnSair");
  const btnPerfil     = document.getElementById("perfil");

  // Se a página não tiver cabeçalho, encerra silenciosamente
  if (!btnLogin || !btnCadastrar || !btnSair) return;

  function atualizaBotoes() {
    const logado = localStorage.getItem("loggedIn") === "true";

    if (logado) {
      btnLogin.classList.add("hidden");
      btnCadastrar.classList.add("hidden");
      btnSair.classList.remove("hidden");
      if (btnPerfil) btnPerfil.classList.remove("hidden"); // só se existir
    } else {
      btnLogin.classList.remove("hidden");
      btnCadastrar.classList.remove("hidden");
      btnSair.classList.add("hidden");
      if (btnPerfil) btnPerfil.classList.add("hidden");    // só se existir
    }
  }

  // Executa na carga da página
  atualizaBotoes();

  // Clique em SAIR
  btnSair.addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    atualizaBotoes();
    // Se quiser redirecionar: window.location.href = "login.html";
  });
});
