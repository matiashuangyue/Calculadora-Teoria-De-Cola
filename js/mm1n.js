function calcularMM1N(lambda, mu, N, numeroClientes, tipoCalculo, contexto) {
  const rho = lambda / mu;
  const p0 = rho === 1 ? 1 / (N + 1) : (1 - rho) / (1 - Math.pow(rho, N + 1));

  // Función para calcular P(n)
  function Pn(n) {
    if (n > N) return 0;
    return p0 * Math.pow(rho, n);
  }
// calcular probabilidad
  let probabilidad;
  if (tipoCalculo === "exactamente") {
    probabilidad = Pn(numeroClientes);
  } else if (tipoCalculo === "almenos") {
    probabilidad = 0;
    for (let i = numeroClientes; i <= N; i++) {
      probabilidad += Pn(i);
    }
  } else if (tipoCalculo === "alosumo") {
    probabilidad = 0;
    for (let i = 0; i <= numeroClientes; i++) {
      probabilidad += Pn(i);
    }
  }
// calcular Ls y Lq
  let Ls = 0;
  let Lq = 0;
  for (let n = 1; n <= N; n++) {
    Ls += n * Pn(n);
    if (n >= 2) Lq += (n - 1) * Pn(n);
  }
// calcular Pb, tasaEfectiva, Ws y Wq
  const Pb = Pn(N);
  const tasaEfectiva = lambda * (1 - Pb);
  const Ws = Ls / tasaEfectiva;
  const Wq = Lq / tasaEfectiva;

  return {
    rho,
    P0: p0,
    Pb,
    probabilidad,
    tipoCalculo,
    contexto,
    tasaEfectiva,
    tasaRechazo: lambda * Pb,
    Ls,
    Lq,
    Ws,
    Wq,
    numeroClientes
  };
}

function mostrarResultadosMM1N(resultados) {
  const seccionResultados = document.getElementById("resultados");
  const contenedor = document.getElementById("resultados-container");
  contenedor.innerHTML = "";

  const labelProb =
    resultados.tipoCalculo === "exactamente" ? "P(n = " + resultados.numeroClientes + ")"
    : resultados.tipoCalculo === "almenos" ? "P(n ≥ " + resultados.numeroClientes + ")"
    : "P(n ≤ " + resultados.numeroClientes + ")";

  const tarjetas = [
    { simbolo: "📦 P₀", valor: resultados.P0.toFixed(4), desc: "Probabilidad de que el sistema esté vacío", formula: "P₀ = 1 - ρ (ajustada a N)" },
    { simbolo: "🔄 ρ", valor: resultados.rho.toFixed(4), desc: "Tasa de utilización", formula: "ρ = λ / μ" },
    { simbolo: "📌 " + labelProb, valor: resultados.probabilidad.toFixed(4), desc: "Probabilidad solicitada", formula: `Según cálculo "${resultados.tipoCalculo}"` },
    { simbolo: "🚫 Pᴮ", valor: resultados.Pb.toFixed(4), desc: "Probabilidad de rechazo (sistema lleno)", formula: "Pᴮ = P(N)" },
    { simbolo: "📈 L", valor: resultados.Ls.toFixed(4), desc: "Clientes promedio en el sistema", formula: "Σ n·P(n)" },
    { simbolo: "📥 Lq", valor: resultados.Lq.toFixed(4), desc: "Clientes promedio en la cola", formula: "Σ (n-1)·P(n)" },
    { simbolo: "⏱ W", valor: resultados.Ws.toFixed(4) + " hora", desc: "Tiempo promedio en el sistema", formula: "W = L / tasa efectiva" },
    { simbolo: "⌛ Wq", valor: resultados.Wq.toFixed(4) + " hora", desc: "Tiempo promedio en la cola", formula: "Wq = Lq / tasa efectiva" },
    { simbolo: "📤 λₑ", valor: resultados.tasaEfectiva.toFixed(4), desc: "Tasa de llegada efectiva", formula: "λ(1 - Pᴮ)" },
    { simbolo: "❌ Rechazo", valor: resultados.tasaRechazo.toFixed(4), desc: "Tasa de rechazo", formula: "λ · Pᴮ" }
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


function validarCamposMM1N(form) {
  form.querySelectorAll(".error-message").forEach(span => span.textContent = "");

  const lambdaInput = form.querySelector("#lambda");
  const muInput = form.querySelector("#mu");
  const nInput = form.querySelector("#n");
  const numeroClientesInput = form.querySelector("#numeroClientes");
  const tipoCalculoInput = form.querySelector("#tipoCalculo");
  const contextoInput = form.querySelector("#contexto");

  const lambda = lambdaInput?.value.trim();
  const mu = muInput?.value.trim();
  const n = nInput?.value.trim();
  const numeroClientes = numeroClientesInput?.value.trim();
  const tipoCalculo = tipoCalculoInput?.value;
  const contexto = contextoInput?.value;

  let valido = true;

  // ⚙️ Validar λ
  if (!lambda) {
    form.querySelector("#error-lambda").textContent = "Ingrese la tasa de llegada (λ).";
    valido = false;
  } else if (parseFloat(lambda) <= 0) {
    form.querySelector("#error-lambda").textContent = "λ debe ser mayor que 0.";
    valido = false;
  }

  // ⚙️ Validar μ
  if (!mu) {
    form.querySelector("#error-mu").textContent = "Ingrese la tasa de servicio (μ).";
    valido = false;
  } else if (parseFloat(mu) <= 0) {
    form.querySelector("#error-mu").textContent = "μ debe ser mayor que 0.";
    valido = false;
  }

  // ⚙️ Validar N
  if (!n) {
    form.querySelector("#error-n").textContent = "Ingrese la capacidad máxima (N).";
    valido = false;
  } else if (parseInt(n) <= 0 || !Number.isInteger(parseFloat(n))) {
    form.querySelector("#error-n").textContent = "N debe ser un número entero mayor que 0.";
    valido = false;
  }

  // ⚙️ Validar número de clientes
  if (!numeroClientes) {
    form.querySelector("#error-numeroClientes").textContent = "Ingrese la cantidad de clientes.";
    valido = false;
  } else if (parseInt(numeroClientes) < 0 || !Number.isInteger(parseFloat(numeroClientes))) {
    form.querySelector("#error-numeroClientes").textContent = "Debe ser un número entero no negativo.";
    valido = false;
  }

  // ⚙️ Validar tipo de cálculo
  if (!tipoCalculo) {
    form.querySelector("#error-tipoCalculo").textContent = "Seleccione un tipo de cálculo.";
    valido = false;
  }

  // ⚙️ Validar contexto
  if (!contexto) {
    form.querySelector("#error-contexto").textContent = "Seleccione un contexto.";
    valido = false;
  }

  return {
    valido,
    lambda: parseFloat(lambda),
    mu: parseFloat(mu),
    n: parseInt(n),
    numeroClientes: parseInt(numeroClientes),
    tipoCalculo,
    contexto
  };
}
