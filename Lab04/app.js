const formulario = document.getElementById("form-tarea");
const inputTitulo = document.getElementById("titulo");
const inputCurso = document.getElementById("curso");
const inputFecha = document.getElementById("fecha");
const alertas = document.getElementById("alertas");
const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const filtros = document.getElementById("filtros");
let tareas = [];
try {
  tareas = JSON.parse(localStorage.getItem("tareas")) || [];
} catch {
  tareas = [];
}
let filtroActual = "todas";
const guardarTareas = () => {
  localStorage.setItem("tareas", JSON.stringify(tareas));
};
const validarTarea = (tarea) => {
  const errores = [];
  if (tarea.titulo === "") {
    errores.push("El título es obligatorio.");
  }
  if (tarea.curso === "") {
    errores.push("El curso es obligatorio.");
  }
  if (tarea.fechaEntrega === "") {
    errores.push("La fecha de entrega es obligatoria.");
  } else {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaEntrega = new Date(tarea.fechaEntrega + "T00:00:00");
    if (fechaEntrega <= hoy) {
      errores.push("La fecha de entrega debe ser posterior a hoy.");
    }
  }
  return errores;
};
const mostrarAlertas = (errores) => {
  alertas.innerHTML = "";
  errores.forEach((mensaje) => {
    const div = document.createElement("div");
    div.className = "alert alert-danger py-2";
    div.textContent = mensaje;
    alertas.appendChild(div);
  });
};
const crearItem = (tarea) => {
  const { id, titulo, curso, fechaEntrega, completada } = tarea; // destructuring
  const li = document.createElement("li");
  li.className = "list-group-item d-flex justify-content-between align-items-center";
  li.dataset.id = id;
  const texto = document.createElement("span");
  texto.textContent = titulo + " — " + curso + " (entrega: " + fechaEntrega + ")";
  if (completada) {
    texto.classList.add("completada");
  }
  let textoBoton = "Completar";
  if (completada) {
    textoBoton = "Deshacer";
  }
  const botones = document.createElement("div");
  botones.innerHTML =
    '<button class="btn btn-success btn-sm me-2" data-accion="alternar">' + textoBoton + "</button>" +
    '<button class="btn btn-danger btn-sm" data-accion="eliminar">Eliminar</button>';
  li.appendChild(texto);
  li.appendChild(botones);
  return li;
};
const renderizarTareas = () => {
  lista.innerHTML = "";
  const tareasVisibles = tareas.filter((tarea) => {
    if (filtroActual === "pendientes") {
      return tarea.completada === false;
    }
    if (filtroActual === "completadas") {
      return tarea.completada === true;
    }
    return true;
  });
  const elementos = tareasVisibles.map((tarea) => crearItem(tarea));
  elementos.forEach((elemento) => {
    lista.appendChild(elemento);
  });
  const pendientes = tareas.reduce((total, tarea) => {
    if (tarea.completada === false) {
      return total + 1;
    }
    return total;
  }, 0);
  contador.textContent = "Pendientes: " + pendientes + " de " + tareas.length;
};
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const nuevaTarea = {
    id: Date.now(),
    titulo: inputTitulo.value.trim(),
    curso: inputCurso.value.trim(),
    fechaEntrega: inputFecha.value,
    completada: false,
  };
  const errores = validarTarea(nuevaTarea);
  mostrarAlertas(errores);
  if (errores.length > 0) {
    return;
  }
  tareas.push(nuevaTarea);
  guardarTareas();
  formulario.reset();
  renderizarTareas();
});
lista.addEventListener("click", (evento) => {
  const accion = evento.target.dataset.accion;
  if (!accion) {
    return;
  }
  const id = Number(evento.target.closest("li").dataset.id);
  if (accion === "eliminar") {
    tareas = tareas.filter((t) => t.id !== id);
  }
  if (accion === "alternar") {
    const tarea = tareas.find((t) => t.id === id);
    tarea.completada = !tarea.completada;
  }
  guardarTareas();
  renderizarTareas();
});
filtros.addEventListener("click", (evento) => {
  if (evento.target.tagName === "BUTTON") {
    filtroActual = evento.target.getAttribute("data-filtro");
    renderizarTareas();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  renderizarTareas();
});