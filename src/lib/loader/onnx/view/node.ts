import { ui, type NodeId } from '$lib';
import type { IViewBuilder } from '$lib/ui/builder';
import type { TensorId } from '../common';
import proto from '../proto';
import { convertTensor } from './tensor';
import { toTooltip } from './tooltip';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
function color(op: (typeof proto.onnx.INodeProto)['opType']) {
  const fg = ui.Theme.colors.foreground;
  switch (op) {
    case 'Conv':
      return fg.blue;
    case 'Gather':
    case 'MaxPool':
    case 'SkipSimplifiedLayerNormalization':
      return fg.green;
    case 'Reshape':
      return fg.orange;
    case 'Sigmoid':
    case 'Relu':
      return fg.purple;
    default:
      return 'black';
  }
}

export function convertNode(
  context: Map<TensorId, proto.onnx.TensorProto>,
  id: NodeId,
  node: proto.onnx.INodeProto,
) {
  const sections = [];

  if (node.input) {

    const addInput = (name: string, idx: number) => {
      const i = context.get(node.input?.[idx] as TensorId);
      i && inputs.push(convertTensor(i)(name));
    };

    const inputs: Array<IViewBuilder> = [];
    if (node.opType === 'Conv') {
      addInput('W', 1);
    } else if (node.opType === 'Gemm') {
      addInput('W', 1);
      addInput('b', 2);
    } else if (node.opType === 'Reshape') {
      addInput('data', 0);
      addInput('shape', 1);
    } else if (node.opType === 'MatMulNBits') {
      addInput('B', 1);
      addInput('scales', 2);
    } else if (node.opType === 'Gather') {
      addInput('data', 0);
    } else if (node.opType === 'SkipSimplifiedLayerNormalization') {
      addInput('gamma', 2);
    } else if (node.opType === 'GroupQueryAttention') {
      addInput('cos_cache', 7);
      addInput('sin_cache', 8);
    } else {
      for (const [idx, i] of node.input.entries()) {
        const found = context.get(i as TensorId);
        found && inputs.push(convertTensor(found)(`${idx}-${i}`));
      }
    }

    if (inputs.length > 0) {
      sections.push(new ui.VStack(...inputs).with({ spacing: 4 }));
    }
  }

  return new ui.Node(
    id,
    new ui.HStack(
      new ui.Text(node.opType || 'Unknown Op').with({
        fontWeight: 500,
        foregroundColor: color(node.opType),
      }),
      new ui.Text(id).with({ foregroundColor: ui.Theme.colors.foreground.grayTertiary }),
    ).with({ spread: true, spacing: 8 }),
    ...sections,
  ).with({ tooltip: () => toTooltip(node) });
}
