
export function success(statusCode: number, message: string, data?: Record<string, any> | null) {
    const responseObj: Record<string, any> = {
        statusCode,
        message,
        data
    };
    return responseObj;
}

export function error(statusCode: number, errorCode: string, message: string) {
    return {
        statusCode,
        errorCode,
        message,
    };
}

export function paginationResponse(
    statusCode: number,
    data: any,
    pagination: {
      itemsInPage: number;
      totalCount: number;
      page: number;
      totalPages: number;
    },
  ) {
    return { statusCode, data, pagination };
  }