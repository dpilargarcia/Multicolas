/* clase Procesador */

function Procesador(quantum) {
    this.cronometro = -1;
    this.CPU = new Cola();
    this.listosP1 = new Cola();
    this.listosP2 = new Cola();
    this.listosP3 = new Cola();
    this.suspendidos = new Cola();
    this.bloqueados = new Cola();
    this.terminados = new Cola();
    this.estados = [];
    this.quantum = 5;
    this.rendimientoProcesos = [];
    this.rendimientoCPU = 0;
    this.envejecimiento = 0;

    this.CrearProceso = crearProceso;
    this.CorrerProcesador = correrProcesador;
    this.DetenerProcesador = detenerProcesador;
    this.GuardarEstadosProcesos = guardarEstadosProcesos;
    this.CalcularRendimiento = calcularrendimiento;
    this.BuscarEnTerminados = buscarEnTerminados;
    this.CalcularQuantum = calcularQuantum;


}

function crearProceso(proceso) {
    proceso.q = this.quantum;
    proceso.qRestante = this.quantum;

    //Guardar los procesos según su prioridad en una lista, ya sea P1, P2 o P3, teniendo en cuenta la cantidad de procesos que hay por prioridad (numP1++, numP2++)
    if (proceso.prioridad == 1) {
        this.listosP1.Listainsertar(proceso);
        this.CalcularQuantum();
    }
    else if (proceso.prioridad == 2) {
        proceso.enve = parseInt(parseInt(proceso.t) * this.envejecimiento);
        this.listosP2.Listainsertar2(proceso);
    } else {
        proceso.enve = parseInt(parseInt(proceso.t) * this.envejecimiento);
        this.listosP3.Listainsertar(proceso);
    }

    this.estados[proceso.id] = [];
}

