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

            // Agregar el formulario clonado al contenedor
            // cambiar el comportamiento según el modelo
            // cambiar modo de calculo según el seleccion de prioridades
            if (modelo === "prioridades") {
                const tipoSelect = wrapperForm.querySelector("#tipoPrioridad");
                const grupoLambdaMu = wrapperForm.querySelector("#grupo-lambda-mu");
                const grupoQTs = wrapperForm.querySelector("#grupo-q-ts");

                if (tipoSelect) {
                    tipoSelect.addEventListener("change", () => {
                    const opcion = tipoSelect.value;
                    grupoLambdaMu.style.display = opcion === "lambda_mu" ? "block" : "none";
                    grupoQTs.style.display = opcion === "q_ts" ? "block" : "none";
                    console.log("Opción seleccionada:", opcion);
                    OcultarResultados();
                    });
                }
            }
            //-------------------------------------------------------------------------------------



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

    if (form.classList.contains("mm1n")) {
        const { valido, lambda, mu, n, numeroClientes, tipoCalculo, contexto } = validarCamposMM1N(form);
        if (!valido) return;

        const resultados = calcularMM1N(lambda, mu, n, numeroClientes, tipoCalculo, contexto);
        mostrarResultadosMM1N(resultados);
    }

    if (form.classList.contains("md1")) {
        const { valido, lambda, es, mu, rho } = validarCamposMD1(form);

        if (!valido) return;

        const resultados = calcularMD1(lambda, es, mu, rho);


        mostrarResultadosMD1(resultados);
    }

    if (form.classList.contains("mg1")) {
        const { valido, lambda, es, theta, mu, rho } = validarCamposMG1(form);
        if (!valido) return;

        const resultados = calcularMG1(lambda, es, theta, mu, rho);
        mostrarResultadosMG1(resultados);
    }





        

   if (form.classList.contains("prioridades")) {
  const validacion = validarCamposPrioridades(form);
  if (!validacion.valido) return;

  let resultados;

  if (validacion.tipo === "lambda_mu") {
    resultados = calcularPrioridadesLambdaMu(validacion.w0, validacion.lambda1, validacion.lambda2, validacion.mu);
  }

  if (validacion.tipo === "q_ts") {
    resultados = calcularPrioridadesQTs(validacion.w0, validacion.q1, validacion.ts1, validacion.q2, validacion.ts2);
  }

  mostrarResultadosPrioridades(resultados);
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
