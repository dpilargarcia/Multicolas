/* Clase Cola */
function Cola() {

    /* Atributos */
    this.nodoRaiz = null;
    this.nodoFondo = null;
    this.tam = 0;

    /* Metodos */
    this.Listavacia = vacia;
    this.Listainsertar = insertar;
    this.Listaatender = atender;
    this.Listaimprimir = imprimir;
    this.ListagetRaiz = getRaiz;
    this.ListagetTam = getTam;
    this.Listainsertar2 = insertar2;

}

function vacia() {
    if (this.nodoRaiz == null) {

        return true;
    }
    else {
        return false;
    }
}

// Metodo insertar ordenado por TIEMPO
function insertar2(proceso) {

    if (this.nodoRaiz == null) {
        this.Listainsertar(proceso);
    }
    else {
        if (parseInt(proceso.tiempo) >= parseInt(this.nodoFondo.proceso.tiempo)) {
            this.Listainsertar(proceso);
        }
        else {
            var colaAux = new Cola();
            var procesoAux;
            while (!this.Listavacia()) {
                procesoAux = this.Listaatender();
                if (parseInt(proceso.tiempo) < parseInt(procesoAux.tiempo)) {
                    colaAux.Listainsertar(proceso);
                    colaAux.Listainsertar(procesoAux);
                    break;
                }
                else {
                    colaAux.Listainsertar(procesoAux);
                }
            }
            while (!this.Listavacia()) {
                procesoAux = this.Listaatender();
                colaAux.Listainsertar(procesoAux);
            }
            while (!colaAux.Listavacia()) {
                procesoAux = colaAux.Listaatender();
                this.Listainsertar(procesoAux);
            }
        }
        this.tam++;
    }
}

//Metodo insertar
function insertar(proceso) {
    var nuevo = new Nodo();

    nuevo.proceso = proceso;
    nuevo.sig = null;

    if (this.nodoRaiz == null) {
        this.nodoRaiz = nuevo;
        this.nodoFondo = nuevo;
    }
    else {
        this.nodoFondo.sig = nuevo;
        this.nodoFondo = nuevo;
    }

    this.tam++;
}

//Método atender
function atender() {

    if (!this.Listavacia()) {

        var aux = this.nodoRaiz;
        if (this.nodoRaiz == this.nodoFondo) {

            this.nodoRaiz = null;
            this.nodoFondo = null;

        }
        else {
            this.nodoRaiz = this.nodoRaiz.sig;
        }
        return aux.proceso;
    }
    else {
        return 0;
    }

}

//Método imprimir
function imprimir() {
    var aux = new Nodo();
    var procesoAux = new Proceso();
    aux = this.nodoRaiz;
    while (aux != null) {
        procesoAux = aux.proceso;
        console.log(procesoAux.id);
        aux = aux.sig;
    }
    console.log("__________");
}

function getRaiz() {
    var aux = new Nodo();
    aux = this.nodoRaiz;
    return aux.proceso;
}

function getTam() {
    return this.tam;
}

 