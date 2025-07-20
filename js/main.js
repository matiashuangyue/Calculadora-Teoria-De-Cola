// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {

    // Scroll al hacer click en el botón "Ver Calculadoras"
    const scrollBtn = document.getElementById("scrollToCalculadoras");
    if (scrollBtn) {
        scrollBtn.addEventListener("click", () => {
            document.getElementById("calculadoras").scrollIntoView({ behavior: "smooth" });
        });
    }

    // Evento al seleccionar un modelo
    const tarjetas = document.querySelectorAll(".modelo-card");
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener("click", () => {
        const modelo = tarjeta.dataset.modelo;

        // Obtener el formulario oculto correspondiente
        const formularioOriginal = document.getElementById(`form-${modelo}`);
        const contenedorCalculo = document.getElementById("formulario-calculo");

        if (formularioOriginal && contenedorCalculo) {
        // Vaciar el contenedor de cálculo
        contenedorCalculo.innerHTML = "";

        // Clonar el formulario y mostrarlo
        const formularioClonado = formularioOriginal.cloneNode(true);
        formularioClonado.style.display = "block";
        contenedorCalculo.appendChild(formularioClonado);

        // Scroll a la sección
        contenedorCalculo.scrollIntoView({ behavior: "smooth" });
            }
            });
        });


});
