import { STATUS_CODE } from "../utils/statusCode";
import { REASON_STATUS_CODE } from "../utils/reasonStatusCode";

class SuccessResponse {
  statusCode: number;
  data: any;
  message: string;
  constructor(
    statusCode: number = STATUS_CODE.OK,
    message: string = REASON_STATUS_CODE.OK,
    data: any = {}
  ) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
  }
  send(res: any) {
    res.status(this.statusCode).json(this);
  }
}

export class OK extends SuccessResponse {
  constructor(
    statusCode: number = STATUS_CODE.OK,
    message: string = REASON_STATUS_CODE.OK,
    data: any = {}
  ) {
    super(statusCode, message, data);
  }
}

export class Created extends SuccessResponse {
  constructor(
    statusCode: number = STATUS_CODE.CREATED,
    message: string = REASON_STATUS_CODE.CREATED,
    data: any = {}
  ) {
    super(statusCode, message, data);
  }
}
