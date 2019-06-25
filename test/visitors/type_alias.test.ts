import * as pluginTester from 'babel-plugin-tester';
import { buildPlugin } from '../../src/plugin';
import { TypeAlias } from '../../src/visitors/type_alias';

pluginTester({
  plugin: buildPlugin([TypeAlias]),
  tests: [
    {
      title: 'Object type alias: exact=true',
      code: `type a = {| a: T |};`,
      output: `type a = {
  a: T;
};`,
    },
    {
      title: 'preserves comments within typedefs',
      code: `type Props = {
  children?: React.Node,
  // The vertical alignment of the content before it starts to scroll
  verticalAlignWithoutScroll?: "top" | "center",
};`,
      output: `type Props = {
  children?: React.Node;
  // The vertical alignment of the content before it starts to scroll
  verticalAlignWithoutScroll?: "top" | "center";
};
`,
    },
    {
      title: 'preserves generics above imports',
      code: `export type UIOverlayType = React.Element<typeof Foo>;`,
      output: `export type UIOverlayType = React.Element<typeof Foo>;`,
    },
  ],
});
