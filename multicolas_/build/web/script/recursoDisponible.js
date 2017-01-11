/* Clase recurso */
function RecursoDisponible(estado){
	/* atributos de un recurso */
	this.estado = estado;

	/* metodos de un recurso */
	this.OcuparRecurso = ocuparRecurso;
	this.LiberarRecurso = liberarRecurso;
}

/* estados: 0 --> ocupado
			1 --> libre
 */
function ocuparRecurso(){
	this.estado = 0;
}
function liberarRecurso(){
	this.estado = 1;
}

recursoDisponible = new RecursoDisponible(1);