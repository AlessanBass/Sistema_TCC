import { Injectable, BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { writeFile } from 'fs/promises';

@Injectable()
export class OfertaService {

  upload(file: Express.Multer.File, path: string): boolean {
    try {
      writeFile(path, file.buffer);
      return true;
    } catch (e) {
      throw new BadRequestException("Erro ao salvar arquivo"); 
    }
  }

  async readExecel(file: Express.Multer.File, path: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path);

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

    // Agora 'data' contém todos os dados da planilha
    /* console.log(data.column2); */
    data.forEach(item => {
      if(item.column1 === undefined || item.column1 === 0){
        /* console.log("Não tem professor"); */
      } else {
        console.log(item);
      }
    });
 
  }


  /* create(createOfertaDto: CreateOfertaDto) {
    return 'Acessei aqui na rota';
  }

  findAll() {
    return `This action returns all oferta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} oferta`;
  }

  update(id: number, updateOfertaDto: UpdateOfertaDto) {
    return `This action updates a #${id} oferta`;
  }

  remove(id: number) {
    return `This action removes a #${id} oferta`;
  } */
}
