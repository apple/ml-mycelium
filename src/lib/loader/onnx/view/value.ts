import { ui, type NodeId } from '$lib';
import { dataTypeToString } from '../common';
import proto from '../proto';

export function convertValueInfo(
  type: 'Input' | 'Output',
  id: NodeId,
  input: proto.onnx.IValueInfoProto,
) {

  const dims = input.type?.tensorType?.shape?.dim || [];

  return new ui.Node(
    id,
    new ui.VStack(new ui.Text(type).with({ fontWeight: 500 })).with({
      spacing: 8,
    }),
    new ui.HStack(
      new ui.Text(dataTypeToString(input.type?.tensorType?.elemType as number)),
      new ui.Text(
        `<${(dims).map((d) => (d.dimValue as number) || 0).join('x')}>`,
      ),
    ).with({ spacing: 4 }),
  )
    .with({ borderDash: 4 })
    .with({ tooltip: () => new ui.Tooltip(new ui.Text(input.name || 'none')) });
}
