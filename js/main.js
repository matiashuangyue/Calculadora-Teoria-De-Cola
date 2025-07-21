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
            if (modelo === "mm2") {
                const tipoSelect = wrapperForm.querySelector("#tipoMM2");
                const gruposMM2 = wrapperForm.querySelectorAll(".grupo-mm2");

                if (tipoSelect) {
                    tipoSelect.addEventListener("change", () => {
                    const tipo = tipoSelect.value;

                    // Ocultar todos los grupos primero
                    gruposMM2.forEach(grupo => {
                        grupo.style.display = "none";
                    });

                    // Mostrar solo el grupo seleccionado
                    const grupoActivo = wrapperForm.querySelector(`#grupo-${tipo}`);
                    if (grupoActivo) grupoActivo.style.display = "grid";

                    OcultarResultados();
                    });

                    // Disparar evento inicial para mostrar grupo correcto
                    tipoSelect.dispatchEvent(new Event("change"));
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

// Evento de submit en el formulario
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
  const tipoSelect = form.querySelector("#tipoMM2");
  const tipo = tipoSelect ? tipoSelect.value : null;

  if (tipo === "igual") {
    const validacion = validarCamposMM2Igual(form);
    if (!validacion.valido) return;
    const resultados = calcularMM2Igual(validacion.lambda, validacion.mu, validacion.n);
    mostrarResultadosMM2Igual(resultados);
  }

  else if (tipo === "distinto") {
    const validacion = validarCamposMM2Distinto(form);
    if (!validacion.valido) return;
    const resultados = calcularMM2Distinto(validacion.lambda, validacion.mu1, validacion.mu2);
    mostrarResultadosMM2Distinto(resultados);
  }

  else if (tipo === "seleccion") {
    const validacion = validarCamposMM2Seleccion(form);
    if (!validacion.valido) return;
    const resultados = calcularMM2Seleccion(validacion.lambda, validacion.mu1, validacion.mu2);
    mostrarResultadosMM2Seleccion(resultados);
  }

  else if (tipo === "evaluar") {
    const validacion = validarCamposMM2Evaluar(form);
    if (!validacion.valido) return;
    const resultados = evaluarTercerServidor(validacion.lambda, validacion.mu2, validacion.mu3);
    mostrarResultadosMM2Evaluar(resultados);
  }
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


// Evento de reset en el formulario 
contenedorCalculo.addEventListener("reset", function (event) {
    const form = event.target;
    if (form.id === "form-activo") {
        // Limpiar mensajes de error
        limpiarErrores(form);
         // Ocultar sección de resultados
        OcultarResultados();
        // Limpiar el contenedor del formulario
        document.getElementById("formulario-calculo").innerHTML = "";
    }
});

contenedorCalculo.addEventListener("input", e => {
  const errorSpan = e.target.closest("label")?.querySelector(".error-message");
  if (errorSpan) errorSpan.textContent = "";
});



});


function limpiarErrores(form) {
  // Limpiar todos los mensajes de error
  form.querySelectorAll(".error-message").forEach(span => span.textContent = "");
}


function OcultarResultados() {
    const seccionResultados = document.getElementById("resultados");
    if (seccionResultados) {
        seccionResultados.style.display = "none";
    }
}


document.addEventListener("DOMContentLoaded", () => {
  const valorInput = document.getElementById("valorTiempo");
  const unidadSelect = document.getElementById("unidadOrigen");
  const equivalenteSeg = document.getElementById("equivalenteSeg");
  const equivalenteMin = document.getElementById("equivalenteMin");
  const equivalenteHora = document.getElementById("equivalenteHora");

  function actualizarResultado() {
    const valor = parseFloat(valorInput.value);
    const unidad = unidadSelect.value;

    if (isNaN(valor) || valor <= 0) {
      equivalenteSeg.textContent  = "🕓 — seg";
      equivalenteMin.textContent  = "⏱ — min";
      equivalenteHora.textContent = "⌛ — h";
      return;
    }

    const segundos = unidad === "segundos" ? valor :
                     unidad === "minutos" ? valor * 60 :
                     valor * 3600;

    equivalenteSeg.textContent  = `🕓 ${segundos.toFixed(2)} seg`;
    equivalenteMin.textContent  = `⏱ ${(segundos / 60).toFixed(4)} min`;
    equivalenteHora.textContent = `⌛ ${(segundos / 3600).toFixed(4)} h`;
  }

  valorInput.addEventListener("input", actualizarResultado);
  unidadSelect.addEventListener("change", actualizarResultado);

  // Manejo de reset dentro del convertidor
  const convertidorBox = document.getElementById("convertidor-tiempo");
  const resetBtn = convertidorBox.querySelector("button[type='reset']");

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      valorInput.value = "";
      equivalenteSeg.textContent  = "🕓 — seg";
      equivalenteMin.textContent  = "⏱ — min";
      equivalenteHora.textContent = "⌛ — h";
    });
  }
});
