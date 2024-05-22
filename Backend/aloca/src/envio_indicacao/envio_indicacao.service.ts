import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';
import { unlink, writeFile } from 'fs/promises';
import { ProfessorService } from 'src/professor/professor.service';
import { AreaService } from 'src/area/area.service';
import { DisciplinaService } from 'src/disciplina/disciplina.service';
import { AlocacaoService } from 'src/alocacao/alocacao.service';
import { OfertaService } from 'src/oferta/oferta.service';
import { SemestreService } from 'src/semestre/semestre.service';
import { CursoService } from 'src/curso/curso.service';
import { throwError } from 'rxjs';

interface Alocacao {
  oferta_id_oferta: number;
  professor_id_professor: number;
}

interface Erro {
  linha: number,
  mensagem: string,
  valor_celular: string | number | null | undefined,
  tipo_esperado: string,
  detalhe: string | null
}

interface Professor {
  nomeProfessor: string;
  observacoes?: string | null;
  area_id_area: number;
}

@Injectable()
export class EnvioIndicacaoService {

  constructor(
    private readonly _disciplina: DisciplinaService,
    private readonly _area: AreaService,
    private readonly _professor: ProfessorService,
    private readonly _alocacao: AlocacaoService,
    private readonly _oferta: OfertaService,
    private readonly _semestre: SemestreService,
    private readonly _curso: CursoService
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
    const extension = file.originalname.split('.').pop();
    let workbook;

    if (extension === 'xlsx') {
      workbook = new ExcelJS.Workbook();
      try {
        await workbook.xlsx.readFile(path);
      } catch (error) {
        throw new BadRequestException('Erro ao ler o arquivo Excel: ' + error.message);
      }
    } else if (extension === 'xls') {
      try {
        const buffer = await fs.readFile(path);
        const xlsWorkbook = XLSX.read(buffer, { type: 'buffer' });
        workbook = new ExcelJS.Workbook();
        const sheetData = XLSX.utils.sheet_to_json(xlsWorkbook.Sheets[xlsWorkbook.SheetNames[0]], { header: 1 });

        const sheet = workbook.addWorksheet('Sheet1');
        sheetData.forEach((row: any[]) => {
          sheet.addRow(row);
        });
      } catch (error) {
        throw new BadRequestException('Erro ao ler o arquivo Excel: ' + error.message);
      }
    } else {
      throw new BadRequestException('Formato de arquivo não suportado');
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

    /* console.log(data); */
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
    /* Verificar a estrutura da tabela */
    let erros = [];

    for (let i = 1; i < data.length; i++) {
      const item = data[i];
      /* console.log(`COD: ${item.column1}`);
      console.log(`Disciplina: ${item.column2}`);
      console.log(`Carga: ${item.column3}`);
      console.log(`Créditos: ${item.column4}`);
      console.log(`Turma: ${item.column5}`);
      console.log(`Tipo curso: ${item.column6}`);
      console.log(`Curso: ${item.column7}`);
      console.log(`Professor: ${item.column8}`);
      console.log(`Area: ${item.column9}`);
      console.log(`Formandos: ${item.column10}`);
      console.log(`Obs: ${item.column11}`);
      console.log(`---------------------------------`); */
      console.log(`Paseei aqi nalinha: ${(i + 1)}`);
      /* Preciso tratar tbm linhas apenas com dados como total de créditos */
      if ((item.column1 === undefined || typeof item.column1 === 'object') && (item.column2 === undefined || typeof item.column2 === 'object')) {
        continue;
      }
      /* Verificar se a coluna curso é undefined ou null */
      if (item.column5 === undefined) {
        item.column5 = "SEM TURMA"
      }
      if (typeof item.column5 === 'number') {
        item.column5 = item.column5.toString();
      }
      /* Remove espaços caso haja no código */
      if (item.column1.includes(' ')) {
        item.column1 = item.column1.split(' ').join('');
      }


      let area = await this.findArea(item);
      if (area) {
        console.log(`Area existe: ${item.column2} turma: ${item.column5}`);
      }
      let curso = await this.findCurso(item);
      if (curso) {
        console.log(`Curso existe: ${item.column2} turma: ${item.column5}`);
      }
      let professor = await this.findProfessor(item);
      if (professor) {
        console.log(`Professor existe: ${item.column2} turma: ${item.column5}`);
      }
      let oferta = await this.findOferta(item);
      if (oferta) {
        console.log(`Oferta existe: ${item.column2} turma: ${item.column5}`);
      } else {
        console.log(`Linha: ${(i + 1)} Oferta Não existe: ${item.column2} turma: ${item.column5}`);
        let linha = i;
        let newErro: Erro = {
          linha: linha + 1,
          mensagem: "Ainda não existe oferta de disicplina para esse curso",
          valor_celular: "undefined",
          tipo_esperado: "Disciplina",
          detalhe: "Por favor, forneça um valor"
        }
        erros.push(newErro);
        continue;
      }
      /* let disciplina = await this.findDisciplina(item, curso.id_curso);
      if (disciplina) {
        console.log(`Disciplina existe: ${item.column2} turma: ${item.column5}`);
      }else{
        console.log(`Disciplina Não existe: ${item.column2} turma: ${item.column5}`);
        let linha = i;
        let newErro: Erro = {
          linha: linha + 1,
          mensagem: "Ainda não existe oferta de disicplina para esse curso",
          valor_celular: "undefined",
          tipo_esperado: "Disciplina",
          detalhe: "Por favor, forneça um valor"
        }
        erros.push(newErro);
        continue;
      } */
      console.log('----------------------------------------------')

      if (professor && oferta) {
        /*  console.log(`Professor: ${professor.nome_professor} | ID OFERTA: ${oferta.id_oferta}} | TURMA: ${oferta.turma}`); */
        let newAlocacao = {
          oferta_id_oferta: oferta.id_oferta,
          professor_id_professor: professor.id_professor
        }
        try {
          await this.createAlocacao(newAlocacao, item.column5.trim());
        } catch (error) {
          console.log(error);
          throw new BadRequestException("Erro ao criar alocacao");
        }
      } else {
        /* Se o professor não existir vou criar o professor! */
        let newProfessor = {
          nomeProfessor: item.column8.trim().toUpperCase(),
          area_id_area: area.id_area,
        }
        let professor = await this.createProfessor(newProfessor);

        /*  if(!oferta){continue;} */
        /* Agora eu crio a alocação! */
        let newAlocacao = {
          oferta_id_oferta: oferta.id_oferta,
          professor_id_professor: professor.id_professor
        }

        await this.createAlocacao(newAlocacao, item.column5.trim());
      }
    }
    console.log("------ ERROS ----------");
    console.log(erros);
  }

  async createAlocacao(newAlocacao: Alocacao, turma: string) {
    try {
      /* console.log(newAlocacao); */
      return this._alocacao.create(newAlocacao, turma);
    } catch (error) {

      throw new BadRequestException(`Erro ao tentar criar alocacao (Envio Service)`);
    }
  }

  async createProfessor(newProfessor: Professor) {
    //console.log(newProfessor);
    try {
      let retorno = await this._professor.create(newProfessor);
      /* if (!retorno) {
        throw new BadRequestException(`Erro ao tentar criar o professor: ${newProfessor.nomeProfessor}`);
      } */
      return retorno;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(`Erro ao tentar criar o professor: ${newProfessor.nomeProfessor}`);
    }
  }

  async findArea(item: any) {
    let areaExcel = item.column9.split(' ');
    let tam = areaExcel.length;
    if (areaExcel.length >= 2) {
      let area = await this._area.getContains(areaExcel[tam - 1]);
      if (area.length >= 1) {
        return area[0];
      }
    } else {
      let area = await this._area.findByNome(areaExcel[0]);
      if (area.length >= 1) {
        return area[0];
      }
    }
  }

  async findProfessor(item: any) {
    if (item.column8 === undefined || item.column8 === null || item.column8.length < 5) {
      item.column8 = "SEM INDICAÇÃO";
    }
    let retorno = await this._professor.findByName(item.column8.trim());
    if (retorno === null || retorno === undefined) {
      return null;
    }
    return retorno;
  }

  async findOferta(item: any) {
    /* Verificar se a turma é undefined ou null */
    if (item.column5 === undefined) {
      item.column5 = "SEM TURMA"
    }

    if (typeof item.column5 === 'number') {
      item.column5 = item.column5.toString();
    }
    let disciplina = item.column2.trim();
    let turma = item.column5.trim();
    let retorno = await this._oferta.findByDisciplinaAndTurma(disciplina, turma);
    if (retorno === null || retorno === undefined) {
      return null;
    }
    return retorno;
  }

  async findDisciplina(item: any, id_curso: number) {
    try {
      let retorno = await this._disciplina.findOneCodAndCurso(item.column1, item.colum2, id_curso);
      /* console.log(retorno) */
      if (retorno === null || retorno === undefined) {
        return null;
      }
      return retorno;
    } catch (error) {
      console.log(error);
    }

  }

  async finOneSemestre(id_semestre: number) {
    return this._semestre.findOne(id_semestre);
  }

  async findOneCurso(id_colegiado: number) {
    return this._curso.findOne(id_colegiado);
  }

  async findCurso(item: any) {
    let cursoExcel = item.column7.split(' ');
    let tam = cursoExcel.length;
    if (cursoExcel.length >= 2) {
      let curso = await this._curso.getContains(cursoExcel[tam - 1]);
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

  async download(id_colegiado: number, id_semestre: number) {
    const colegiado = await this._curso.findOne(id_colegiado);
    const semestre = await this._semestre.findOne(id_semestre);
    const alocacoes = await this._alocacao.findByColegiado(id_colegiado);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Indicação ${semestre.nome_semestre}`);

    /* Adicionar cabeçalhos na minha tabela */
    let headers = [
      { header: 'CÓD', key: 'id', width: 10 },
      { header: 'DISCIPLINA', key: 'disciplina', width: 50 },
      { header: 'CH', key: 'ch', width: 10 },
      { header: 'CHs', key: 'chs', width: 10 },
      { header: 'TURMA', key: 'turma', width: 10 },
      { header: 'B ou L', key: 'boul', width: 20 },
      { header: 'CURSO', key: 'curso', width: 30 },
      { header: 'PROFESSOR', key: 'professor', width: 60 },
      { header: 'ÁREA', key: 'area', width: 30 },
      { header: 'FORMANDOS', key: 'formandos', width: 30 },
      { header: 'OBSERVAÇÕES', key: 'obs', width: 70 },
    ];

    worksheet.columns = headers;

    /* Aplicando estilo */
    worksheet.getRow(1).eachCell((cell) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Cor da fonte branca
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0000FF' } // Cor de fundo azul
      };
    });

    alocacoes.forEach(alocacao => {
      /* console.log(`COD: ${alocacao.oferta.disciplina.cod}`);
      console.log(`DISCIPLINA: ${alocacao.oferta.disciplina.nome_disciplina}`);
      console.log(`CH: ${alocacao.oferta.disciplina.carga_horaria}`);
      console.log(`CHs: ${alocacao.oferta.disciplina.carga_horaria}`);
      console.log(`TURMA: ${alocacao.oferta.turma}`);
      console.log(`B ou L: ${alocacao.oferta.disciplina.curso.tipo_curso}`);
      console.log(`CURSO: ${alocacao.oferta.disciplina.curso.nome_curso}`);
      console.log(`PROFESSOR: ${alocacao.professor.nome_professor}`);
      console.log(`AREA: ${alocacao.oferta.area.nome_area}`);
      console.log(`FORMANDOS: ${alocacao.oferta.formandos}`);
      console.log(`OBS: ${alocacao.oferta.obs_colegiado}`);
      console.log("--------------------------------------------------"); */

      worksheet.addRow({
        id: alocacao.oferta.disciplina.cod,
        disciplina: alocacao.oferta.disciplina.nome_disciplina,
        ch: alocacao.oferta.disciplina.carga_horaria,
        chs: alocacao.oferta.disciplina.qtd_creditos,
        turma: alocacao.oferta.turma,
        boul: alocacao.oferta.disciplina.curso.tipo_curso,
        curso: alocacao.oferta.disciplina.curso.nome_curso,
        professor: alocacao.professor.nome_professor,
        area: alocacao.oferta.area.nome_area,
        formandos: alocacao.oferta.formandos,
        obs: alocacao.oferta.obs_colegiado,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

}
