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
        // Ocultar sección de resultados si está visible
        OcultarResultados();
        // Clonar el formulario del modelo seleccionado
        const formularioOriginal = document.getElementById(`form-${modelo}`);
        const contenedorCalculo = document.getElementById("formulario-calculo");

        if (formularioOriginal && contenedorCalculo) {
            contenedorCalculo.innerHTML = "";

            // Clonar el contenido interior, no el nodo con ID duplicado
            const contenido = formularioOriginal.innerHTML;
            const wrapper = document.createElement("div");
            wrapper.innerHTML = contenido;
            wrapper.querySelector("form").id = "form-activo"; // ID único temporal

            contenedorCalculo.appendChild(wrapper);
            contenedorCalculo.scrollIntoView({ behavior: "smooth" });
        }
    });
});


        // Delegar validación del formulario clonado en el contenedor
const contenedorCalculo = document.getElementById("formulario-calculo");// Asegúrate de que este contenedor exista

contenedorCalculo.addEventListener("submit", function (event) {
    const form = event.target;

    if (form.id === "form-activo") {
        event.preventDefault();

        const { valido, lambda, mu, tipo, ctx } = validarCamposMM1(form);

        if (!valido) return;

        const resultados = calcularMM1(lambda, mu, tipo, ctx);
        mostrarResultadosMM1(resultados);
    }
});



contenedorCalculo.addEventListener("reset", function (event) {
    const form = event.target;
    if (form.id === "form-activo") {
        // Limpiar mensajes de error
        limpiarErrores(form);
         // Ocultar sección de resultados
        OcultarResultados();
    }
});
});

function limpiarErrores(form) {
    form.querySelectorAll(".error-message").forEach(span => span.textContent = "");
}

function OcultarResultados() {
    const seccionResultados = document.getElementById("resultados");
    if (seccionResultados) {
        seccionResultados.style.display = "none";
    }
}
