# Mycelium - Talaria's Graph Viewer

Mycelium is a library for quickly creating graph visualizations of machine learning models (or any directed acyclic graph).
It was created to power the graph representations of [Talaria](https://machinelearning.apple.com/research/talaria) (ACM CHI 2024 Best Paper Honorable Mention) — which is an interactive visualization for optimizing the efficiency of on-device inference of machine learning models.

It supports the following features:

- Fully customizable node labels and tooltips
- Expand and collapse nodes of large hierarchical models
- Based on SVG but can handle models with thousands of nodes

- You can create a loader for your own data format

Mycelium consists of three parts that are mostly independent from another:

- The Svelte-based viewer in `/src/lib`
- Loaders for various formats in `/src/lib/loader`
- A SvelteKit-based web app for quick tests and development in `/src/app.html`

### BibTeX

To cite our paper, please use:

```bib
@inproceedings{Hoh+2024,
  title={Talaria: Interactively Optimizing Machine Learning Models for Efficient Inference},
  author={Fred Hohman and Chaoqun Wang and Jinmook Lee and Jochen Görtler and Dominik Moritz and Jeffrey Bigham and Zhile Ren and Cecile Foret and Qi Shan and Xiaoyi Zhang},
  booktitle={Proceedings of the SIGCHI Conference on Human Factors in Computing Systems},
  year={2024},
  organization={ACM},
  doi={10.1145/3613904.3642628}
  url = {https://arxiv.org/abs/2404.03085}
}
```

### Usage

To install Mycelium via [NPM](https://www.npmjs.com/package/@apple/mycelium) you can run:

```sh
npm install @apple/mycelium
```

If you prefer to vendor Mycelium into your project you can follow these steps:

```sh
# in the root directory of Mycelium
pnpm install
pnpm pack # automatically calls `pnpm build:lib`
```

The resulting tarball can than be added to your project's dependencies in `package.json` like so:

```json
"@apple/mycelium": "file:apple-mycelium-x.y.z.tgz",
```

### Example

The following is an example of the output of Mycelium for a small network with two levels of hierarchy. The information that is shown for each node is fully customizable.

<p align="center">
  <img src="https://raw.githubusercontent.com/apple/ml-mycelium/main/example.png" alt="Mycelium example" style="max-height: 600" />
</p>

## Deployment

To deploy Mycelium to GitHub Pages, we can run the following commands:

```sh
pnpm install
pnpm run deploy # adding `run` is important here.
```

### Development

```sh
pnpm install
pnpm run dev
```

This project uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) to automatically generate a `CHANGELOG.md` which signals breaking changes.
The following command can be used to create a release and update the changelog:

```sh
npx standard-version@9.5.0 --preset conventionalcommits
```
