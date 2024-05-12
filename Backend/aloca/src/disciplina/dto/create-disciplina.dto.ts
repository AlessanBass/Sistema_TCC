export class CreateDisciplinaDto {
	/* Pode ser que dê problema de utilizar number
	   1° Solução: trocar para string
	   2° Solução: Nunca esquecer de fazer o cast antes de persisitir os dados
	*/
	periodo: number;
	cod: string;
	nome_disciplina: string;
	carga_horaria: number;
	qtd_creditos: number;
	turma: string;
	curso_id_curso: number;
	area_id_area: number;
}
