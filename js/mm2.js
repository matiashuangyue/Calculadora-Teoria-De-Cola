//mm2 igual

function calcularMM2Igual(lambda, mu, n) {
  const s = 2;
  const rho = lambda / (s * mu);

  if (rho >= 1) {
    return { error: "El sistema no es estable (ρ ≥ 1)", rho };
  }

  // P0 con fórmula M/M/s para s = 2
  const parte1 = 1;
  const parte2 = lambda / mu;
  const parte3 = (Math.pow(lambda / mu, 2)) / (2 * (1 - rho));
  const P0 = 1 / (parte1 + parte2 + parte3);

  // Lq, L, W, Wq
  const Lq = (P0 * Math.pow(lambda / mu, s) * rho) / (2 * Math.pow(1 - rho, 2));
  const L = Lq + lambda / mu;
  const W = L / lambda;
  const Wq = Lq / lambda;

  // Pn (probabilidad de n clientes en el sistema)
  let Pn;
  if (n < s) {
    Pn = (Math.pow(lambda / mu, n) / factorial(n)) * P0;
  } else {
    Pn = (Math.pow(lambda / mu, n) / (factorial(s) * Math.pow(s, n - s))) * P0;
  }

  return {
    rho,
    P0,
    L,
    Lq,
    W,
    Wq,
    Pn,
    muTotal: s * mu,
    lambda,
    mu,
    n
  };
}

function factorial(n) {
  return n === 0 ? 1 : n * factorial(n - 1);
}

function validarCamposMM2Igual(form) {
  // Limpiar errores anteriores
  form.querySelectorAll(".error-message").forEach(span => span.textContent = "");

  const lambdaInput = form.querySelector("#lambdaIgual");
  const muInput = form.querySelector("#muIgual");
  const nInput = form.querySelector("#nIgual");

  const lambda = lambdaInput.value.trim();
  const mu = muInput.value.trim();
  const n = nInput.value.trim();

  let valido = true;

  if (!lambda) {
    form.querySelector("#error-lambdaIgual").textContent = "Ingrese la tasa de llegada (λ).";
    valido = false;
  } else if (parseFloat(lambda) <= 0) {
    form.querySelector("#error-lambdaIgual").textContent = "λ debe ser mayor que 0.";
    valido = false;
  }

  if (!mu) {
    form.querySelector("#error-muIgual").textContent = "Ingrese la tasa de servicio (μ).";
    valido = false;
  } else if (parseFloat(mu) <= 0) {
    form.querySelector("#error-muIgual").textContent = "μ debe ser mayor que 0.";
    valido = false;
  }

  if (!n) {
    form.querySelector("#error-nIgual").textContent = "Ingrese el número de clientes (n).";
    valido = false;
  } else if (parseInt(n) < 0) {
    form.querySelector("#error-nIgual").textContent = "n debe ser un número entero positivo.";
    valido = false;
  }

  return {
    valido,
    lambda: parseFloat(lambda),
    mu: parseFloat(mu),
    n: parseInt(n)
  };
}