/* algoritmo Round Robin */
function correrProcesador(recursoDisponible) {
    this.cronometro++;

    //Si hay algo en suspendidos. Acá se manejaron los 3 algoritmos. Si el proceso tiene prioridad 1 y ya no le queda más tiempo en suspendidos, se inserta en P1, los de p2 en P2, etc
    if (!this.suspendidos.Listavacia()) {
        var colaAux = new Cola();
        var procesoAux;
        while (!this.suspendidos.Listavacia()) {
            procesoAux = this.suspendidos.Listaatender();
            procesoAux.qRestante--;
            if (procesoAux.qRestante == 0) {
                if (procesoAux.prioridad == 1) {
                    this.listosP1.Listainsertar(procesoAux);
                    this.CalcularQuantum();
                }

                else if (procesoAux.prioridad == 2) {
                    procesoAux.enve = parseInt(parseInt(procesoAux.t) * this.envejecimiento);
                    this.listosP2.Listainsertar2(procesoAux);
                }

                else {
                    procesoAux.enve = parseInt(parseInt(procesoAux.t) * this.envejecimiento);
                    this.listosP3.Listainsertar(procesoAux);
                }

            }
            else { // si tiene que esperar aún en la cola de suspendidos
                colaAux.Listainsertar(procesoAux);
            }
        }
        while (!colaAux.Listavacia()) {
            procesoAux = colaAux.Listaatender();
            this.suspendidos.Listainsertar(procesoAux);
        }
    }

    /* si hay algo en la cola de bloqueados (revisa todos los procesos, y decide si enviarlos a listos o si continuan en bloqueados). Inserta en la lista segun prioridad */
    if (!this.bloqueados.Listavacia()) {
        var colaAux = new Cola();
        var procesoAux;
        while (!this.bloqueados.Listavacia()) {
            procesoAux = this.bloqueados.Listaatender();

            // revisar recursos


            // si el recurso esta disponible 
            if (recursoDisponible.estado == 1) {
                if (procesoAux.prioridad == 1) {
                    procesoAux.qRestante = 5; 
                    this.listosP1.Listainsertar(procesoAux);
                    this.CalcularQuantum(); /////// recalcular quenatum ------------------------------------------------------------------
                }
                else if (procesoAux.prioridad == 2) {
                    procesoAux.enve = parseInt(parseInt(procesoAux.t) * this.envejecimiento);
                    procesoAux.qRestante = 5;
                    this.listosP2.Listainsertar2(procesoAux);
                }
                else {
                    procesoAux.enve = parseInt(parseInt(procesoAux.t) * this.envejecimiento);
                    procesoAux.qRestante = 5;
                    this.listosP3.Listainsertar(procesoAux);
                }
            }// si el recurso no esta disponible
            else {
                colaAux.Listainsertar(procesoAux);
            }
            break;


        }
        while (!colaAux.Listavacia()) {
            procesoAux = colaAux.Listaatender();
            this.bloqueados.Listainsertar(procesoAux);
        }
    }

    /* si hay algo en ejecucion en CPU */
    if (!this.CPU.Listavacia()) {
        var procesoAux = this.CPU.Listaatender();
        procesoAux.tiempo--;
        procesoAux.qRestante--;
        /* si no le queda tiempo de ejecución al proceso va a la cola de terminados*/
        if (procesoAux.tiempo == 0) {
            /* buscar el recurso y liberarlo */
            recursoDisponible.estado = 1;
            this.terminados.Listainsertar(procesoAux);
        }
        else {
            /* si no le queda tiempo de quantum al proceso ( va para la cola de suspendido ) Cambia según la prioridad. Para = 1 si el Q se ha acabado en CPU  la manda a susp. */
            if (procesoAux.prioridad == 1) {

                if (procesoAux.qRestante == 0) {
                    /* buscar el recurso y liberarlo */
                    recursoDisponible.estado = 1;
                    procesoAux.qRestante = 5; //  ojojojojojojojojojojo este tiempo es el que va a durar en espera en suspendido
                    this.suspendidos.Listainsertar(procesoAux);
                }

                else {
                    /* si el proceso debe continuar en ejecucion regresa a la cola de CPU */
                    this.CPU.Listainsertar(procesoAux);
                }
            }

            /* para  = 2 realiza la expulsión segun el menor que llegue en tiempo y manda a suspendido el que está en CPU*/
            else if (procesoAux.prioridad == 2) {
                if (!this.listosP2.Listavacia()) {
                    if (procesoAux.tiempo > this.listosP2.ListagetRaiz().t) {
                        /* buscar el recurso y liberarlo */
                        recursoDisponible.estado = 1;
                        procesoAux.qRestante = 2; //  ojojojojojojojojojojo este tiempo es el que va a durar en espera en suspendido
                        this.suspendidos.Listainsertar2(procesoAux);
                    }
                    /* si el proceso debe continuar en ejecucion regresa a la cola de CPU */
                    else {
                        this.CPU.Listainsertar(procesoAux);
                    }
                } else {
                    this.CPU.Listainsertar(procesoAux);
                }
            }

            /* Si no posee prioridad ni 1 ni 2 (o sea 3) sigue en CPU ya que es FIFO */
            else {
                this.CPU.Listainsertar(procesoAux);
            }
        }
    }

    /* Algoritmo de colas multiples -- colas de listos*/

    /**/
    /* Primero se antiende la cola numero 1, mientras hayan procesos en ella que no han sido atendidos  */
    if (!this.listosP1.Listavacia()) {

        /* mientras la CPU esta disponible y haya algo por antender en listos */
        while (this.CPU.Listavacia() && !this.listosP1.Listavacia()) {
            var procesoAux = this.listosP1.Listaatender();
            /* revisar recursos */


            /* si el recurso esta disponible */
            if (recursoDisponible.estado == 1) {
                this.CPU.Listainsertar(procesoAux);
                recursoDisponible.estado = 0;
            }/* si el recurso no esta disponible*/
            else {
                this.bloqueados.Listainsertar(procesoAux);
            }
            break;


        }

        /* si en la CPU se esta atendiendo algo pero la prioridad es mayor */
        if (!this.CPU.Listavacia() && this.CPU.ListagetRaiz().prioridad > 1) {
            var procesoAux = this.CPU.Listaatender();
            /* buscar el recurso y liberarlo */
            recursoDisponible.estado = 1;
            /* mientras la CPU esta disponible y haya algo por antender en listos */
            while (this.CPU.Listavacia() && !this.listosP1.Listavacia()) {
                var procesoAux2 = this.listosP1.Listaatender();
                /* si el recurso esta disponible */
                if (recursoDisponible.estado == 1) {
                    this.CPU.Listainsertar(procesoAux2);
                    recursoDisponible.estado = 0;
                }/* si el recurso no esta disponible*/
                else {
                    this.bloqueados.Listainsertar(procesoAux2);
                }
                break;
            }

            if (this.CPU.Listavacia()) {
                this.CPU.Listainsertar(procesoAux);
                /* buscar el recurso y ocuparlo */
                recursoDisponible.estado = 0;
            }
            else {
                procesoAux.qRestante = 2; //  ojojojojojojojojojojo este tiempo es el que va a durar en espera en suspendido
                this.suspendidos.Listainsertar(procesoAux);
            }
        }
    }   /* listos 2 */
    else {
        if (!this.listosP2.Listavacia()) {

            /* mientras la CPU esta disponible y haya algo por antender en listos */
            while (this.CPU.Listavacia() && !this.listosP2.Listavacia()) {
                var procesoAux = this.listosP2.Listaatender();
                /* revisar recursos */
                if (recursoDisponible.estado == 1) {
                    this.CPU.Listainsertar(procesoAux);
                    recursoDisponible.estado = 0;
                }/* si el recurso no esta disponible*/
                else {
                    this.bloqueados.Listainsertar(procesoAux);
                }
                break;



            }

            /* si en la CPU se esta atendiendo algo pero la prioridad es mayor */
            if (!this.CPU.Listavacia() && this.CPU.ListagetRaiz().prioridad > 2) {
                var procesoAux = this.CPU.Listaatender();
                /* buscar el recurso y liberarlo */
                recursoDisponible.estado = 1;
                /* mientras la CPU esta disponible y haya algo por antender en listos */
                while (this.CPU.Listavacia() && !this.listosP2.Listavacia()) {
                    var procesoAux2 = this.listosP2.Listaatender();
                    /* si el recurso esta disponible */
                    if (recursoDisponible.estado == 1) {
                        this.CPU.Listainsertar(procesoAux2);
                        recursoDisponible.estado = 0;
                    }/* si el recurso no esta disponible*/
                    else {
                        this.bloqueados.Listainsertar(procesoAux2);
                    }
                    break;


                }

                if (this.CPU.Listavacia()) {
                    this.CPU.Listainsertar(procesoAux);
                    /* buscar el recurso y ocuparlo */
                    recursoDisponible.estado = 0;
                }
                else {
                    procesoAux.qRestante = 2; //  ojojojojojojojojojojo este tiempo es el que va a durar en espera en suspendido
                    this.suspendidos.Listainsertar(procesoAux);
                }
            }

            /* envejecer */
            var colaAux = new Cola();
            while (!this.listosP2.Listavacia()) {
                var process = this.listosP2.Listaatender();
                process.enve--;
                if (process.enve == 0) {
                    process.prioridad = 1;
                    process.qRestante = 5;
                    this.listosP1.Listainsertar(process);
                    this.CalcularQuantum();
                }
                else {
                    colaAux.Listainsertar(process);
                }
            }
            while (!colaAux.Listavacia()) {
                var process = colaAux.Listaatender();
                process.qRestante = 5;
                this.listosP2.Listainsertar(process);
            }
        }
        else {
            /*Atender la cola numero 3.*/
            if (!this.listosP3.Listavacia()) {

                /* mientras la CPU esta disponible y haya algo por antender en listos */
                while (this.CPU.Listavacia() && !this.listosP3.Listavacia()) {
                    var procesoAux = this.listosP3.Listaatender();
                    /* revisar recursos */

                    /* si el recurso esta disponible */
                    if (recursoDisponible.estado == 1) {
                        this.CPU.Listainsertar(procesoAux);
                        recursoDisponible.estado = 0;
                    }/* si el recurso no esta disponible*/
                    else {
                        this.bloqueados.Listainsertar(procesoAux);
                    }
                    break;
                }

                /* envejecer */
                var colaAux = new Cola();
                while (!this.listosP3.Listavacia()) {
                    var process = this.listosP3.Listaatender();
                    process.enve--;
                    if (process.enve == 0) {
                        process.prioridad = 2;
                        process.enve = parseInt(parseInt(process.t) * this.envejecimiento);
                        process.qRestante = 5;
                        this.listosP2.Listainsertar2(process);
                    }
                    else {
                        colaAux.Listainsertar(process);
                    }
                }
                while (!colaAux.Listavacia()) {
                    var process = colaAux.Listaatender();
                    process.qRestante = 5;
                    this.listosP3.Listainsertar(process);
                }
            }
        }
    }



    this.GuardarEstadosProcesos();

}


