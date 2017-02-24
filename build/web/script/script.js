var procesador1 = new Procesador(5);
var p1 = 0; // variables para llevar la cuenta de los procesos por cada procesador
var hilo1;


/* --------------Main--------------------- */
$(document).ready(function () {

    preestablecer();

    function crear() {
        var nombre = n;
        var tiempo = t;
        var recursoDisponible =1;
        var prioridad = p;
        var inicio = procesador1.cronometro+1;
        var proceso = new Proceso(p1, nombre,prioridad,inicio,tiempo, recursoDisponible);
        procesador1.CrearProceso(proceso);

        p1++;
        preestablecer();
        $("#listosC1P1").html(dibujarCola(procesador1.listosP1));
        $("#listosC1P2").html(dibujarColaOrdenada(procesador1.listosP2));
        $("#listosC1P3").html(dibujarCola(procesador1.listosP3));
    }

    /* Botones para crear procesos */
    $("#crear1").click(function () {
        crear();
        crear();
        crear();

    });

    /* botones correr procesadores */
    $("#ejecutar1").click(function () {
        $("#ejecutar1").attr("disabled", true);
        $("#interrumpir1").attr("disabled", false);
        hilo1 = setInterval(function () {
            procesador1.CorrerProcesador(recursoDisponible);
            $("#listosC1P1").html(dibujarCola(procesador1.listosP1));
            $("#listosC1P2").html(dibujarColaOrdenada(procesador1.listosP2));
            $("#listosC1P3").html(dibujarCola(procesador1.listosP3));
            $("#suspendidos1").html(dibujarCola(procesador1.suspendidos));
            $("#bloqueados1").html(dibujarCola(procesador1.bloqueados));
            $("#terminados1").html(dibujarCola(procesador1.terminados));
            $("#rendimientoCPU1").html(dibujarCola(procesador1.CPU));
            procesador1.CalcularRendimiento();
//------------------------------------------------------------------------------
//                          DIAGRAMA GANTT
//------------------------------------------------------------------------------
            $("#gantt1").html("");
            pintarGantt(procesador1.estados, "#gantt1");

//------------------------------------------------------------------------------ 
        }, 1000);
        setInterval(crear, 5000);
        /*setTimeout(crear, 5000);
         setTimeout(crear, 8000);
         setTimeout(crear, 12000);
         setTimeout(crear, 17000);*/
    });
    /* botones interrumpir procesador */
    $("#interrumpir1").click(function () {
        $("#interrumpir1").attr("disabled", true);
        $("#ejecutar1").attr("disabled", false);
        procesador1.DetenerProcesador(recursoDisponible);
        clearInterval(hilo1);
        $("#listosC1P1").html(dibujarCola(procesador1.listosP1));
        $("#listosC1P2").html(dibujarColaOrdenada(procesador1.listosP2));
        $("#listosC1P3").html(dibujarCola(procesador1.listosP3));
        $("#suspendidos1").html(dibujarCola(procesador1.suspendidos));
        $("#bloqueados1").html(dibujarCola(procesador1.bloqueados));
        $("#terminados1").html(dibujarCola(procesador1.terminados));
        
    });
   
    
    /* botones calcular rendimiento */
    $("#rendimiento1").click(function () {
        procesador1.CalcularRendimiento();
        $("#vrendimiento1").html(dibujarRendiminetos(procesador1.rendimientoProcesos));

    });

});

/*-----------------------------------------*/

/* funciones de apoyo */

/* funcion para dar valores por defecto a los campos de los formularios */
function preestablecer() {
    n = ("P"+p1);
    t = (Math.floor((Math.random()*10)+1));
    p = (Math.floor((Math.random()*3)+1));
}

function dibujarCola(cola) {
    var colaAux = new Cola();
    var textoCola = "";
    var procesoAux;
    while (!cola.Listavacia()) {
        procesoAux = cola.Listaatender();
        textoCola += dibujarProceso(procesoAux);
        colaAux.Listainsertar(procesoAux);
    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        cola.Listainsertar(procesoAux);
    }
    return textoCola;
}

function dibujarColaOrdenada(cola) {
    var colaAux = new Cola();
    var textoCola = "";
    var procesoAux;
    while (!cola.Listavacia()) {
        procesoAux = cola.Listaatender();
        textoCola += dibujarProceso(procesoAux);
        colaAux.Listainsertar2(procesoAux);
    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        cola.Listainsertar2(procesoAux);
    }
    return textoCola;
}

function dibujarProceso(proceso) {
    var procesoAux = "<tr>";
    var q = Math.abs(proceso.qRestante);
    procesoAux += "<td>" + proceso.nombre + "</td>";
    procesoAux += "<td>" + "Prioridad:" + proceso.prioridad + "</td>";
    procesoAux += "<td>" + "Rafaga:" + proceso.tiempo + "</td>";
    procesoAux += "<td>" + "Quántum:" + q+ "</td>";
    procesoAux += "</tr>";
    return procesoAux;
}


function dibujarRendiminetos(procesos) {
    var texto = "<tr><td>Nombre</td><td>Tiempo P</td><td>Tiempo Respuesta</td><td>Tiempo Espera</td><td>Penalización</td><td>Proporción Respuesta</td></tr>";
    for (var i = 0; i < procesos.length; i++) {
        texto += "<tr><td>P" + i + "</td>";
        for (var j = 0; j < 5; j++) {
            texto += "<td>" + procesos[i][j] + "</td>";
        }
        texto += "</tr>";
    }
    return texto;
}

