import type { Brand } from "$lib/brand";

export type TensorId = Brand<'TensorId', string>;

export function dataTypeToString(dataType: number): string {
  switch (dataType) {
    case 0:
      return 'Undefined';
    case 1:
      return 'Float';
    case 2:
      return 'UInt8';
    case 3:
      return 'Int8';
    case 4:
      return 'UInt16';
    case 5:
      return 'Int16';
    case 6:
      return 'Int32';
    case 7:
      return 'Int64';
    case 8:
      return 'String';
    case 9:
      return 'Bool';
    case 10:
      return 'Float16';
    case 11:
      return 'Double';
    case 12:
      return 'UInt32';
    case 13:
      return 'UInt64';
    case 14:
      return 'Complex64';
    case 15:
      return 'Complex128';
    case 16:
      return 'BFloat16';
    case 17:
      return 'Float8E4M3FN';
    case 18:
      return 'Float8E4M3FNUZ';
    case 19:
      return 'Float8E5M2';
    case 20:
      return 'Float8E5M2FNUZ';
    case 21:
      return 'UInt4';
    case 22:
      return 'Int4';
    default:
      return `Unknown ${dataType}`;
  }
}
