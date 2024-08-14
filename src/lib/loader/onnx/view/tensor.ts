import { ui } from '$lib';
import { dataTypeToString } from '../common';
import proto from '../proto';
import type { Long } from 'protobufjs';

export function convertTensor(tensor: proto.onnx.TensorProto) {
  const dims = tensor.dims.map((d: Long) => {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return d.toString();
  });
  return (name: string) =>
    new ui.VStack(
      new ui.HStack(
        new ui.Text(`${name || tensor.name}:`),
        new ui.HStack(
          new ui.Text(dataTypeToString(tensor.dataType)),
          new ui.Text(`<${dims.join('x')}>`),
        ).with({ spacing: 4 }),
      ).with({ spacing: 4, spread: true }),
    ).with({ spacing: 4 });
}
