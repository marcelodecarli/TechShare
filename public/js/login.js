const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // importante para cookies de autenticação
      body: JSON.stringify({ email, senha })
    });

    if (res.ok) {
      alert("Login realizado com sucesso!");
      window.location.href = "index.html"; 
    } else {
      const data = await res.json();
      alert(data.message || "Erro ao fazer login");
    }
  } catch (error) {
    alert("Erro na requisição: " + error.message);
  }
});
