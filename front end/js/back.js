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
          alert("Registro exitoso");
        }, 
        error: function(){
            alert("Registro exitoso");
          }
      })
}



