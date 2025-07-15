document.addEventListener("DOMContentLoaded", () => {
    const btnSend = document.querySelector(".send");

    btnSend.addEventListener("click", async (e) => {
        e.preventDefault();

        // Campos do formulário
        const tipoEletronico = document.getElementById("eletronico").value;
        const nivelNecessidade = document.getElementById("estadoeletro").value;
        const estado = document.getElementById("estado").value;
        const cidade = document.getElementById("city").value.trim();
        const fileInput = document.getElementById("file-upload");

        // Validação simples
        if (!tipoEletronico || !nivelNecessidade || !estado || !cidade) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        const formData = new FormData();
        formData.append("tipoEletronico", tipoEletronico);
        formData.append("nivelNecessidade", nivelNecessidade);
        formData.append("estado", estado);
        formData.append("cidade", cidade);

        if (fileInput.files[0]) {
            formData.append("comprovanteEscolar", fileInput.files[0]);
        }

        try {
            const res = await fetch("/api/pedidos", {
                method: "POST",
                body: formData,
                credentials: "include" // Para manter a sessão/cookies
            });

            if (res.ok) {
                const data = await res.json();
                alert("Pedido de doação cadastrado com sucesso!");
                window.location.href = "fordonation.html";
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || "Erro ao cadastrar pedido");
            }
        } catch (err) {
            console.error("Erro:", err);
            alert("Falha ao cadastrar: " + err.message);
        }
    });

    // Preview da imagem
    document.getElementById("file-upload").addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const preview = document.getElementById("preview");
                preview.style.backgroundImage = `url(${event.target.result})`;
                preview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });
});