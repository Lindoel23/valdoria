function calcular() {
  const rural = Number(document.getElementById("rural").value);
  const urbana = Number(document.getElementById("urbana").value);
  const outras = Number(document.getElementById("outras").value);

  const salarios = Number(document.getElementById("salarios").value);
  const operacional = Number(document.getElementById("operacional").value);

  const totalRenda = rural + urbana + outras;
  const totalDespesas = salarios + operacional;
  const balanco = totalRenda - totalDespesas;

  document.getElementById("totalRenda").textContent = totalRenda;
  document.getElementById("totalDespesas").textContent = totalDespesas;

  const balancoEl = document.getElementById("balanco");

  if (balanco < 0) {
    balancoEl.textContent = `Déficit de ${Math.abs(balanco)} PO`;
    balancoEl.style.color = "#ff6b6b";
  } else {
    balancoEl.textContent = `Superávit de ${balanco} PO`;
    balancoEl.style.color = "#ffd700";
  }
}

document.querySelectorAll("input").forEach(i =>
  i.addEventListener("input", calcular)
);

calcular();