function detenerProcesador(recursoDisponible) {
    if (!this.CPU.Listavacia()) {
        var procesoAux = this.CPU.Listaatender();
        procesoAux.qRestante = 2; 
        this.bloqueados.Listainsertar(procesoAux);
        recursoDisponible.estado = 1;
    }
}

/* funcion para guardar el estado de cada proceso en un instante dado 
 toca recorrer cada cola */
function guardarEstadosProcesos() {

    var procesoAux;
    var contadorAux;
    /* cola de listos */
    var colaAux = new Cola();
    while (!this.listosP1.Listavacia()) {//
        procesoAux = this.listosP1.Listaatender();//
        contadorAux = this.estados[procesoAux.id].length;
        this.estados[procesoAux.id][contadorAux] = [this.cronometro, "L"];
        colaAux.Listainsertar(procesoAux);
    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        this.listosP1.Listainsertar(procesoAux); //
    }

    while (!this.listosP2.Listavacia()) {//
        procesoAux = this.listosP2.Listaatender();//
        contadorAux = this.estados[procesoAux.id].length;
        this.estados[procesoAux.id][contadorAux] = [this.cronometro, "L"];
        colaAux.Listainsertar(procesoAux);
    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        this.listosP2.Listainsertar(procesoAux); //
    }

    while (!this.listosP3.Listavacia()) {//
        procesoAux = this.listosP3.Listaatender();//
        contadorAux = this.estados[procesoAux.id].length;
        this.estados[procesoAux.id][contadorAux] = [this.cronometro, "L"];
        colaAux.Listainsertar(procesoAux);
    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        this.listosP3.Listainsertar(procesoAux); //
    }
    /* cola de CPU */
    while (!this.CPU.Listavacia()) {//
        procesoAux = this.CPU.Listaatender();//
        contadorAux = this.estados[procesoAux.id].length;
        this.estados[procesoAux.id][contadorAux] = [this.cronometro, "E"];
        colaAux.Listainsertar(procesoAux);

    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        this.CPU.Listainsertar(procesoAux); //
    }

    /* cola de suspendidos */
    while (!this.suspendidos.Listavacia()) {//
        procesoAux = this.suspendidos.Listaatender();//
        contadorAux = this.estados[procesoAux.id].length;
        this.estados[procesoAux.id][contadorAux] = [this.cronometro, "S"];
        colaAux.Listainsertar(procesoAux);
    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        this.suspendidos.Listainsertar(procesoAux); //
    }

    /* cola de bloqueados */
    while (!this.bloqueados.Listavacia()) {//
        procesoAux = this.bloqueados.Listaatender();//
        contadorAux = this.estados[procesoAux.id].length;
        this.estados[procesoAux.id][contadorAux] = [this.cronometro, "B"];
        colaAux.Listainsertar(procesoAux);
    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        this.bloqueados.Listainsertar(procesoAux); //
    }
}

