const tablero = document.getElementById("tablero");
const contexto = tablero.getContext("2d");
const elementoPuntuacion = document.querySelector("span");
const elementoIniciarJuego = document.querySelector("p");
const elementoPadre = document.querySelector("section");

const TAMANIO_BLOQUE = 20;
const ANCHO_TABLERO = 14;
const ALTURA_TABLERO = 30;

let puntuacion = 0;

tablero.width = TAMANIO_BLOQUE * ANCHO_TABLERO;
tablero.height = TAMANIO_BLOQUE * ALTURA_TABLERO;

contexto.scale(TAMANIO_BLOQUE, TAMANIO_BLOQUE);

const crearTablero = (ancho, altura) => Array(altura).fill().map(() => Array(ancho).fill(0));

const tableroJuego = crearTablero(ANCHO_TABLERO, ALTURA_TABLERO);

const pieza = {
  posicion: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1],
  ]
}

const PIEZAS = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ]
]

let eliminarContador = 0;
let ultimoTiempo = 0;

const juego = (tiempo = 0) => {
  const retrasoTiempo = tiempo - ultimoTiempo;
  ultimoTiempo = tiempo;

  eliminarContador += retrasoTiempo;
  if(eliminarContador > 1000) {
    pieza.posicion.y++;
    eliminarContador = 0;
    if(verificarColision()) {
      pieza.posicion.y--;
      solidificarPieza();
      removerFilaCompleta();
    }
  }
  dibujarTablero();
  window.requestAnimationFrame(juego);
}

const verificarColision = () => {
  return pieza.shape.find((fila, y) => {
    return fila.find((columna, x) => {
      return (
        columna !== 0 &&
        tableroJuego[y + pieza.posicion.y]?.[x + pieza.posicion.x] !== 0
      )
    })
  })
} 

const solidificarPieza = () => {
  pieza.shape.forEach((fila, y) => {
    fila.forEach((columna, x) => {
      if(columna === 1) {
        tableroJuego[y + pieza.posicion.y][x + pieza.posicion.x] = 1;
      }
    })
  });

  pieza.shape = PIEZAS[Math.floor(Math.random() * PIEZAS.length)];
  pieza.posicion.x = Math.floor(ANCHO_TABLERO / 2 - 2);
  pieza.posicion.y = 0;
  if(verificarColision()) {
    window.alert("Juego Terminado!!");
    tableroJuego.forEach((fila) => fila.fill(0))
  }
}

const removerFilaCompleta = () => {
  const filasARemover = [];

  tableroJuego.forEach((fila, y) => {
    if(fila.every(columna => columna === 1)) {
      filasARemover.push(y);
    }
  });

  filasARemover.forEach((fila) => {
    tableroJuego.splice(fila, 1);
    const nuevaFila = Array(ANCHO_TABLERO).fill(0);
    tableroJuego.unshift(nuevaFila);
    puntuacion += 10;
  })
}

const dibujarTablero = () => {
  contexto.fillStyle = "yellow";
  contexto.fillRect(0, 0, tablero.width, tablero.height);
  
  tableroJuego.forEach((fila, y) => {
    fila.forEach((columna, x) => {
      if(columna === 1) {
        contexto.fillStyle = "green";
        contexto.fillRect(x, y, 1, 1);
      }
    })
  });

  pieza.shape.forEach((fila, y) => {
    fila.forEach((columna, x) => {
      if(columna) {
        contexto.fillStyle = "red";
        contexto.fillRect(x + pieza.posicion.x, y + pieza.posicion.y, 1, 1);
      }
    })
  });

  elementoPuntuacion.innerText = puntuacion;
}

document.addEventListener("keydown", (event) => {
  if(event.key === 'ArrowLeft') { 
    pieza.posicion.x--;
    if(verificarColision()) {
      pieza.posicion.x++;
    }
  }
  if(event.key === 'ArrowRight') { 
    pieza.posicion.x++; 
    if(verificarColision()) {
      pieza.posicion.x--;
    }
  }
  if(event.key === 'ArrowDown') {
    pieza.posicion.y++;
    if(verificarColision()) {
      pieza.posicion.y--;
      solidificarPieza();
      removerFilaCompleta();
    }
  }

  if(event.key === 'ArrowUp') {
    const rotacionPieza = [];
    for(let i = 0; i < pieza.shape[0].length; i++) {
      const fila = [];
      for(let j = pieza.shape.length - 1; j >= 0; j--) {
        fila.push(pieza.shape[j][i]);
      }

      rotacionPieza.push(fila);
    }

    const piezaAnterior = pieza.shape;
    pieza.shape = rotacionPieza;
    if(verificarColision()) {
      pieza.shape = piezaAnterior;
    }
  }
});

elementoIniciarJuego.addEventListener("click", () => {
  juego()
  elementoPadre.remove();
});
