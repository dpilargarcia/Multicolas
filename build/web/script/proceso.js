function Proceso(id,nombre,prioridad,inicio,tiempo, recursoDisponible){
	this.id = id;
	this.nombre = nombre;
	this.tiempo = tiempo;
	this.q=5;
	this.qRestante;
	this.recursoDisponible = recursoDisponible;
	this.t = tiempo;
        this.inicio = inicio;
	this.prioridad = prioridad;
	this.enve;
}