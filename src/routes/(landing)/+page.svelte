<!--
  For licensing see accompanying LICENSE file.
  Copyright (C) 2024 Apple Inc. All Rights Reserved.
-->

<script lang="ts">
  import { base } from '$app/paths';
  import 'prism-themes/themes/prism-one-light.css';

  import { Bolt, Link, AdjustmentsHorizontal, CubeTransparent } from '@steeze-ui/heroicons';

  import * as myc from '$lib';

  // In your application it's also essential to import our provided stylesheet.
  // This means adding the following line to the appropriate part of your code.
  // import "@apple/mycelium/dist/style.css"

  import { onMount } from 'svelte';

  import Citation from './_components/Citation.mdx';
  import Feature from './_components/Feature.svelte';
  import Person from './_components/Person.svelte';
  import Section from './_components/Section.svelte';

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

  let app: HTMLElement;
  let viewer: myc.NetworkViewer;

  onMount(() => {
    viewer = myc.NetworkViewer.create(network, app, {
      showBreadcrumbs: true,
      showResetView: true,
      minimap: false,
      watermark: false,
    });
  });

  async function animate(viewer: myc.NetworkViewer) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (viewer !== undefined) {
      await viewer.setSelection(d, { shouldExpand: true });

      viewer.setDecoration(a, {
        backgroundColor: 'rgb(237,249,239)',
        borderColor: 'rgb(113,201,117)',
      });

      viewer.setDecoration(f, {
        backgroundColor: 'rgb(252,236,235)',
        borderColor: 'rgb(239,90,88)',
      });
    }
  }
  $: animate(viewer).catch((e: unknown) => {
    console.error(e);
  });
</script>

<svelte:head>
  <title>Mycelium • Graph visualization library</title>
</svelte:head>

<div class="py-24 sm:py-32 lg:pb-40">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div
      class="mb-8 mx-auto text-sm border rounded-lg px-2 py-1 max-w-fit text-violet-800 bg-violet-50 border-violet-600"
    >
      Drag an <i>.onnx</i> file anywhere on this page to quickly visualize it.
    </div>
    <div class="mx-auto max-w-2xl text-center">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Visualize <span class="border-b-2 border-blue-500">your</span> machine learning model
      </h1>
      <p class="mt-6 text-lg leading-8 text-gray-600">
        Mycelium is a library for creating graph visualizations of machine learning models or any
        other directed acyclic graphs. It also powers the graph viewer of the Talaria model
        visualization and optimization system.
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="{base}/getting-started"
          class="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >Get started</a
        >
        <a
          href="https://machinelearning.apple.com/research/talaria"
          class="text-sm font-semibold leading-6 text-gray-900"
          >Learn more about Talaria<span aria-hidden="true">→</span></a
        >
      </div>
    </div>
    <div class="mt-16 flex sm:mt-24 justify-center">
      <div class="border rounded-md overflow-hidden w-1/2">
        <div id="app" style="height: 500px" bind:this={app} />
      </div>
    </div>

    <!-- Features -->
    <Section
      title="Everything you need to visualize the structure of your machine learning models"
      tagline="Batteries included"
    >
      <span slot="subtitle"
        >Mycelium makes it easy to visualize exactly the characteristics of your machine learning
        models that your interested in.</span
      >
      <dl
        class="mt-16 sm:mt-20 lg:mt-24 grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16"
      >
        <Feature title="Performance" icon={Bolt}
          >Based on SVG but can handle models with thousands of nodes through hierarchical
          clustering.</Feature
        >
        <Feature title="Model Support" icon={CubeTransparent}
          >Comes with ONNX support out of the box. By writing a loader you can use Mycelium with any
          graph or model format.</Feature
        >
        <Feature title="Embeddable" icon={Link}
          >The graph viewer—although written in Svelte—is framework agnostic and can be embedded
          into any application by mounting it directly to the DOM.</Feature
        >
        <Feature title="Customizable" icon={AdjustmentsHorizontal}
          >Mycelium leverages SVG together with a tiny UI framework to allow rich contents in nodes
          and tooltips.</Feature
        >
      </dl>
    </Section>

    <!-- Team -->
    <Section title="Team">
      <span slot="subtitle">Authors</span>
      <p class="mt-8 test-gray-900 text-center">
        The following authors contributed directly to Mycelium.
      </p>
      <div class="mt-16 grid grid-cols-3 lg:mx-32">
        <Person name="Jochen Görtler" icon={`${base}/portrait/jg.png`} />
        <Person name="Fred Hohman" icon={`${base}/portrait/fh.jpeg`} />
        <Person name="Xiaoyi Zhang" icon={`${base}/portrait/xz.jpeg`} />
      </div>

      <p class="mt-16 sm:mt-20 lg:mt-24 text-lg leading-8 text-gray-600 text-center">
        Acknowledgements
      </p>
      <p class="mt-8 test-gray-900 text-center">
        This project is a collaboration across multiple teams at Apple. We would like to extend our
        thanks to all authors of Talaria: {[
          'Chaoqun Wang',
          'Jinmook Lee',
          'Dominik Moritz',
          'Jeffrey Bigham',
          'Zhile Ren',
          'Cecile Foret',
        ].join(', ')}, and Qi Shan.
      </p>
    </Section>

    <!-- Citation -->
    <Section title="Attribution" tagline="We would love to hear from you!">
      <span slot="subtitle"
        >You can use to following BibTex entry to cite Talaria (and therefore Mycelium).</span
      >
      <div class="mt-8 container prose !max-w-none"><Citation /></div>
    </Section>
  </div>
</div>
