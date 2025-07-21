function validarCamposMG1(form) {
  form.querySelectorAll(".error-message").forEach(span => span.textContent = "");

  const lambdaInput = form.querySelector("#lambda");
  const esInput = form.querySelector("#es");
  const thetaInput = form.querySelector("#theta");
  const unidadES = form.querySelector("#unidadES")?.value;
  const unidadTheta = form.querySelector("#unidadTheta")?.value;

  const lambda = lambdaInput?.value.trim();
  const es = esInput?.value.trim();
  const theta = thetaInput?.value.trim();

  let valido = true;

  if (!lambda || parseFloat(lambda) <= 0) {
    form.querySelector("#error-lambda").textContent = "λ debe ser mayor que 0.";
    valido = false;
  }

  if (!es || parseFloat(es) <= 0) {
    form.querySelector("#error-es").textContent = "E(s) debe ser mayor que 0.";
    valido = false;
  }

  if (!theta || parseFloat(theta) < 0) {
    form.querySelector("#error-theta").textContent = "θ no puede ser negativo.";
    valido = false;
  }

  if (!unidadES || !unidadTheta) {
    if (!unidadES) form.querySelector("#error-es").textContent = "Seleccione unidad de E(s).";
    if (!unidadTheta) form.querySelector("#error-theta").textContent = "Seleccione unidad de θ.";
    valido = false;
  }

  const convertirUnidad = (valor, unidad) => {
    const v = parseFloat(valor);
    if (unidad === "segundos") return v / 3600;
    if (unidad === "minutos") return v / 60;
    return v; // ya está en horas
  };

  const esFinal = convertirUnidad(es, unidadES);
  const thetaFinal = convertirUnidad(theta, unidadTheta);

  const lambdaNum = parseFloat(lambda);
  const mu = 1 / esFinal;
  const rho = lambdaNum / mu;

  if (rho >= 1) {
    form.querySelector("#error-lambda").textContent = "El sistema no es estable (ρ ≥ 1).";
    valido = false;
  }

  return {
    valido,
    lambda: lambdaNum,
    es: esFinal,
    theta: thetaFinal,
    mu,
    rho
  };
}

function calcularMG1(lambda, es, theta, mu, rho) {
  const Lq = ((Math.pow(lambda, 2) * theta) + Math.pow(rho, 2)) / (2 * (1 - rho));
  const En = Lq + rho;
  const Wq = Lq / lambda;
  const Et = Wq + es;

  return {
    mu,
    rho,
    En,
    Et,
    Lq,
    Wq
  };
}

function mostrarResultadosMG1(resultados) {
  const seccionResultados = document.getElementById("resultados");
  const contenedor = document.getElementById("resultados-container");
  contenedor.innerHTML = "";

  const tarjetas = [
    { simbolo: "🔧 μ", valor: resultados.mu.toFixed(4), desc: "Tasa de servicio", formula: "μ = 1 / E(s)" },
    { simbolo: "🔄 ρ", valor: resultados.rho.toFixed(4), desc: "Utilización del sistema", formula: "ρ = λ / μ" },
    { simbolo: "🧍‍♂️ E(n)", valor: resultados.En.toFixed(4), desc: "Clientes promedio en el sistema", formula: "E(n) = Lq + ρ" },
    { simbolo: "⏱ E(T)", valor: resultados.Et.toFixed(4) + " h", desc: "Tiempo promedio en el sistema", formula: "E(T) = wq + E(s)" },
    { simbolo: "📥 Lq", valor: resultados.Lq.toFixed(4), desc: "Clientes promedio en cola", formula: "Lq = (λ²·θ + ρ²) / [2(1 - ρ)]" },
    { simbolo: "⌛ wq", valor: resultados.Wq.toFixed(4) + " h", desc: "Tiempo promedio en cola", formula: "wq = Lq / λ" }
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
