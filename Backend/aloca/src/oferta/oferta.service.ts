import { Injectable, BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { unlink, writeFile } from 'fs/promises';
import { AreaService } from 'src/area/area.service';
import { CursoService } from 'src/curso/curso.service';
import { DisciplinaService } from 'src/disciplina/disciplina.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TurmaService } from 'src/turma/turma.service';

//Interface Disicplina
interface Disicplina {
  periodo: number;
	cod: string;
	nome_disciplina: string;
	carga_horaria: number;
	qtd_creditos: number;
	curso_id_curso: number;
	area_id_area: number;
	turma_id_turma: number;
}

@Injectable()
export class OfertaService {
  constructor(
    private readonly _disciplina: DisciplinaService,
    private readonly _prisma: PrismaService,
    private readonly _area: AreaService,
    private readonly _curso: CursoService,
    private readonly _turma: TurmaService

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
    console.log(`Tamanho de data ${data.length}`);
    for (let i = 1; i < data.length; i++) {
      const item = data[i];
      /* 
        1° Verificar se curso/area existem -> OK
        2° Verificar a existência da disciplina -> OK

        OBS: Alterar o meu banco de dados -> Disciplina pode ter
           várias turmas -> OK

        Verificar se não existe alocação repetida (alocação com o mesma turma para a mesma disciplina)

        Não exigir que uma turma seja obrigatorio para criar uma nova
         disciplina

        OBS: Usar trim()  para remover espçaos em branco no incio/fim
           de uma string
       */
      let turma = await this.findTurma(item);
      let area = await this.findArea(item);
      let curso = await this.findCurso(item);
      let disciplina = await this.findDisciplina(item);

      if(turma && area && curso && disciplina){
        console.log(`A disciplina: ${disciplina.nome_disciplina} deve ser inserida em alocaocao`);
      }else{
        console.log(`A disciplina ainda nao: ${item.column3} deve ser inserida em alocaocao`);
        console.log('Motivos:');
        if(!turma){console.log('Turma não encontrada');}
        if(!area){console.log('Area não encontrada');}
        if(!curso){console.log('Curso não encontrada');}
        if(!disciplina){console.log('Disciplina não encontrada');}
        console.log('-----------------------------------------------');
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

  async findTurma(item: any){ 
    return await this._turma.findOneName(item.column6);
  }

  async saveAlocacao(){}
  async createDisciplina(){}
}
