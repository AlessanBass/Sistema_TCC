import { Injectable, BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { unlink, writeFile } from 'fs/promises';
import { AlocacaoService } from 'src/alocacao/alocacao.service';
import { AreaService } from 'src/area/area.service';
import { CursoService } from 'src/curso/curso.service';
import { DisciplinaService } from 'src/disciplina/disciplina.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SemestreService } from 'src/semestre/semestre.service';

//Interface Disicplina
interface Disicplina {
  periodo: number;
  cod: string;
  nome_disciplina: string;
  carga_horaria: number;
  qtd_creditos: number;
  curso_id_curso: number;
  area_id_area: number;
}

interface Alocacao {
  observacoes_colegiado: string;
  turma: string | null;
  disciplina_id_disciplina: number;
  professor_id_professor: number | null;
  semestre_id_semestre: number;
}

@Injectable()
export class OfertaService {
  constructor(
    private readonly _disciplina: DisciplinaService,
    private readonly _prisma: PrismaService,
    private readonly _area: AreaService,
    private readonly _curso: CursoService,
    private readonly _semestre: SemestreService,
    private readonly _alocacao: AlocacaoService

  ) { }

  async upload(file: Express.Multer.File, path: string): Promise<boolean> {
    try {
      await writeFile(path, file.buffer);
      return true;
    } catch (e) {
      throw new BadRequestException("Service: Erro ao salvar arquivo");
    }
  }

  async readExecel(file: Express.Multer.File, path: string) {
    await this.upload(file, path); /* Espera escrever o */
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(path);
    } catch (error) {
      throw new BadRequestException('Erro ao ler o arquivo Excel: ' + error.message);
    }

    // Obtendo a primeira planilha
    const sheet = workbook.getWorksheet(1);

    // Array para armazenar os dados da planilha
    const data = [];

    sheet.eachRow((row, rowNum) => {
      // Objeto para armazenar os dados de uma linha
      const rowData = {};

      row.eachCell((cell, colNum) => {
        // Verificar se o valor da célula é nulo ou indefinido
        if (cell.value === null || cell.value === undefined) {
          // Se a célula estiver vazia, definir o valor como zero
          rowData[`column${colNum}`] = 0;
        } else {
          // Se a célula não estiver vazia, usar o valor existente
          rowData[`column${colNum}`] = cell.value;
        }
      });

      // Adicionar os dados da linha ao array de dados
      data.push(rowData);
    });

    await this.excelDataProcessing(data);
    /* Jogar essa isso de apagar em uma função */
    try {
      await unlink(path);
      console.log('Arquivo excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir o arquivo:', error);
    }
  }

  async excelDataProcessing(data: any[]) {
    for (let i = 1; i < data.length; i++) {
      const item = data[i];

      /* 
        Verificar se não existe alocação repetida (alocação com o mesma turma para a mesma disciplina)

        OBS: é necessário padronizar o excel de oferta de disciplina

       */

      let area = await this.findArea(item);
      let curso = await this.findCurso(item);
      let disciplina = await this.findDisciplina(item);
      let semestre = await this.findSemestre(item);

      if (area && curso && disciplina) {
       /*  console.log(`A disciplina: ${disciplina.nome_disciplina} deve ser inserida em alocaocao`);
        console.log(`ID disciplina: ${disciplina.id_disciplina} deve ser inserida em alocaocao`);
        console.log(`Turma: ${item.column6}`);
        console.log(`Observações: ${item.column12}`); 
        console.log(`ID semestre Atual: ${semestre.id_semestre}`); 
        console.log('---------------------------------------------------------------------------'); */
        if(item.column6 === undefined){
          item.column6 = null
        }
        if(item.column12 === undefined){
          item.column12 = null
        }

        let newAlocacao = {
          observacoes_colegiado: item.column12,
          turma: item.column6,
          disciplina_id_disciplina: disciplina.id_disciplina,
          professor_id_professor: null,
          semestre_id_semestre: semestre.id_semestre
      }
     /*  console.log(newAlocacao);
      console.log('----------------------------------------'); */
      await this.createAlocacao(newAlocacao);
    } else {
      /* Falta verificar a quetsão de área e curso(caso não existam devo criar) */
      let periodo = item.column1;
      if (typeof periodo === 'string') {
        periodo = 100;
      }

      let newDisciplina = {
        periodo: periodo,
        cod: item.column2,
        nome_disciplina: item.column3,
        carga_horaria: (+item.column4),
        qtd_creditos: (+item.column5),
        curso_id_curso: curso.id_curso,
        area_id_area: area.id_area,
      }

      await this.createDisciplina(newDisciplina);

    }

  }
};

  async findArea(item: any) {
  let areaExcel = item.column9.split(' ');
  if (areaExcel.length >= 2) {
    let area = await this._area.getContains(areaExcel[1]);
    if (area.length >= 1) {
      /* console.log(`Area Composta: ${area[0].nome_area}`); */
      return area[0];
    }
  } else {
    let area = await this._area.findByNome(areaExcel[0]);
    if (area.length >= 1) {
      /* console.log(`Area Simples: ${area[0].nome_area}`); */
      return area[0];
    }
  }
}

  async findCurso(item: any) {
  let cursoExcel = item.column8.split(' ');
  if (cursoExcel.length >= 2) {
    let curso = await this._curso.getContains(cursoExcel[1]);
    if (curso.length >= 1) {
      return curso[0];
    }
  } else {
    let curso = await this._curso.findByNome(cursoExcel[0]);
    if (curso.length >= 1) {
      return curso[0];
    }
  }
}

  async findDisciplina(item: any) {
  /* vou buscar pelo código da disciplina */
  let disciplina = await this._disciplina.findOneCod(item.column2);
  if (disciplina == null || disciplina === undefined) {
    return null;
  } else {
    return disciplina;
  }
}

  async findSemestre(item: any){
  let semestre = await this._semestre.findLatest();
  if (semestre == null || semestre === undefined) {
    return null;
  } else {
    return semestre;
  }
}

  async createDisciplina(newDisciplina: Disicplina) {
  try {
    let retorno = await this._disciplina.create(newDisciplina);
    if (!retorno) {
      throw new BadRequestException(`Erro ao tentar criar a disciplina: ${newDisciplina.nome_disciplina}`);
    }
  } catch (error) {
    throw new BadRequestException(`Erro ao tentar criar a disciplina: ${newDisciplina.nome_disciplina}`);
  }
}

  async createAlocacao(newAlocacao: Alocacao) {
    try {
      let retorno = await this._alocacao.create(newAlocacao);
      if (!retorno) {
        throw new BadRequestException(`Erro ao tentar criar a alocacao`);
      }
    } catch (error) {
      throw new BadRequestException(`Erro ao tentar criar a alocacao`);
    }
   }

}
