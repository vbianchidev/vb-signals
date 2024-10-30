import { HttpResponseCode } from "../enums/http-response-code.enum";

export interface HttpResponse<T> {
    responseCode: HttpResponseCode;
    responseMessage: string;
    numeroExcucao?: number;
    content: T;
}