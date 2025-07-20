function calcularMM2(lambda, mu1, mu2, seleccion) {
    const rho1 = lambda / mu1;
    const rho2 = lambda / mu2;  
    const P0 = 1 - (rho1 + rho2);
    const L = lambda / (mu1 - lambda) + lambda / (mu2 - lambda);
    const Lq = (lambda * lambda) / (mu1 * (mu1 - lambda)) + (lambda * lambda) / (mu2 * (mu2 - lambda));
    const W = 1 / (mu1 - lambda) + 1 / (mu2 - lambda);
    const Wq = lambda / (mu1 * (mu1 - lambda)) + lambda / (mu2 * (mu2 - lambda));
    const resultados = { rho1,rho2,P0,L,Lq,W,Wq};
    return resultados;
}
     
function mostrarResultadosMM2(resultados) {
    const seccionResultados = document.getElementById("resultados");
    const contenedor = document.getElementById("resultados-container");

    contenedor.innerHTML = ""; // limpiar

    const tarjetas = [
        { simbolo: "📦 P₀", valor: resultados.P0.toFixed(4), desc: "Probabilidad de que el sistema esté vacío", formula: "P₀ = 1 - (ρ₁ + ρ₂)" },
        { simbolo: "🔄 ρ₁", valor: resultados.rho1.toFixed(4), desc: "Tasa de utilización del primer servidor", formula: "ρ₁ = λ / μ₁" },
        { simbolo: "🔄 ρ₂", valor: resultados.rho2.toFixed(4), desc: "Tasa de utilización del segundo servidor", formula: "ρ₂ = λ / μ₂" },
        { simbolo: "🧍‍♂️ L", valor: resultados.L.toFixed(4), desc: "Clientes promedio en el sistema", formula: "L = λ / (μ₁ - λ) + λ / (μ₂ - λ)" },
        { simbolo: "📥 Lq", valor: resultados.Lq.toFixed(4), desc: "Clientes promedio en la cola", formula: "Lq = λ² / (μ₁(μ₁ - λ)) + λ² / (μ₂(μ₂ - λ))" },
        { simbolo: "⏱ W", valor: resultados.W.toFixed(4) + " min", desc: "Tiempo promedio en el sistema", formula: "W = 1 / (μ₁ - λ) + 1 / (μ₂ - λ)" },
        { simbolo: "⌛ Wq", valor: resultados.Wq.toFixed(4) + " min", desc: "Tiempo promedio en la cola", formula: "Wq = λ / (μ₁(μ₁ - λ)) + λ / (μ₂(μ₂ - λ))" },

    ];
    tarjetas.forEach(t => {
        const card = document.createElement("div");
        card.className = "resultado-card";
        card.innerHTML = `
            <div class="simbolo"><strong>${t.simbolo}</strong></div>
            <div class="valor">${t.valor}</div>
            <div class="descripcion">${t.desc}</div>
            <div class="tooltip">${t.formula}</div>
        `;
        contenedor.appendChild(card);
    });

    seccionResultados.style.display = "block";
    seccionResultados.scrollIntoView({ behavior: "smooth" });
}

function checkMM2Errors(form) {
    const lambdaInput = form.querySelector("#lambda");
    const mu1Input = form.querySelector("#mu1");
    const mu2Input = form.querySelector("#mu2");
    const seleccionInput = form.querySelector("#modoseleccion");

    const lambda = lambdaInput.value.trim();
    const mu1 = mu1Input.value.trim();
    const mu2 = mu2Input.value.trim();
    const seleccion = seleccionInput.value;
    
    let valido = true;

    if (!lambda) {
        form.querySelector("#error-lambda").textContent = "Ingrese la tasa de llegada (λ).";
        valido = false;
    }
    if (!mu1) {
        form.querySelector("#error-mu1").textContent = "Ingrese la tasa de servicio del primer servidor (μ₁).";
        valido = false;
    } else if (parseFloat(mu1) <= 0) {
        form.querySelector("#error-mu1").textContent = "μ₁ debe ser mayor que 0.";
        valido = false;
    }
    if (!mu2) {
        form.querySelector("#error-mu2").textContent = "Ingrese la tasa de servicio del segundo servidor (μ₂).";
        valido = false;
    } else if (parseFloat(mu2) <= 0) {
        form.querySelector("#error-mu2").textContent = "μ₂ debe ser mayor que 0.";
        valido = false;
    }
    if (!seleccion) {
        form.querySelector("#error-modoseleccion").textContent = "Seleccione un modo de selección.";
        valido = false;
    }
    return valido;
}

document.getElementById("formulario-calculo").addEventListener("submit", function (event) {
    const form = event.target;

    if (form.id === "form-activo") {
        event.preventDefault();

        // Limpiar errores anteriores
        form.querySelectorAll(".error-message").forEach(span => span.textContent = "");

        if (!checkMM2Errors(form)) {
            return;
        }

        const lambdaInput = form.querySelector("#lambda");
        const mu1Input = form.querySelector("#mu1");
        const mu2Input = form.querySelector("#mu2");
        const seleccionInput = form.querySelector("#modoseleccion");

        const lambda = parseFloat(lambdaInput.value);
        const mu1 = parseFloat(mu1Input.value);
        const mu2 = parseFloat(mu2Input.value);
        const seleccion = seleccionInput.value;

        // Resultado temporal
        const resultados = calcularMM2(lambda, mu1, mu2, seleccion);

        mostrarResultadosMM2(resultados);
    }
}
);

