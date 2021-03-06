function CrearRegistro(){
    let nombre = document.getElementById("nombre").value;
    let paterno = document.getElementById("apellidoP").value;
    let materno = document.getElementById("apellidoM").value;
    let sexo = document.getElementById("genero").value;
    let email = document.getElementById("email").value;
    let contrasena = document.getElementById("pass1").value;
    let matricula = parseInt(document.getElementById("matricula").value);
    let id_carrera = parseInt(document.getElementById("carrera").value);
    $.ajax({
        url:"http://localhost:3300/api/v1/alumnos",
        type:"POST",
        data: JSON.stringify({ nombre, paterno, materno, sexo, email, contrasena, matricula, id_carrera, "rol":"ALUMNO"}),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(){
          window.location.href = "../html/index.html";
        }, 
        error: function(){
          window.location.href = "../html/index.html";
          }
      })
}

function login(){
    let email = document.getElementById("email").value;
    let contrasena = document.getElementById("pass1").value;

  $.ajax({
    url:"http://localhost:3300/api/v1/login",
    type:"POST",
    data: JSON.stringify({ email, contrasena}),
    contentType:"application/json; charset=utf-8",
    dataType:"json",
    success: function(data){
      console.log(data)
      localStorage.setItem("datos", JSON.stringify(data))
      window.location.href = "../html/proyectos.html";
    }, 
    error: function(){
      alert ("Datos incorrectos");
      }
  })
}

function crear_proyecto() {
  let nombre_proyecto = document.getElementById("nombre_Proyecto").value;
  let nrc = document.getElementById("nrc").value;
  let fecha_inicio = document.getElementById("fecha_inicio").value;
  let fecha_fin = document.getElementById("fecha_fin").value;
  let fecha_limite = document.getElementById("fecha_limite").value;
  let descripcion = document.getElementById("descripcion").value;
  $.ajax({
    url: "http://localhost:3300/api/v1/proyectos",
    type: "POST",
    data: JSON.stringify({ nombre_proyecto, nrc, fecha_inicio, fecha_inicio, fecha_limite, descripcion}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function () {
      alert("Proyecto creado");
    }, 
    error: function(){
      alert ("Proyecto creado");
      window.location.href = "../html/proyectos.html";
      }
  })
}

function crear_tarea() {
  let nombre_proyecto = document.getElementById("nombre_tarea").value;
  let  estado_tarea = document.getElementById("estado_tarea").value;
  let fecha_inicio = document.getElementById("fecha_inicio").value;
  let fecha_fin = document.getElementById("fecha_fin").value;
  let descripcion = document.getElementById("descripcion").value;
  $.ajax({
    url: "http://localhost:3300/api/v1/anadir_tarea",
    type: "POST",
    data: JSON.stringify({ nombre_tarea, estado_tarea, fecha_inicio, fecha_fin, descripcion}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function () {
      alert("Tarea a??adida");
    }, 
    error: function(){
      alert ("Tarea a??adida");
      window.location.href = "../html/menu_proyecto.html";
      }
  })
}

function agregar_integrante() {
  let nombre_proyecto = document.getElementById("nombre_Proyecto").value;
  let  proyecto_nrc = document.getElementById("proyecto_nrc").value;
  let buscar_id_name_proyecto = document.getElementById("buscar_id_name_proyecto").value;
  let opciones_integrante = parseInt(document.getElementById("opciones_integrante").value);
  $.ajax({
    url: "http://localhost:3300/api/v1/agregar_integrante",
    type: "POST",
    data: JSON.stringify({ nombre_Proyecto, proyecto_nrc, buscar_id_name_proyecto, opciones_integrante}),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function () {
      alert("Integrante a??adido");
    }, 
    error: function(){
      alert ("Integrante a??adido");
      window.location.href = "../html/menu_proyecto.html";
      }
  })
}





