import plugin from './tsTypesPlugin';
import { createTransform } from './createTransform';

const transform = createTransform([plugin]);

describe('tsTypesPlugin', () => {
  test('simple case', () => {
    expect(
      transform(`
import { Component } from 'react';
type A = React$Node;
type B = SyntheticInputEvent<HTMLInputElement>;

class C extends Component {}
`)
    ).toMatchSnapshot();
  });
  test('rename imported', () => {
    expect(
      transform(`
import { Node } from 'react';
type A = Node;
`)
    ).toMatchSnapshot();
  });
  test('namespace and named imports can not be mixed', () => {
    expect(
      transform(`
import * as React from 'react';
type A = React$Node;
`)
    ).toMatchSnapshot();
  });
  test('rename exports used from imported namespace', () => {
    expect(
      transform(`
import * as React from 'react';
type A = React.Node;
let a = 0;
`)
    ).toMatchSnapshot();
  });
  test('forwardRef<T,P>', () => {
    expect(
      transform(`
import * as React from 'react';
let a = React.forwardRef<T,P>();
let b = React.forwardRef<T>();
let c = React.forwardRef();
`)
    ).toMatchSnapshot();
  });
  test('import for replaced global value', () => {
    expect(
      transform(`
export type ButtonPropsT = {
  children?: React$Node
}
`)
    ).toMatchSnapshot();
  });
  test('does not add duplicated import', () => {
    expect(
      transform(`// @flow
import type {Writable} from 'stream';

export default class Trace {
  pipe(writable: Writable): stream$Writable {
    return this.tracer.pipe(writable);
  }
}
`)
    ).toMatchInlineSnapshot(`
      "// @flow
      import type { Writable } from \\"stream\\";

      export default class Trace {
        pipe(writable: Writable): Writable {
          return this.tracer.pipe(writable);
        }
      }
      "
    `);
  });
  test('does not add duplicated import when not type import is present', () => {
    expect(
      transform(`
import { Component } from 'react';

export function test(value: React$Component<unknown, unknown>) {}
export function print(component: Component<any>) {}
`)
    ).toMatchInlineSnapshot(`
      "import { Component } from \\"react\\";

      export function test(value: Component<unknown, unknown>) {}
      export function print(component: Component<any>) {}
      "
    `);
  });
});

// todo:
// bug: local variable got renamed from `Element` to `ReactElement`
//
// React.ElementRef<any>
//
// React.forwardRef<Config, Instance> => React.forwardRef<Instance, Config>
//
// HTMLCollection => HTMLCollectionOf
//
// type ChildrenT = React.ChildrenArray<React.ReactElement<any>>;
//
// TimeoutID => ReturnType<setTimeout>
//
//     {
//       title: 'new imports should be added bellow first comment',
//       code: `/* copyright comments */
// type A = React$Node;
// `,
//       output: `/* copyright comments */
// import { ReactNode } from 'react';
// type A = ReactNode;
// `,
//     },
//
// use namespace imports instead of default imports for some modules (like react)
// script to collect data from flow lib
// flow utility types, $Diff in compiled code looks ugly
// .editorconfig
// lint rules
