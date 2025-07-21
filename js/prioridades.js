function calcularPrioridadesLambdaMu(w0, lambda1, lambda2, mu) {
  const lambdaTotal = lambda1 + lambda2;
  const rho = lambdaTotal / mu;

  const W1 = w0 / (1 - (lambda2 / mu));
  const W2 = w0;

  const wq1 = W1 - (1 / mu);
  const wq2 = W2 - (1 / mu);

  return {
    metodo: "λ y μ",
    lambda1,
    lambda2,
    mu,
    w0,
    rho,
    W1,
    W2,
    wq1,
    wq2
  };
}
function calcularPrioridadesQTs(w0, q1, ts1, q2, ts2) {
  const W1 = w0 + (q2 * ts2);
  const W2 = w0;

  const wq1 = W1 - ts1;
  const wq2 = W2 - ts2;

  const rhoEstimada = (q1 * ts1 + q2 * ts2) / (q1 + q2); // modelo alternativo

  return {
    metodo: "Q y Ts",
    q1,
    ts1,
    q2,
    ts2,
    w0,
    W1,
    W2,
    wq1,
    wq2,
    rho: rhoEstimada
  };
}

function mostrarResultadosPrioridades(resultados) {
  const seccionResultados = document.getElementById("resultados");
  const contenedor = document.getElementById("resultados-container");
  contenedor.innerHTML = "";

  const tarjetas = [
    { simbolo: "⏱ W₁", valor: resultados.W1.toFixed(4) + " min", desc: "Tiempo promedio en el sistema (prioridad 1)", formula: resultados.metodo === "λ y μ" ? "W₁ = w₀ / (1 - λ₂ / μ)" : "W₁ = w₀ + Q₂ · Ts₂" },
    { simbolo: "⌛ wq₁", valor: resultados.wq1.toFixed(4) + " min", desc: "Tiempo en cola (prioridad 1)", formula: resultados.metodo === "λ y μ" ? "wq₁ = W₁ - 1/μ" : "wq₁ = W₁ - Ts₁" },
    { simbolo: "⏱ W₂", valor: resultados.W2.toFixed(4) + " min", desc: "Tiempo promedio en el sistema (prioridad 2)", formula: resultados.metodo === "λ y μ" ? "W₂ = w₀" : "W₂ = w₀" },
    { simbolo: "⌛ wq₂", valor: resultados.wq2.toFixed(4) + " min", desc: "Tiempo en cola (prioridad 2)", formula: resultados.metodo === "λ y μ" ? "wq₂ = W₂ - 1/μ" : "wq₂ = W₂ - Ts₂" },
    { simbolo: "📊 ρ", valor: resultados.rho.toFixed(4), desc: "Utilización estimada del sistema", formula: resultados.metodo === "λ y μ" ? "ρ = (λ₁ + λ₂) / μ" : "ρ ≈ carga promedio" },
    { simbolo: "🧠 Método", valor: resultados.metodo, desc: "Tipo de cálculo aplicado", formula: "" }
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

function validarCamposPrioridades(form) {
  form.querySelectorAll(".error-message").forEach(span => span.textContent = "");

  const tipo = form.querySelector("#tipoPrioridad")?.value;

  let valido = true;

  if (!tipo) {
    form.querySelector("#error-tipoPrioridad").textContent = "Seleccione el tipo de cálculo.";
    return { valido: false }; // No se puede seguir sin tipo
  }

  if (tipo === "lambda_mu") {
    const w0 = form.querySelector("#w0")?.value.trim();
    const lambda1 = form.querySelector("#lambda1")?.value.trim();
    const lambda2 = form.querySelector("#lambda2")?.value.trim();
    const mu = form.querySelector("#mu")?.value.trim();

    if (!w0 || parseFloat(w0) <= 0) {
      form.querySelector("#error-w0").textContent = "w₀ debe ser mayor que 0.";
      valido = false;
    }

    if (!lambda1 || parseFloat(lambda1) < 0) {
      form.querySelector("#error-lambda1").textContent = "λ₁ debe ser mayor o igual que 0.";
      valido = false;
    }

    if (!lambda2 || parseFloat(lambda2) < 0) {
      form.querySelector("#error-lambda2").textContent = "λ₂ debe ser mayor o igual que 0.";
      valido = false;
    }

    if (!mu || parseFloat(mu) <= 0) {
      form.querySelector("#error-mu").textContent = "μ debe ser mayor que 0.";
      valido = false;
    }

    return {
      valido,
      tipo,
      w0: parseFloat(w0),
      lambda1: parseFloat(lambda1),
      lambda2: parseFloat(lambda2),
      mu: parseFloat(mu)
    };
  }

  if (tipo === "q_ts") {
    const w0 = form.querySelector("#w0b")?.value.trim();
    const q1 = form.querySelector("#q1")?.value.trim();
    const ts1 = form.querySelector("#ts1")?.value.trim();
    const q2 = form.querySelector("#q2")?.value.trim();
    const ts2 = form.querySelector("#ts2")?.value.trim();

    if (!w0 || parseFloat(w0) < 0) {
      form.querySelector("#error-w0b").textContent = "w₀ debe ser mayor o igual que 0.";
      valido = false;
    }

    if (!q1 || parseFloat(q1) < 0) {
      form.querySelector("#error-q1").textContent = "Q₁ debe ser mayor o igual que 0.";
      valido = false;
    }

    if (!ts1 || parseFloat(ts1) <= 0) {
      form.querySelector("#error-ts1").textContent = "Ts₁ debe ser mayor que 0.";
      valido = false;
    }

    if (!q2 || parseFloat(q2) < 0) {
      form.querySelector("#error-q2").textContent = "Q₂ debe ser mayor o igual que 0.";
      valido = false;
    }

    if (!ts2 || parseFloat(ts2) <= 0) {
      form.querySelector("#error-ts2").textContent = "Ts₂ debe ser mayor que 0.";
      valido = false;
    }

    return {
      valido,
      tipo,
      w0: parseFloat(w0),
      q1: parseFloat(q1),
      ts1: parseFloat(ts1),
      q2: parseFloat(q2),
      ts2: parseFloat(ts2)
    };
  }

  return { valido: false };
}
