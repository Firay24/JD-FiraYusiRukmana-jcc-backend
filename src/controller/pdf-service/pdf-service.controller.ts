import { Controller, Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { PDFDocument } from 'pdf-lib';
import { PrismaService } from 'src/services/prisma.service';
import * as pdfParse from 'pdf-parse';
import * as path from 'path';

@Injectable()
@Controller('pdf-service')
export class PdfServiceController {
  constructor(private prismaService: PrismaService) {}

  async processPdf(filePath: string) {
    const pdfBuffer = await readFile(filePath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const numPages = pdfDoc.getPageCount();

    for (let i = 0; i < numPages; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);

      const newPdfBytes = await newPdf.save();
      const newFilePath = path.join(__dirname, `../../students_pdfs/page-${i + 1}.pdf`);
      await writeFile(newFilePath, newPdfBytes);

      // Ekstrak teks untuk mendapatkan ID Student
      const extractedText = await pdfParse(newPdfBytes);
      const studentId = this.extractStudentId(extractedText.text);
      // const studentName = this.extractStudentName(extractedText.text);

      if (studentId) {
        await this.updateStudentPath(studentId, newFilePath);
      }
    }
  }

  private extractStudentId(text: string): string | null {
    const match = text.match(/ZipGrade ID:\s*(\d+)/);
    return match ? match[1] : null;
  }

  private extractStudentName(text: string): string | null {
    const match = text.match(/Name:\s*([\w\s]+)/);
    return match ? match[1].trim() : null;
  }

  private async updateStudentPath(studentId: string, filePath: string) {
    await this.prismaService.competitionParticipant.update({
      where: { Id: studentId },
      data: { PathAnswer: filePath },
    });
  }
}
