export interface IEncoder {
  encode(data: string): string;
}

export class NoopEncoder implements IEncoder {
  public encode(data: string): string {
    return data;
  }
}
