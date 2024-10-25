//@ requireOptions("--useBBQJIT=1", "--useWasmLLInt=1")
//@ skip
// Failure:
// Exception: CompileError: WebAssembly.Module doesn't parse at byte 35: init_expr should end with end, ended with 35 (evaluating 'new WebAssembly.Module(this.toBuffer(debug))')
//  Module@[native code]
//  toModule@.tests/wasm.yaml/wasm/v8/wasm-module-builder.js:2082:34
//  instantiate@.tests/wasm.yaml/wasm/v8/wasm-module-builder.js:2071:31
//  ExtendedConstantsTestI32@extended-constants.js:43:37
//  global code@extended-constants.js:46:3

// Copyright 2022 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --experimental-wasm-extended-const

load("wasm-module-builder.js");

(function ExtendedConstantsTestI32() {
  // print(arguments.callee.name);

  let builder = new WasmModuleBuilder();

  let imported_global_0 = builder.addImportedGlobal("m", "g0", kWasmI32, false);
  let imported_global_1 = builder.addImportedGlobal("m", "g1", kWasmI32, false);

  let defined_global = builder.addGlobal(
    kWasmI32, false,
    [kExprGlobalGet, imported_global_0, kExprGlobalGet, imported_global_1,
     kExprGlobalGet, imported_global_0, ...wasmI32Const(1),
     kExprI32Sub, kExprI32Mul, kExprI32Add]);

  builder.addExportOfKind("global", kExternalGlobal, defined_global.index);

  let value0 = 123;
  let value1 = -450;

  let global_obj0 = new WebAssembly.Global({value: "i32", mutable: false},
                                           value0);
  let global_obj1 = new WebAssembly.Global({value: "i32", mutable: false},
                                           value1);

  let instance = builder.instantiate({m : {g0: global_obj0, g1: global_obj1}});

  assertEquals(value0 + (value1 * (value0 - 1)), instance.exports.global.value);
})();

(function ExtendedConstantsTestI64() {
  // print(arguments.callee.name);

  let builder = new WasmModuleBuilder();

  let imported_global_0 = builder.addImportedGlobal("m", "g0", kWasmI64, false);
  let imported_global_1 = builder.addImportedGlobal("m", "g1", kWasmI64, false);

  let defined_global = builder.addGlobal(
    kWasmI64, false,
    [kExprGlobalGet, imported_global_0, kExprI64Const, 1, kExprI64Sub,
     kExprGlobalGet, imported_global_1, kExprI64Mul,
     kExprGlobalGet, imported_global_0, kExprI64Add]);

  builder.addExportOfKind("global", kExternalGlobal, defined_global.index);

  let value0 = 123n;
  let value1 = -450n;

  let global_obj0 = new WebAssembly.Global({value: "i64", mutable: false},
                                           value0);
  let global_obj1 = new WebAssembly.Global({value: "i64", mutable: false},
                                           value1);

  let instance = builder.instantiate({m : {g0: global_obj0, g1: global_obj1}});

  assertEquals(value0 + (value1 * (value0 - 1n)),
               instance.exports.global.value);
})();
