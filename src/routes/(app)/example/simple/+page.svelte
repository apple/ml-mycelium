<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import Viewer from '../../_components/Viewer.svelte';

  import * as myc from '$lib';

  // We define a set of nodes.
  const [a, b, c, d, e, f] = ['a', 'b', 'c', 'd', 'e', 'f'] as Array<myc.NodeId>;

  // And a set of modules.
  const [m, n] = ['m', 'n'] as Array<myc.NodeId>;

  // The following are helper functions that create the views for each node.
  function createNode(nodeId: myc.NodeId): myc.ui.Node {
    return new myc.ui.Node(
      nodeId,
      new myc.ui.VStack(new myc.ui.Text('Node').with({ fontWeight: 600 }), new myc.ui.Text(nodeId)),
    ).with({ selectable: true, ...(nodeId === b && { badge: { color: 'red', text: 'i' } }) });
  }

  function createModule(nodeId: myc.NodeId): myc.ui.Node {
    return new myc.ui.Node(
      nodeId,
      new myc.ui.VStack(
        new myc.ui.Text('Module').with({ fontWeight: 600 }),
        new myc.ui.Text(nodeId),
      ),
    ).with({ backgroundColor: myc.ui.Theme.colors.background.gray });
  }

  const network = new myc.Network();
  network.setNode(n, createModule(n));
  network.setNodeWithParent(m, createModule(m), n);
  network.setNode(a, createNode(a));
  network.setNodeWithParent(b, createNode(b), n);
  network.setNodeWithParent(c, createNode(c), m);
  network.setNodeWithParent(d, createNode(d), m);
  network.setNode(e, createNode(e));
  network.setNode(f, createNode(f));
  network.setEdge(a, b);
  network.setEdge(b, c);
  network.setEdge(b, d);
  network.setEdge(c, d);
  network.setEdge(d, e);
  network.setEdge(d, f);

  function handleCreated({ detail: { viewer } }: CustomEvent<{ viewer: myc.NetworkViewer }>) {
    viewer.setDecoration(a, {
      backgroundColor: 'rgb(237,249,239)',
      borderColor: 'rgb(113,201,117)',
    });

    viewer.setDecoration(f, {
      backgroundColor: 'rgb(252,236,235)',
      borderColor: 'rgb(239,90,88)',
    });
  }
</script>

<Viewer title="Simple Network • Example" {network} on:created={handleCreated} />
