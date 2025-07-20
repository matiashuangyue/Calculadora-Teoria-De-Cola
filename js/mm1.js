
// Función de cálculo MM1 (ejemplo, reemplazar con tu lógica real)
function calcularMM1(lambda, mu) {
    const rho = lambda / mu;
    const P0 = 1 - rho;
    const L = lambda / (mu - lambda);
    const Lq = (lambda * lambda) / (mu * (mu - lambda));
    const W = 1 / (mu - lambda);
    const Wq = lambda / (mu * (mu - lambda));

    return { rho, P0, L, Lq, W, Wq };
}


function mostrarResultadosMM1(resultados) {
    const seccionResultados = document.getElementById("resultados");
    const contenedor = document.getElementById("resultados-container");

    contenedor.innerHTML = ""; // limpiar

    const tarjetas = [
        { simbolo: "📦 P₀", valor: resultados.P0.toFixed(4), desc: "Probabilidad de que el sistema esté vacío", formula: "P₀ = 1 - ρ" },
        { simbolo: "🔄 ρ", valor: resultados.rho.toFixed(4), desc: "Tasa de utilización del sistema", formula: "ρ = λ / μ" },
        { simbolo: "🧍‍♂️ L", valor: resultados.L.toFixed(4), desc: "Clientes promedio en el sistema", formula: "L = λ / (μ - λ)" },
        { simbolo: "📥 Lq", valor: resultados.Lq.toFixed(4), desc: "Clientes promedio en la cola", formula: "Lq = λ² / (μ(μ - λ))" },
        { simbolo: "⏱ W", valor: resultados.W.toFixed(4) + " min", desc: "Tiempo promedio en el sistema", formula: "W = 1 / (μ - λ)" },
        { simbolo: "⌛ Wq", valor: resultados.Wq.toFixed(4) + " min", desc: "Tiempo promedio en la cola", formula: "Wq = λ / (μ(μ - λ))" },
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


function validarCamposMM1(form) {
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

    return {
        valido,
        lambda: parseFloat(lambda),
        mu: parseFloat(mu),
        tipo,
        ctx
    };
}
