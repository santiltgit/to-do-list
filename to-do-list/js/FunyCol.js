const input = document.querySelector(".agregarTarea input");
const listaTareas = document.querySelector(".listaTareas ul");
const message = document.querySelector(".listaTareas");
const contador = document.getElementById("contador");

let tareas = [];

eventolistado();

function eventolistado () {
    document.addEventListener("DOMContentLoaded", () => {
        tareas = JSON.parse(localStorage.getItem("tareas")) || [];
        createHtml();
    });

    listaTareas.addEventListener("change", tareaCompletada);
    listaTareas.addEventListener("click", eliminartarea);
}

function tareaCompletada(e) {
    if (e.target.type === "checkbox") {
        const tareaId = parseInt(e.target.getAttribute("tarea-id"));
        tareas = tareas.map(tarea =>
            tarea.id === tareaId ? { ...tarea, completada: e.target.checked } : tarea
        );
        createHtml();
    }
}

function eliminartarea(e) {
    if (e.target.tagName === "SPAN") {
        const eliminarId = parseInt(e.target.getAttribute("tarea-id"));
        tareas = tareas.filter(tarea => tarea.id !== eliminarId);
        createHtml();
    }
}

function eliminartodo() {
    tareas = [];
    createHtml();
}

function agregartarea() {
    const tareaTexto = input.value.trim();
    if (tareaTexto === "") {
        showerror("Campo vacío");
        return;
    }
    const tareaObj = {
        tarea: tareaTexto,
        id: Date.now(),
        completada: false
    }
    tareas = [...tareas, tareaObj];
    createHtml();
    input.value = "";
}

function createHtml() {
    clearhtml();
    if (tareas.length > 0) {
        tareas.forEach(tarea => {
            const li = document.createElement("li");
            li.setAttribute("tarea-id", tarea.id);

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.setAttribute("tarea-id", tarea.id);
            checkbox.checked = tarea.completada;

            const texto = document.createElement("p");
            texto.textContent = tarea.tarea;
            if (tarea.completada) {
                texto.classList.add("completada");
            }

            const eliminar = document.createElement("span");
            eliminar.textContent = "X";
            eliminar.setAttribute("tarea-id", tarea.id);
            eliminar.classList.add("eliminar");

            li.appendChild(checkbox);
            li.appendChild(texto);
            li.appendChild(eliminar);
            listaTareas.appendChild(li);
        });
    }
    sincronizarStorage();
    actualizarContador();
}

function sincronizarStorage() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function showerror(error) {
    const messageError = document.createElement("p");
    messageError.textContent = error;
    messageError.classList.add("error");

    message.appendChild(messageError);
    setTimeout(() => {
        messageError.remove();
    }, 2000);   
}

function clearhtml(){
    listaTareas.innerHTML = "";
}

function actualizarContador() {
    const completas = tareas.filter(t => t.completada).length;
    const incompletas = tareas.length - completas;
    contador.textContent = `Completas: ${completas} | Incompletas: ${incompletas}`;
}
