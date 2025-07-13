
document.addEventListener("DOMContentLoaded", () => {
    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const itemId = button.getAttribute("data-id");

            if (!itemId) {
                alert("ID do item não encontrado.");
                return;
            }

            const confirmDelete = confirm("Tem certeza que deseja excluir este item?");
            if (!confirmDelete) return;

            try {
                const res = await fetch(`http://localhost:3000/api/items/${itemId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const data = await res.json();

                if (res.ok) {
                    alert("Item excluído com sucesso!");
                    button.closest(".col-md-4").remove();
                } else {
                    alert(data.message || "Erro ao excluir o item.");
                }
            } catch (error) {
                alert("Erro na requisição: " + error.message);
            }
        });
    });
});
