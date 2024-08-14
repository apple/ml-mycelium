import { Network, type NodeId } from '$lib/network';
import proto from './proto';
import { ui } from '$lib';
import type { Long } from 'protobufjs';
import { convertNode } from './view/node';
import { convertValueInfo } from './view/value';
import type { TensorId } from './common';

type GraphOptions = {
  virtualGrouping: { threshold: number; nodesPerModule: number } | false;
  simplify: { threshold: number } | false;
};

const MAX_MODULE_DEPTH = 2;

type Tensor = {
  id: TensorId;
  dims: string;
};

export function createNetworkModel(onnxFile: Uint8Array, options?: Partial<GraphOptions>): Network {
  const opts: GraphOptions = {
    virtualGrouping: { threshold: 1500, nodesPerModule: 300 },
    simplify: { threshold: 200 },
    ...options,
  };

  const model = proto.onnx.ModelProto.decode(onnxFile);

  if (!model.graph) throw new Error('onnx file does not contain graph information');
  if (!model.graph.node) throw new Error('onnx file does not contain nodes');

  const simplify = opts.simplify && model.graph.node.length > opts.simplify.threshold;
  simplify &&
    console.info(
      `More than ${model.graph.node.length} nodes; creating a simplified representation.`,
    );

  const network = new Network();
  // If models get too large they can slow Mycelium quite a bit, so we reduce the complexity of the scene.
  // TODO: const isLargeModel = opts.simplify && model.graph.node.length >= opts.simplify.threshold;

  const tensorToNode = new Map<TensorId, NodeId>();
  const moduleSet = new Set<string>();
  const tensorToInfo = new Map<TensorId, Tensor>();
  const tensorIdToTensor = new Map<TensorId, proto.onnx.TensorProto>();

  if (!model.graph.initializer) throw new Error('graph does not have initializer information');

  for (const tensor of model.graph.initializer) {
    if (!tensor.name) throw new Error('tensor does not have a name');
    const dims =
      tensor.dims?.map((d: Long) => {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        return d.toString();
      }) || [];

    tensorToInfo.set(tensor.name as TensorId, {
      id: tensor.name as TensorId,
      dims: dims.join('x'),
    });

    const id = tensor.name as TensorId;
    tensorIdToTensor.set(id, tensor as proto.onnx.TensorProto);
  }

  model.graph.node.forEach((node, idx) => {
    if (!node.opType) throw new Error('node does not have type');
    if (!node.output) throw new Error('node does not have output');

    const path = (node.name || '').split('/');
    path.pop(); // Ensure that we don't add leave nodes to module list.
    const module = path.slice(0, MAX_MODULE_DEPTH + 1).join('/');
    module !== '' && moduleSet.add(module);

    const nodeId = idx.toString() as NodeId;
    // const content = layerExtractor(nodeId, node, simplify, tensorToInfo);

    network.setNode(nodeId, convertNode(tensorIdToTensor, nodeId, node));

    switch (node.opType) {
      // case 'Constant':
      //   break;
      case 'Reshape':
      case 'Conv':
        tensorToNode.set(node.output[0] as TensorId, nodeId);
        break;
      default:
        for (const o of node.output) {
          o !== '' && tensorToNode.set(o as TensorId, nodeId);
        }
        break;
    }
  });

  if (!model.graph.input) throw new Error('graph does not have inputs');
  if (!model.graph.output) throw new Error('graph does not have outputs');

  const inits = new Set(model.graph.initializer.map((i) => i.name));
  for (const i of model.graph.input) {
    if (!inits.has(i.name)) {
      const vNodeId = `[vnode]${i.name}` as NodeId;
      const drawable = convertValueInfo('Input', vNodeId, i);
      network.setNode(vNodeId, drawable);
      tensorToNode.set(i.name as TensorId, vNodeId);
    }
  }

  model.graph.output.forEach((output) => {
    const vNodeId = `[vnode]${output.name}` as NodeId;
    const drawable = convertValueInfo('Output', vNodeId, output);
    network.setNode(vNodeId, drawable);
    const input = tensorToNode.get(output.name as TensorId);
    input && network.setEdge(input, vNodeId);
  });

  model.graph.node.forEach((node, idx) => {
    const nodeId = idx.toString() as NodeId;
    if (!node.input) throw new Error('node does not have input');
    if (node.opType === 'Conv') {
      const input = tensorToNode.get(node.input[0] as TensorId);
      if (input) {
        network.setEdge(input, nodeId);
      }
    } else if (node.opType === 'Reshape') {
      // This is the fallthrough case for nodes that don't have any inputs.
    } else {
      for (const i of node.input) {
        const input = tensorToNode.get(i as TensorId);
        if (input) {
          network.setEdge(input, nodeId);
        }
      }
    }
  });

  // TODO: The following is in O(n^2) and can certainly be improved.
  for (const m of moduleSet) {
    const moduleId = m as NodeId;
    network.setNode(
      moduleId,
      new ui.Node(
        moduleId,
        new ui.VStack(new ui.Text('Module').with({ fontWeight: 500 }), new ui.Text(moduleId)).with({
          spacing: 8,
        }),
      ).with({
        backgroundColor: ui.Theme.colors.background.gray,
        badge: { color: '#8e8e8e', text: '+' },
      }),
    );

    model.graph.node.forEach((node, idx) => {
      if (node.name?.includes(m)) {
        network.setParent(idx.toString() as NodeId, m);
      }
    });
  }

  // We remove modules that have only a single child.
  for (const node of network.nodes()) {
    if (network.childrenT(node).length === 1) {
      network.removeNode(node);
    }
  }

  return network;
}
