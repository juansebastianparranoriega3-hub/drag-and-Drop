// ===== Referencias al DOM =====
const original = document.getElementById("luffy-original"); // imagen estática
const grupo1 = document.getElementById("grupo1");
const grupo2 = document.getElementById("grupo2");
const destino = document.getElementById("destino");
const operacion = document.getElementById("operacion");
const resultado = document.getElementById("resultado");

// ===== Estado =====
let contador = 0; // hace que cada clon tenga un ID único: imagen1, imagen2, ...
let numero1 = 0;
let numero2 = 0;

// ===== Número aleatorio ENTERO entre min y max (ambos incluidos) =====
// Math.random() da un decimal entre 0 y 1; Math.floor lo convierte a entero.
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===== Crea UN clon de la imagen original con ID único =====
function crearClon() {
  const clon = original.cloneNode(true); // copia del elemento
  contador++;
  clon.id = "imagen" + contador;
  clon.draggable = false; // los clones no se arrastran, solo la original
  clon.removeAttribute("tabindex");
  return clon;
}

// ===== clonar(cantidad): agrega varios clones a un contenedor =====
function clonar(cantidad, contenedor) {
  for (let i = 0; i < cantidad; i++) {
    contenedor.appendChild(crearClon());
  }
}

// ===== Nueva operación: dos aleatorios (1 a 10), uno por grupo =====
function nuevaOperacion() {
  grupo1.innerHTML = "";
  grupo2.innerHTML = "";
  destino.innerHTML = "";
  resultado.textContent = "";
  resultado.className = "resultado";

  numero1 = randomIntFromInterval(1, 10);
  numero2 = randomIntFromInterval(1, 10);

  clonar(numero1, grupo1);
  clonar(numero2, grupo2);

  operacion.textContent = numero1 + " + " + numero2 + " = ?";
}

// ===== Drag & Drop desde la imagen original =====
original.ondragstart = function (evento) {
  evento.dataTransfer.setData("text/plain", original.id); // guardamos el ID
  evento.dataTransfer.effectAllowed = "copy";
};

// Sin preventDefault() el navegador no permite soltar aquí
destino.ondragover = function (evento) {
  evento.preventDefault();
  destino.classList.add("sobre");
};

destino.ondragleave = function () {
  destino.classList.remove("sobre");
};

destino.ondrop = function (evento) {
  evento.preventDefault();
  destino.classList.remove("sobre");
  const idArrastrado = evento.dataTransfer.getData("text/plain");
  if (idArrastrado === original.id) {
    destino.appendChild(crearClon()); // cada arrastre crea un clon nuevo
  }
};

// ===== Clic sobre la original: también crea un clon =====
original.onclick = function () {
  destino.appendChild(crearClon());
};

// Accesibilidad: Enter o espacio equivalen al clic
original.tabIndex = 0;
original.onkeydown = function (evento) {
  if (evento.key === "Enter" || evento.key === " ") {
    evento.preventDefault();
    destino.appendChild(crearClon());
  }
};

// ===== Clic sobre un clon de la respuesta: lo elimina (remove) =====
destino.onclick = function (evento) {
  if (evento.target.tagName === "IMG") {
    evento.target.remove();
  }
};

// ===== Comprobar la operación =====
function comprobar() {
  const total = numero1 + numero2;
  const puestas = destino.querySelectorAll("img").length;

  if (puestas === total) {
    resultado.textContent = "¡Correcto! " + numero1 + " + " + numero2 + " = " + total;
    resultado.className = "resultado ok";
  } else if (puestas < total) {
    resultado.textContent = "Incorrecto: te faltan " + (total - puestas) + " Luffy.";
    resultado.className = "resultado error";
  } else {
    resultado.textContent = "Incorrecto: te sobran " + (puestas - total) + " Luffy.";
    resultado.className = "resultado error";
  }
}

// ===== Botones =====
document.getElementById("btn-comprobar").onclick = comprobar;
document.getElementById("btn-nueva").onclick = nuevaOperacion;
document.getElementById("btn-vaciar").onclick = function () {
  destino.innerHTML = "";
  resultado.textContent = "";
  resultado.className = "resultado";
};

// ===== Inicio: se invoca explícitamente al cargar =====
nuevaOperacion();
