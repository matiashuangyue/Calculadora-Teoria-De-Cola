function validarCamposMD1(form) {
  form.querySelectorAll(".error-message").forEach(span => span.textContent = "");

  const lambdaInput = form.querySelector("#lambda");
  const esInput = form.querySelector("#es");
  const unidadInput = form.querySelector("#unidadTiempo");

  const lambda = lambdaInput?.value.trim();
  const es = esInput?.value.trim();
  const unidad = unidadInput?.value;

  let valido = true;

  if (!lambda) {
    form.querySelector("#error-lambda").textContent = "Ingrese la tasa de llegada (λ).";
    valido = false;
  } else if (parseFloat(lambda) <= 0) {
    form.querySelector("#error-lambda").textContent = "λ debe ser mayor que 0.";
    valido = false;
  }

  if (!es) {
    form.querySelector("#error-es").textContent = "Ingrese el tiempo de servicio E(s).";
    valido = false;
  } else if (parseFloat(es) <= 0) {
    form.querySelector("#error-es").textContent = "E(s) debe ser mayor que 0.";
    valido = false;
  }

  if (!unidad) {
    form.querySelector("#error-unidadTiempo").textContent = "Seleccione la unidad de tiempo.";
    valido = false;
  }

  // Convertir E(s) a horas
  let esEnHoras = parseFloat(es);
  if (unidad === "segundos") esEnHoras /= 3600;
  if (unidad === "minutos") esEnHoras /= 60;

  const lambdaNum = parseFloat(lambda);
  const mu = 1 / esEnHoras;
  const rho = lambdaNum / mu;

  if (rho >= 1) {
    form.querySelector("#error-lambda").textContent = "El sistema no es estable: ρ ≥ 1.";
    valido = false;
  }

  return {
    valido,
    lambda: lambdaNum,
    es: esEnHoras,
    mu,
    rho
  };
}

function calcularMD1(lambda, es, mu, rho) {
  const Lq = Math.pow(rho, 2) / (2 * (1 - rho));
  const L = Lq + rho;
  const Wq = Lq / lambda;
  const W = Wq + es;

  return {
    mu,
    rho,
    L,
    Lq,
    W,
    Wq,
    es
  };
}


function mostrarResultadosMD1(resultados) {
  const seccionResultados = document.getElementById("resultados");
  const contenedor = document.getElementById("resultados-container");
  contenedor.innerHTML = "";

  const tarjetas = [
    { simbolo: "🔧 μ", valor: resultados.mu.toFixed(4), desc: "Tasa de servicio", formula: "μ = 1 / E(s)" },
    { simbolo: "🔄 ρ", valor: resultados.rho.toFixed(4), desc: "Tasa de utilización", formula: "ρ = λ / μ" },
    { simbolo: "🧍‍♂️ E(n)", valor: resultados.L.toFixed(4), desc: "Clientes promedio en el sistema", formula: "E(n) = Lq + ρ" },
    { simbolo: "⏱ E(T)", valor: resultados.W.toFixed(4) + " h", desc: "Tiempo promedio en el sistema", formula: "E(T) = Wq + E(s)" },
    { simbolo: "📥 En cola", valor: resultados.Lq.toFixed(4), desc: "Clientes promedio en cola", formula: "Lq = ρ² / [2(1 - ρ)]" },
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