function mostrarResultadosMM2Igual(resultados) {
  const seccionResultados = document.getElementById("resultados");
  const contenedor = document.getElementById("resultados-container");
  contenedor.innerHTML = "";

  if (resultados.error) {
    const cardError = document.createElement("div");
    cardError.className = "resultado-card error-card";
    cardError.innerHTML = `
      <div class="simbolo"><strong>❌</strong></div>
      <div class="valor">ρ = ${resultados.rho.toFixed(4)}</div>
      <div class="descripcion">El sistema es inestable</div>
      <div class="tooltip">ρ ≥ 1 significa que λ ≥ capacidad total del sistema.</div>
    `;
    contenedor.appendChild(cardError);
    seccionResultados.style.display = "block";
    seccionResultados.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const tarjetas = [
    { simbolo: "📥 λ", valor: resultados.lambda.toFixed(4), desc: "Tasa de llegada", formula: "Dato ingresado" },
    { simbolo: "⚙️ μ", valor: resultados.mu.toFixed(4), desc: "Tasa de servicio individual", formula: "Dato ingresado" },
    { simbolo: "⚙️ μ₁ + μ₂", valor: resultados.muTotal.toFixed(4), desc: "Tasa total de servicio", formula: "μ₁ + μ₂ = 2·μ" },
    { simbolo: "🔄 ρ", valor: resultados.rho.toFixed(4), desc: "Utilización del sistema", formula: "ρ = λ / (s·μ)" },
    { simbolo: "📦 P₀", valor: resultados.P0.toFixed(4), desc: "Probabilidad de 0 clientes", formula: "Ver fórmula M/M/2" },
    { simbolo: "🧍‍♂️ Ls", valor: resultados.L.toFixed(4), desc: "Clientes en sistema", formula: "L = Lq + λ / μ" },
    { simbolo: "📥 Lq", valor: resultados.Lq.toFixed(4), desc: "Clientes en cola", formula: "Lq = fórmula con P₀ y ρ" },
    { simbolo: "⏱ Ws", valor: resultados.W.toFixed(4) + " min", desc: "Tiempo en sistema", formula: "Ws = L / λ" },
    { simbolo: "⌛ Wq", valor: resultados.Wq.toFixed(4) + " min", desc: "Tiempo en cola", formula: "Wq = Lq / λ" },
    { simbolo: "📊 Pₙ", valor: resultados.Pn.toFixed(6), desc: `Probabilidad de ${resultados.n} clientes`, formula: "Pn según n" }
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



//mm2 distinto
function validarCamposMM2Distinto(form) {
  // Limpiar errores anteriores
  form.querySelectorAll(".error-message").forEach(span => span.textContent = "");

  const lambdaInput = form.querySelector("#lambdaDistinto");
  const mu1Input = form.querySelector("#mu1");
  const mu2Input = form.querySelector("#mu2");

  const lambda = lambdaInput.value.trim();
  const mu1 = mu1Input.value.trim();
  const mu2 = mu2Input.value.trim();

  let valido = true;

  if (!lambda) {
    form.querySelector("#error-lambdaDistinto").textContent = "Ingrese la tasa de llegada (λ).";
    valido = false;
  } else if (parseFloat(lambda) <= 0) {
    form.querySelector("#error-lambdaDistinto").textContent = "λ debe ser mayor que 0.";
    valido = false;
  }

  if (!mu1) {
    form.querySelector("#error-mu1").textContent = "Ingrese μ₁.";
    valido = false;
  } else if (parseFloat(mu1) <= 0) {
    form.querySelector("#error-mu1").textContent = "μ₁ debe ser mayor que 0.";
    valido = false;
  }

  if (!mu2) {
    form.querySelector("#error-mu2").textContent = "Ingrese μ₂.";
    valido = false;
  } else if (parseFloat(mu2) <= 0) {
    form.querySelector("#error-mu2").textContent = "μ₂ debe ser mayor que 0.";
    valido = false;
  }

  return {
    valido,
    lambda: parseFloat(lambda),
    mu1: parseFloat(mu1),
    mu2: parseFloat(mu2)
  };
}


function calcularMM2Distinto(lambda, mu1, mu2) {
  const muTotal = mu1 + mu2;
  const rho1 = lambda / mu1;
  const rho2 = lambda / mu2;
  const rho = lambda / muTotal;

  if (rho >= 1) {
    return { error: "El sistema no es estable (ρ ≥ 1)", rho, muTotal };
  }

  const W1 = 1 / (mu1 - lambda);
  const W2 = 1 / (mu2 - lambda);
  const W = W1 + W2;

  const L1 = lambda / (mu1 - lambda);
  const L2 = lambda / (mu2 - lambda);
  const L = L1 + L2;

  const Lq1 = (lambda * lambda) / (mu1 * (mu1 - lambda));
  const Lq2 = (lambda * lambda) / (mu2 * (mu2 - lambda));
  const Lq = Lq1 + Lq2;

  const Wq1 = lambda / (mu1 * (mu1 - lambda));
  const Wq2 = lambda / (mu2 * (mu2 - lambda));
  const Wq = Wq1 + Wq2;

  const ambosOcupados = rho1 * rho2; // Aproximación

  return {
    rho,
    rho1,
    rho2,
    mu1,
    mu2,
    muTotal,
    lambda,
    W,
    Wq,
    L,
    Lq,
    ambosOcupados
  };
}

function mostrarResultadosMM2Distinto(resultados) {
  const seccionResultados = document.getElementById("resultados");
  const contenedor = document.getElementById("resultados-container");
  contenedor.innerHTML = "";

  if (resultados.error) {
    const cardError = document.createElement("div");
    cardError.className = "resultado-card error-card";
    cardError.innerHTML = `
      <div class="simbolo"><strong>❌</strong></div>
      <div class="valor">ρ = ${resultados.rho.toFixed(4)}</div>
      <div class="descripcion">El sistema es inestable</div>
      <div class="tooltip">La tasa total de llegada supera la capacidad combinada de servicio.</div>
    `;
    contenedor.appendChild(cardError);
    seccionResultados.style.display = "block";
    seccionResultados.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const tarjetas = [
    { simbolo: "📥 λ", valor: resultados.lambda.toFixed(4), desc: "Tasa de llegada", formula: "Dato ingresado" },
    { simbolo: "⚙️ μ₁", valor: resultados.mu1.toFixed(4), desc: "Servidor 1", formula: "Dato ingresado" },
    { simbolo: "⚙️ μ₂", valor: resultados.mu2.toFixed(4), desc: "Servidor 2", formula: "Dato ingresado" },
    { simbolo: "⚙️ μ total", valor: resultados.muTotal.toFixed(4), desc: "Suma de capacidad de servicio", formula: "μ₁ + μ₂" },
    { simbolo: "🔄 ρ", valor: resultados.rho.toFixed(4), desc: "Utilización global", formula: "ρ = λ / (μ₁ + μ₂)" },
    { simbolo: "🔄 ρ₁", valor: resultados.rho1.toFixed(4), desc: "Servidor 1", formula: "ρ₁ = λ / μ₁" },
    { simbolo: "🔄 ρ₂", valor: resultados.rho2.toFixed(4), desc: "Servidor 2", formula: "ρ₂ = λ / μ₂" },
    { simbolo: "🧍‍♂️ L", valor: resultados.L.toFixed(4), desc: "Clientes en sistema", formula: "L = L₁ + L₂" },
    { simbolo: "📥 Lq", valor: resultados.Lq.toFixed(4), desc: "Clientes en cola", formula: "Lq = Lq₁ + Lq₂" },
    { simbolo: "⏱ Ws", valor: resultados.W.toFixed(4) + " min", desc: "Tiempo medio en el sistema", formula: "Ws = W₁ + W₂" },
    { simbolo: "⌛ Wq", valor: resultados.Wq.toFixed(4) + " min", desc: "Tiempo medio en cola", formula: "Wq = Wq₁ + Wq₂" },
    { simbolo: "📊 P ambos", valor: resultados.ambosOcupados.toFixed(4), desc: "Probabilidad de que ambos estén ocupados", formula: "ρ₁ · ρ₂" }
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

//mm2 con y sin selección
function validarCamposMM2Seleccion(form) {
  // Limpiar errores anteriores
  form.querySelectorAll(".error-message").forEach(span => span.textContent = "");

  const lambdaInput = form.querySelector("#lambdaSel");
  const mu1Input = form.querySelector("#mu1Sel");
  const mu2Input = form.querySelector("#mu2Sel");

  const lambda = lambdaInput.value.trim();
  const mu1 = mu1Input.value.trim();
  const mu2 = mu2Input.value.trim();

  let valido = true;

  if (!lambda) {
    form.querySelector("#error-lambdaSel").textContent = "Ingrese la tasa de llegada (λ).";
    valido = false;
  } else if (parseFloat(lambda) <= 0) {
    form.querySelector("#error-lambdaSel").textContent = "λ debe ser mayor que 0.";
    valido = false;
  }

  if (!mu1) {
    form.querySelector("#error-mu1Sel").textContent = "Ingrese μ₁.";
    valido = false;
  } else if (parseFloat(mu1) <= 0) {
    form.querySelector("#error-mu1Sel").textContent = "μ₁ debe ser mayor que 0.";
    valido = false;
  }

  if (!mu2) {
    form.querySelector("#error-mu2Sel").textContent = "Ingrese μ₂.";
    valido = false;
  } else if (parseFloat(mu2) <= 0) {
    form.querySelector("#error-mu2Sel").textContent = "μ₂ debe ser mayor que 0.";
    valido = false;
  }

  return {
    valido,
    lambda: parseFloat(lambda),
    mu1: parseFloat(mu1),
    mu2: parseFloat(mu2)
  };
}


function calcularMM2Seleccion(lambda, mu1, mu2) {
  const muTotal = mu1 + mu2;

  const rho = lambda / muTotal;
  const rhoCritico = 0.8; // umbral para evaluación

  // Sin selección (clientes se asignan aleatoriamente)
  const pi0Sin = 1 / (1 + lambda / mu1 + lambda / mu2);
  const Nsin = lambda / (mu1 - lambda) + lambda / (mu2 - lambda);
  const Wsin = Nsin / lambda;

  // Con selección (clientes prefieren al más rápido)
  const preferido = mu1 > mu2 ? mu1 : mu2;
  const pi0Con = 1 / (1 + lambda / preferido);
  const Ncon = lambda / (preferido - lambda);
  const Wcon = Ncon / lambda;

  return {
    lambda,
    mu1,
    mu2,
    muTotal,
    rho,
    rhoCritico,
    pi0Sin,
    pi0Con,
    Nsin,
    Ncon,
    Wsin,
    Wcon
  };
}

function mostrarResultadosMM2Seleccion(resultados) {
  const seccionResultados = document.getElementById("resultados");
  const contenedor = document.getElementById("resultados-container");
  contenedor.innerHTML = "";

  if (resultados.rho >= 1) {
    const cardError = document.createElement("div");
    cardError.className = "resultado-card error-card";
    cardError.innerHTML = `
      <div class="simbolo"><strong>❌</strong></div>
      <div class="valor">ρ = ${resultados.rho.toFixed(4)}</div>
      <div class="descripcion">El sistema es inestable</div>
      <div class="tooltip">ρ ≥ 1 indica que la demanda supera la capacidad de servicio total.</div>
    `;
    contenedor.appendChild(cardError);
    seccionResultados.style.display = "block";
    seccionResultados.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const tarjetas = [
    // Datos generales
    { simbolo: "📥 λ", valor: resultados.lambda.toFixed(4), desc: "Tasa de llegada", formula: "Dato ingresado" },
    { simbolo: "⚙️ μ₁", valor: resultados.mu1.toFixed(4), desc: "Servicio servidor 1", formula: "Dato ingresado" },
    { simbolo: "⚙️ μ₂", valor: resultados.mu2.toFixed(4), desc: "Servicio servidor 2", formula: "Dato ingresado" },
    { simbolo: "⚙️ μ total", valor: resultados.muTotal.toFixed(4), desc: "Capacidad total", formula: "μ₁ + μ₂" },
    { simbolo: "🔄 ρ", valor: resultados.rho.toFixed(4), desc: "Utilización global", formula: "ρ = λ / (μ₁ + μ₂)" },
    { simbolo: "⚠️ ρ crítico", valor: resultados.rhoCritico.toFixed(2), desc: "Umbral sugerido", formula: "Definido por diseño" },

    // Sin selección
    { simbolo: "📦 π₀ (sin)", valor: resultados.pi0Sin.toFixed(4), desc: "Probabilidad inicial sin selección", formula: "π₀ = 1 / (1 + λ/μ₁ + λ/μ₂)" },
    { simbolo: "🧍‍♂️ N (sin)", valor: resultados.Nsin.toFixed(4), desc: "Clientes promedio sin selección", formula: "N = λ/(μ₁ - λ) + λ/(μ₂ - λ)" },
    { simbolo: "⏱ Wₛ (sin)", valor: resultados.Wsin.toFixed(4) + " min", desc: "Tiempo medio sin selección", formula: "Wₛ = N / λ" },

    // Con selección
    { simbolo: "📦 π₀ (con)", valor: resultados.pi0Con.toFixed(4), desc: "Probabilidad inicial con selección", formula: "π₀ = 1 / (1 + λ/μ preferido)" },
    { simbolo: "🧍‍♂️ N (con)", valor: resultados.Ncon.toFixed(4), desc: "Clientes promedio con selección", formula: "N = λ / (μ - λ)" },
    { simbolo: "⏱ Wₛ (con)", valor: resultados.Wcon.toFixed(4) + " min", desc: "Tiempo medio con selección", formula: "Wₛ = N / λ" }
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



//mm2 con posibilidad de 3 servidores
function validarCamposMM2Evaluar(form) {
  // Limpiar errores anteriores
  form.querySelectorAll(".error-message").forEach(span => span.textContent = "");

  const lambdaInput = form.querySelector("#lambdaEval");
  const mu2Input = form.querySelector("#muEval");
  const mu3Input = form.querySelector("#mu3Eval");

  const lambda = lambdaInput.value.trim();
  const mu2 = mu2Input.value.trim();
  const mu3 = mu3Input.value.trim();

  let valido = true;

  if (!lambda) {
    form.querySelector("#error-lambdaEval").textContent = "Ingrese la tasa de llegada (λ).";
    valido = false;
  } else if (parseFloat(lambda) <= 0) {
    form.querySelector("#error-lambdaEval").textContent = "λ debe ser mayor que 0.";
    valido = false;
  }

  if (!mu2) {
    form.querySelector("#error-muEval").textContent = "Ingrese la tasa actual (μ).";
    valido = false;
  } else if (parseFloat(mu2) <= 0) {
    form.querySelector("#error-muEval").textContent = "μ actual debe ser mayor que 0.";
    valido = false;
  }

  if (!mu3) {
    form.querySelector("#error-mu3Eval").textContent = "Ingrese μ₃ para el tercer servidor.";
    valido = false;
  } else if (parseFloat(mu3) <= 0) {
    form.querySelector("#error-mu3Eval").textContent = "μ₃ debe ser mayor que 0.";
    valido = false;
  }

  return {
    valido,
    lambda: parseFloat(lambda),
    mu2: parseFloat(mu2),
    mu3: parseFloat(mu3)
  };
}


function evaluarTercerServidor(lambda, mu2, mu3) {
  const muDosServidores = mu2 * 2;
  const muTresServidores = mu2 * 2 + mu3;

  const rho2 = lambda / muDosServidores;
  const rho3 = lambda / muTresServidores;

  const decision =
    rho3 < 0.85
      ? "✅ Incorporar el tercer servidor mejora la estabilidad del sistema."
      : "⚠️ El impacto de agregar un tercer servidor es limitado. Revisar otros factores.";

  return {
    lambda,
    mu2,
    mu3,
    muDosServidores,
    muTresServidores,
    rho2,
    rho3,
    decision
  };
}

function mostrarResultadosMM2Evaluar(resultados) {
  const seccionResultados = document.getElementById("resultados");
  const contenedor = document.getElementById("resultados-container");
  contenedor.innerHTML = "";

  const tarjetas = [
    { simbolo: "📥 λ", valor: resultados.lambda.toFixed(4), desc: "Tasa de llegada", formula: "Dato ingresado" },
    { simbolo: "⚙️ μ (actual)", valor: resultados.mu2.toFixed(4), desc: "Tasa de servicio por servidor", formula: "Dato ingresado" },
    { simbolo: "⚙️ μ₃", valor: resultados.mu3.toFixed(4), desc: "Tasa del tercer servidor", formula: "Dato ingresado" },

    // Configuración actual
    { simbolo: "🔄 ρ (2 serv.)", valor: resultados.rho2.toFixed(4), desc: "Utilización con 2 servidores", formula: "ρ = λ / (2·μ)" },
    { simbolo: "⚙️ μ total (2)", valor: resultados.muDosServidores.toFixed(4), desc: "Capacidad actual", formula: "μ · 2" },

    // Configuración nueva
    { simbolo: "🔄 ρ (3 serv.)", valor: resultados.rho3.toFixed(4), desc: "Utilización con 3 servidores", formula: "ρ = λ / (2·μ + μ₃)" },
    { simbolo: "⚙️ μ total (3)", valor: resultados.muTresServidores.toFixed(4), desc: "Capacidad con tercer servidor", formula: "μ · 2 + μ₃" }
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

  // Tarjeta de recomendación estratégica
  const cardRecomendacion = document.createElement("div");
  cardRecomendacion.className = "resultado-card recomendacion-card";
  cardRecomendacion.innerHTML = `
    <div class="simbolo"><strong>🧠 Consejo</strong></div>
    <div class="valor">${resultados.decision}</div>
    <div class="descripcion">Evaluación estratégica para ampliar capacidad</div>
  `;
  contenedor.appendChild(cardRecomendacion);

  seccionResultados.style.display = "block";
  seccionResultados.scrollIntoView({ behavior: "smooth" });
}
