var  request  =  new  XMLHttpRequest(); 

request.open('GET','/dummydata.json',true);    

request.onload = function() {
   
    if (request.status >= 200 && request.status < 400) {
        var platillos = JSON.parse(request.responseText);        
        var platillo;
        
        for (var i = 0; i < platillos.length; i++) {
            platillo = creaPlatillo(platillos[i]);
            document.getElementById("menu").appendChild(platillo);
        }

        // Ponemos los event listeners en los botones clase botonAgregar
        var botones = document.getElementsByClassName("botonAgregar");

        for (var i = 0; i < botones.length; i ++) {
            botones[i].addEventListener("click",agregaPlatillo);    
        }

    } else {        
        console.log ("Salió mal");            
    }
}

request.send();

var envio = new XMLHttpRequest();
envio.open("POST", "ajaxfile.php", true); 
envio.setRequestHeader("Content-Type", "application/json");

envio.onreadystatechange = function() {
    //Crear el modal


    if (this.readyState == 4 && this.status == 200) {
        //Cambiar el texto del modal para que diga que funcionó
        
    }
    else {
        //Cambiar el texto del modal para que diga que falló
       
    }

    //Darle show al modal

};

function creaPlatillo (platillo) {
    var card = document.createElement("div");
    card.classList.add("card");

    var cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    var cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.innerText = platillo.nombre;

    var cardDescription = document.createElement("p");
    cardDescription.classList.add("card-text");
    cardDescription.innerText = platillo.descripcion;

    var cardPrice = document.createElement("p");
    cardPrice.classList.add("card-text");
    cardPrice.innerHTML = "<strong>" + platillo.precio + "</strong>";

    var cardButton = document.createElement("button");
    cardButton.classList.add("botonAgregar");
    cardButton.classList.add("btn");
    cardButton.classList.add("btn-primary");
    cardButton.setAttribute("precio",platillo.precio);
    cardButton.setAttribute("plato",platillo.nombre);
    cardButton.innerText = "Agregar a la canasta";

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardDescription);
    cardBody.appendChild(cardPrice);
    cardBody.appendChild(cardButton);

    card.appendChild(cardBody);

    return card;
}

//Esta variable va a guardar toda la información de la orden
var factura  = {
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    propina: 10,
    platillos: [],
    getTotal: function() {        
        var total = 0;        
        for (var i=0;i < this.platillos.length; i++) {
            total += this.platillos[i].precio;
        }                    
        return total;
    },
    addPlatillo: function(platillo) {
        this.platillos.push(platillo);
    },
    getPropina: function() {        
        return (this.getTotal() * this.propina) / 100;
    },
    setPropina: function(valor){
        this.propina = valor;
    },
    setNombre: function(nombre) {
        this.nombre = nombre;
    },
    setApellido: function(apellido) {
        this.apellido = apellido;
    },
    setDireccion: function(direccion) {
        this.direccion = direccion;
    },
    setTelefono: function(telefono) {
        this.telefono = telefono;
    },
    clearPlatillos: function() {
        this.platillos = [];
    }    
};

// Ponemos los event listeners a los radios
var radios = document.getElementsByName("propina");
for (var i= 0; i < radios.length; i ++) {
    radios[i].addEventListener("click",cambiaPropina);
}

//Poner un event listener al submit del form
document.getElementsByTagName("form")[0].addEventListener("submit",revisarForm);

//Poner un event listener al reset del form
document.getElementsByTagName("form")[0].addEventListener("reset",limpiarForm);

