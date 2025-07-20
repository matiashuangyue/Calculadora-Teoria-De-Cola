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
const contenedorCalculo = document.getElementById("formulario-calculo");

contenedorCalculo.addEventListener("submit", function (event) {
    const form = event.target;

    if (form.id === "form-activo") {
        event.preventDefault();

        // Limpiar errores anteriores
        form.querySelectorAll(".error-message").forEach(span => span.textContent = "");

        const lambdaInput = form.querySelector("#lambda");
        const muInput = form.querySelector("#mu");
        const tipoCalculo = form.querySelector("#tipoCalculo");
        const contexto = form.querySelector("#contexto");

        const lambda = lambdaInput.value.trim();
        const mu = muInput.value.trim();
        const tipo = tipoCalculo.value;
        const ctx = contexto.value;

        let valido = true;

        if (!lambda) {
            form.querySelector("#error-lambda").textContent = "Ingrese la tasa de llegada (λ).";
            valido = false;
        } else if (parseFloat(lambda) <= 0) {
            form.querySelector("#error-lambda").textContent = "λ debe ser mayor que 0.";
            valido = false;
        }

        if (!mu) {
            form.querySelector("#error-mu").textContent = "Ingrese la tasa de servicio (μ).";
            valido = false;
        } else if (parseFloat(mu) <= 0) {
            form.querySelector("#error-mu").textContent = "μ debe ser mayor que 0.";
            valido = false;
        }

        if (!tipo) {
            form.querySelector("#error-tipoCalculo").textContent = "Seleccione un tipo de cálculo.";
            valido = false;
        }

        if (!ctx) {
            form.querySelector("#error-contexto").textContent = "Seleccione un contexto.";
            valido = false;
        }

        if (!valido) return;

        // Resultado temporal
        const resultado = calcularMM1(parseFloat(lambda), parseFloat(mu), tipo, ctx);
        alert("Resultado: " + resultado);
    }
});


contenedorCalculo.addEventListener("reset", function (event) {
    const form = event.target;
    if (form.id === "form-activo") {
        form.querySelectorAll(".error-message").forEach(span => span.textContent = "");
    }
});




});



// Función de cálculo MM1 (ejemplo, reemplazar con tu lógica real)
function calcularMM1(lambda, mu, tipo, contexto) {
    const rho = lambda / mu;
    let resultado;

    if (rho >= 1) {
        return "El sistema no es estable (ρ ≥ 1)";
    }

    if (tipo === "exactamente" && contexto === "sistema") {
        resultado = "Ejemplo de cálculo exacto para sistema";
    } else if (tipo === "exactamente" && contexto === "cola") {
        resultado = "Ejemplo de cálculo exacto para cola";
    } else {
        resultado = `ρ = ${rho.toFixed(3)} (estabilidad asegurada)`;
    }

    return resultado;
}
