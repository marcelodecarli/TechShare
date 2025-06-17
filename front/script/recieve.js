document.getElementById("file-upload").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const preview = document.getElementById("preview");
            preview.style.backgroundImage = `url(${event.target.result})`;
        };
        reader.readAsDataURL(file);
    }
});
