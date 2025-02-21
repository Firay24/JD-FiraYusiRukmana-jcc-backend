import { Test, TestingModule } from '@nestjs/testing';
import { PdfServiceController } from './pdf-service.controller';

describe('PdfServiceController', () => {
  let controller: PdfServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfServiceController],
    }).compile();

    controller = module.get<PdfServiceController>(PdfServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
