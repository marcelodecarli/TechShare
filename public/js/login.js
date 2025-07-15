const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email  = document.getElementById("email").value.trim();
  const senha  = document.getElementById("senha").value.trim();

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",                // se usa cookies
      body: JSON.stringify({ email, senha })
    });

    if (res.ok) {
      localStorage.setItem("loggedIn", "true");   // marca como logado
    

      alert("Login realizado com sucesso!");
      window.location.href = "index.html";        // volta pra home
    } else {
      const data = await res.json();
      alert(data.message || "Erro ao fazer login");
    }
  } catch (err) {
    alert("Erro na requisição: " + err.message);
  }
});
