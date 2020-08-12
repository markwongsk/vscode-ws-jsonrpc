export interface IDecoder {
  decode(data: string): string;
}

export class NoopDecoder implements IDecoder {
  public decode(data: string): string {
    return data;
  }
}