function calcularrendimiento() {
    if (this.cronometro > 0) {

        var tiempoProceso;
        var tiempoRespuesta;
        var tiempoEspera;
        var penalizacion;
        var respuesta;

        for (var i = 0; i < this.estados.length; i++) {
            var procesoAux = this.BuscarEnTerminados(i);
            if (procesoAux) {
                tiempoProceso = procesoAux.t;
                tiempoRespuesta = this.estados[i].length;
                tiempoEspera = tiempoRespuesta - tiempoProceso;
                penalizacion = tiempoRespuesta / tiempoProceso;
                respuesta = 1 / penalizacion;
                this.rendimientoProcesos[i] = [tiempoProceso, tiempoRespuesta, tiempoEspera, penalizacion, respuesta];
            }
            else {
                this.rendimientoProcesos[i] = "-----";
            }
        }


        /* renimdiento cpu */
        var colaAux = new Cola();
        var procesoAux;
        var tiempoTotal = 0;
        for (var i = 0; i < this.estados.length; i++) {
            for (var j = 0; j < this.estados[i].length; j++) {
                if (this.estados[i][j][1] == "E") {
                    tiempoTotal++;
                }
            }
        }

        this.rendimientoCPU = parseInt((tiempoTotal * 100) / (this.cronometro + 1));

    }
}

function buscarEnTerminados(id) {
    var colaAux = new Cola();
    var procesoAux;
    var proceso = false
    while (!this.terminados.Listavacia()) {
        procesoAux = this.terminados.Listaatender();
        if (procesoAux.id == id) {
            proceso = new Proceso(procesoAux.id, procesoAux.nombre, procesoAux.t, procesoAux.recursoDisponible);
        }
        colaAux.Listainsertar(procesoAux);
    }
    while (!colaAux.Listavacia()) {
        procesoAux = colaAux.Listaatender();
        this.terminados.Listainsertar(procesoAux);
    }
    return proceso;
}


/* metodo para recalcular quatum cada que sea necesario*/
function calcularQuantum() {
    if (!this.listosP1.Listavacia()) {
        var colaAux = new Cola();
        var promedio = 0;
        var numeroProcesos = 0;
        var procesoAux;
        while (!this.listosP1.Listavacia()) {
            procesoAux = this.listosP1.Listaatender();
            promedio += parseInt(procesoAux.tiempo);
            numeroProcesos++;
            colaAux.Listainsertar(procesoAux);
        }
        promedio = promedio / numeroProcesos;
        while (!colaAux.Listavacia()) {
            procesoAux = colaAux.Listaatender();
            /* si solo hay un elemento en la cola de listos, el quantum es el mismo tiempo*/
            if (numeroProcesos == 1) {
                procesoAux.q = 5;
                procesoAux.qRestante = Math.abs(procesoAux.q--);
            }
            else {
                procesoAux.q = 5;
                procesoAux.qRestante = Math.abs(procesoAux.q--);
            }
            if (procesoAux.q == 0) {
                procesoAux.q = 1;
                procesoAux.qRestante = 1;

            }
            this.listosP1.Listainsertar(procesoAux);
        }
    }
}


