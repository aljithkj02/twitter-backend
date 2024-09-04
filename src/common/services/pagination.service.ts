import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  getPaginationQuery(page: number, limit: number) {
    const offset = (page - 1) * limit;
    return `LIMIT ${limit} OFFSET ${offset};`;
  }

  createPaginationResponse(page: number, limit: number, totalCount: number) {
    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      totalPages,
      currentPage: page,
      totalCount,
    };

    return response;
  }
}
