import { ApiProperty } from '@nestjs/swagger';

export class CountryDto {
  @ApiProperty({ example: '1', description: 'Identificador único do país' })
  countryKey: string;

  @ApiProperty({ example: 'USA', description: 'Nome do país' })
  name: string;

  @ApiProperty({
    example: 'https://example.com/usa.png',
    description: 'URL do logo do país',
    nullable: true,
  })
  logo: string | null;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1, description: 'Total de itens' })
  total: number;

  @ApiProperty({ example: 1, description: 'Página atual' })
  page: number;

  @ApiProperty({ example: 10, description: 'Itens por página' })
  limit: number;

  @ApiProperty({ example: 1, description: 'Total de páginas' })
  totalPages: number;
}

export class CountryListResponseDto {
  @ApiProperty({ type: [CountryDto], description: 'Lista de países' })
  data: CountryDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class SyncResponseDto {
  @ApiProperty({
    example: 'Countries synced successfully',
    description: 'Mensagem de sucesso',
  })
  message: string;

  @ApiProperty({ example: 52, description: 'Número de itens sincronizados' })
  synced: number;
}