function agregaPlatillo (e) {       
    // Evitamos que el form se envíe 
    e.preventDefault();
    
    //Voy a crear un objeto para guardar la info del platillo
    var platillo = {
        nombre:e.target.getAttribute("plato"),
        precio:parseFloat(e.target.getAttribute("precio")),
        cantidad: 1
    };
    
    factura.addPlatillo(platillo);            
        
    // Este div es la línea 
    var elementoNuevo = document.createElement("div");

    // Creamos un span con el precio
    var elementoPrecio = document.createElement("span");
    elementoPrecio.classList.add("entrada");
    elementoPrecio.classList.add("precio");
    elementoPrecio.innerText = platillo.precio;
    
    //Lo metemos al div
    elementoNuevo.appendChild(elementoPrecio);

    //Creamos un span con la descripción
    var elementoDescripcion = document.createElement("span");
    elementoDescripcion.classList.add("entrada");
    elementoDescripcion.classList.add("descripcion");
    elementoDescripcion.innerText = platillo.nombre;
    //Lo metemos al div
    elementoNuevo.appendChild(elementoDescripcion);

    //Agregamos el botón del basurero
    var elementoBorrar = document.createElement("span");
    elementoBorrar.classList.add("entrada");
    var imagen = document.createElement("img");
    imagen.classList.add("borrar");
    imagen.src = "/images/t.png";
    imagen.setAttribute("posicion",factura.platillos.length-1);
    elementoBorrar.appendChild(imagen);
    elementoNuevo.appendChild(elementoBorrar);
    
    //Ponemos el div en el formulario
    document.getElementById("orden").appendChild(elementoNuevo);    

    //Pongo el event listener
    var basureros = document.getElementsByClassName("borrar");
    basureros[basureros.length-1].addEventListener("click",function(e){
        var posicion = e.target.getAttribute("posicion");

        factura.platillos.splice(posicion,1);

        var tira='img[posicion="' + posicion + '"]';        
        var imagen = document.querySelector(tira);
        // var linea = e.target.parentelement.parentelement

        var linea = document.querySelector(tira).parentElement.parentElement;
                
        document.getElementById("orden").removeChild(linea);
                

    });

    //Refrescamos el total en el formulario 
    actualizaTotal();  
    
}

function cambiaPropina(e) {           
    var controlPropina = document.getElementsByName("propina");
    //Reviso el valor del radio de propinas
    for (var i = 0; i < controlPropina.length; i++) {
        if (controlPropina[i].checked) {            
            factura.setPropina(parseInt(controlPropina[i].value));            
            break; //Interrumpe el ciclo
        }
    }
    
    actualizaTotal();
    
}

function actualizaTotal() {
    document.getElementById("subtotal").innerText = factura.getTotal();
    document.getElementById("propina").innerText = factura.getPropina();
    document.getElementById("total").innerText = factura.getTotal() + factura.getPropina();
}

function revisaTexto (nombreCampo) {
    var result = true;

    if (document.getElementById(nombreCampo).value.trim() == "") {        
        document.getElementById("datosPersonales").style.display="block";
        document.getElementById(nombreCampo).classList.add("controlError");        
        result = false;
    }
    else {        
        document.getElementById("datosPersonales").style.display="none";
        document.getElementById(nombreCampo).classList.remove("controlError");
    }

    return result;
}

function revisarForm(e) {
    if (factura.getTotal() === 0) {
        document.getElementById("ordenVacia").style.display="block";        
        e.preventDefault();
    }
    else {
        document.getElementById("ordenVacia").style.display="none";
    }

    var formBueno = revisaTexto("nombre") && revisaTexto("apellido") && revisaTexto("telefono") && revisaTexto("direccion");

    if (formBueno) {
        factura.setNombre(document.getElementById("nombre").value);
        factura.setApellido(document.getElementById("apellido").value);
        factura.setDireccion(document.getElementById("direccion").value);
        factura.setTelefono(document.getElementById("telefono").value);    
        
        envio.send(JSON.stringify(factura));
        
    }
    
    e.preventDefault();
}

function limpiarForm () {
    factura.setNombre("");
    factura.setApellido("");
    factura.setTelefono("");
    factura.setDireccion("");
    factura.clearPlatillos();

    document.getElementById("orden").innerHTML="";
}




/*
var xhttp = new XMLHttpRequest();
xhttp.open("POST", "ajaxfile.php", true); 
xhttp.setRequestHeader("Content-Type", "application/json");
xhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) {
     // Response
     var response = this.responseText;
   }
};
var data = {name:'yogesh',salary: 35000,email: 'yogesh@makitweb.com'};
xhttp.send(JSON.stringify(data));
*/