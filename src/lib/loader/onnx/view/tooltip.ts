import { ui } from '$lib';
import proto from '../proto';

export function toTooltip(node: proto.onnx.INodeProto) {
  const contents = [
    new ui.VStack(
      new ui.Text('Name').with({ fontWeight: 500 }),
      new ui.Text(node.name || 'none'),
    ).with({ spacing: 8 }),
  ];

  if (node.input) {
    contents.push(
      new ui.VStack(
        new ui.Text('Inputs').with({ fontWeight: 500 }),
        ...node.input.map((i) => new ui.Text(i)),
      ).with({ spacing: 8 }),
    );
  }
  if (node.output) {
    contents.push(
      new ui.VStack(
        new ui.Text('Outputs').with({ fontWeight: 500 }),
        ...node.output.map((i) => new ui.Text(i)),
      ).with({ spacing: 8 }),
    );
  }

  return new ui.Tooltip(new ui.VStack(...contents).with({ spacing: 8 }));
}
