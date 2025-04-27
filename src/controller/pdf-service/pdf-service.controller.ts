import { Controller, Injectable } from '@nestjs/common';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { PDFDocument } from 'pdf-lib';
import { PrismaService } from 'src/services/prisma.service';
import * as pdfParse from 'pdf-parse';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
@Controller('pdf-service')
export class PdfServiceController {
  constructor(private prismaService: PrismaService) {}

  async processPdf(filePath: string, competitionId: string) {
    const competition = await this.prismaService.competition.findUnique({
      where: { Id: competitionId },
      include: { Region: true, Season: true, Subject: true },
    });

    if (!competition) {
      throw new Error(`Competition dengan ID ${competitionId} tidak ditemukan.`);
    }

    // Buat nama folder berdasarkan subject-stage-level
    const folderName = `S${competition.Season.Name}-R${competition.Region.Region}-${competition.Subject.Name}-${competition.Stage}-${competition.Level}`;
    const competitionFolder = path.join(process.cwd(), 'students_pdfs', folderName);

    // Buat folder jika belum ada
    if (!fs.existsSync(competitionFolder)) {
      await mkdir(competitionFolder, { recursive: true });
    }

    // Simpan file upload di dalam folder baru
    const uploadedFilePath = path.join(competitionFolder, path.basename(filePath));
    await fs.promises.rename(filePath, uploadedFilePath);

    // Baca file upload untuk proses split
    const pdfBuffer = await readFile(uploadedFilePath);
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const numPages = pdfDoc.getPageCount();

    for (let i = 0; i < numPages; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);

      const newPdfBytes = await newPdf.save();
      // Ekstrak teks untuk mendapatkan ID Student
      const extractedText = await pdfParse(newPdfBytes);
      const studentId = this.extractStudentId(extractedText.text) || `unknown-${i + 1}`;
      const pointsEarned = this.extractPointsEarned(extractedText.text);

      const newFilePath = path.join(competitionFolder, `${studentId}.pdf`);
      await writeFile(newFilePath, newPdfBytes);

      // const studentName = this.extractStudentName(extractedText.text);

      if (studentId !== `unknown-${i + 1}`) {
        await this.updateStudentPath(studentId, competitionId, newFilePath, pointsEarned);
      }
    }
  }

  private extractStudentId(text: string): string | null {
    const match = text.match(/ZipGrade ID:\s*(\d+)/);
    return match ? match[1] : null;
  }

  private extractPointsEarned(text: string): number | null {
    const match = text.match(/Points Earned:\s*(-?\d+)/i);
    return match ? parseInt(match[1], 10) : null;
  }

  private async updateStudentPath(studentId: string, competitionId: string, filePath: string, pointsEarned: number) {
    const student = await this.prismaService.student.findFirst({
      where: { IdMember: studentId },
    });

    if (!student) {
      console.log(`Student dengan IdMember ${studentId} tidak ditemukan.`);
      return;
    }

    const relativePath = path.relative(path.join(process.cwd(), 'students_pdfs'), filePath);

    await this.prismaService.competitionParticipant.updateMany({
      where: {
        StudentId: student.Id,
        CompetitionId: competitionId,
      },
      data: {
        PathAnswer: relativePath,
        Score: pointsEarned ? pointsEarned : 0,
      },
    });
  }
}
