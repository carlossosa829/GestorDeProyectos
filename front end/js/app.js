function data() {
    if (localStorage.getItem('data') === null) {
        localStorage.setItem('data', JSON.stringify({
            users: new Array(),
            current: null,
        }));
    }
    return JSON.parse(localStorage.getItem('data'));
}

function updateData(block) {
    localStorage.setItem('data', JSON.stringify(block(data())));
}

function register() {
    let nombre = document.getElementById("nombre").value;
    let paterno = document.getElementById("apellidoP").value;
    let materno = document.getElementById("apellidoM").value;
    let sexo = document.getElementById("genero").value;
    let email = document.getElementById("email").value;
    let contrasena = document.getElementById("pass1").value;
    let matricula = parseInt(document.getElementById("matricula").value);
    let idcarrera = parseInt(document.getElementById("carrera").value);

    updateData((data) => {
        const some = data;
        some.users.push({ nombre, paterno, materno, sexo, email, contrasena, matricula, idcarrera });
        return some;
    });

    document.location.href = 'index.html';
}

function login() {
    let email = document.getElementById("email").value;
    let contrasena = document.getElementById("pass").value;

    let exists = false;

    data().users.forEach(user => {
        console.log(user);
        if (user.email === email && user.contrasena === contrasena) {
            exists = true;
            updateData((data) => {
                const some = data;
                some.current = user;
                return some;
            });
        }
    });

    if (exists) {
        document.location.href = 'proyectos.html';
    }
}

function newProject() {
    let nombreProyecto = document.getElementById("nombre_Proyecto").value;
    let nrc = document.getElementById("nrc").value;
    let fechaInicio = document.getElementById("fecha_inicio").value;
    let fechaFin = document.getElementById("fecha_fin").value;
    let fechaLimite = document.getElementById("fecha_limite").value;
    let descripcion = document.getElementById("descripcion").value;

    updateData((data) => {
        const some = data;

        if (some.current.projects === undefined) {
            some.current.projects = new Array();
        }

        some.current.projects.push({ nombreProyecto, nrc, fechaInicio, fechaFin, fechaLimite, descripcion, tareas: new Array(), colaboradores: new Array() })
        return some;
    });

    document.location.href = "proyectos.html";
}

