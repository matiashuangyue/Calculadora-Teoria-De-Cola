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
            const wrapperForm = wrapper.querySelector("form");
            wrapperForm.id = "form-activo";
            wrapperForm.classList.add(modelo); // modelo será: "mm1", "mm2", etc.
            console.log("Clase asignada al formulario:", wrapperForm.classList);


            contenedorCalculo.appendChild(wrapper);
            contenedorCalculo.scrollIntoView({ behavior: "smooth" });
        }
    });
});


        // Delegar validación del formulario clonado en el contenedor
const contenedorCalculo = document.getElementById("formulario-calculo");// Asegúrate de que este contenedor exista

// Evento de submit en el formulario mm1
contenedorCalculo.addEventListener("submit", function (event) {
    const form = event.target;
    if (form.id !== "form-activo") return;
    console.log("Formulario activo. Clases:", form.classList);

    event.preventDefault();

    if (form.classList.contains("mm1")) {
        const { valido, lambda, mu, tipo, ctx } = validarCamposMM1(form);
        if (!valido) return;
        const resultados = calcularMM1(lambda, mu, tipo, ctx);
        mostrarResultadosMM1(resultados);
    }

    if (form.classList.contains("mm2")) {
        const { valido, lambda, mu1, mu2, seleccion } = validarCamposMM2(form);
        if (!valido) return;
        const resultados = calcularMM2(lambda, mu1, mu2, seleccion);
        mostrarResultadosMM2(resultados);
    }

    // Agregás más modelos aquí en el futuro...
});


// Evento de reset en el formulario mm1
contenedorCalculo.addEventListener("reset", function (event) {
    const form = event.target;
    if (form.id === "form-activo") {
        // Limpiar mensajes de error
        limpiarErrores(form);
         // Ocultar sección de resultados
        OcultarResultados();
    }
});

// Evento de submit en el formulario mm2
contenedorCalculo.addEventListener("submit", function (event) {
    const form = event.target;

    if (form.id === "form-activo" && form.classList.contains("mm2")) {
        event.preventDefault();

        const { valido, lambda, mu1, mu2, seleccion} = validarCamposMM2(form);

        if (!valido) return;

        const resultados = calcularMM2(lambda, mu1, mu2,);
        mostrarResultadosMM2(resultados);
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
