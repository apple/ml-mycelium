`proto` contains the compiled and vendored `protobuf` parser.

```
npm install -g protobufj-cli
pbjs -t static-module -w es6 -r onnx -o src/lib/loader/onnx/compiled.js src/lib/loader/onnx/onnx.proto3
pbts -o src/lib/loader/onnx/compiled.d.ts src/lib/loader/onnx/compiled.js
```

:warning: Small adjustments need to be made to the resulting file for it to properly be included into the project:

```js
// proto/index.mjs
import $protobuf from 'protobufjs/minimal';
```
