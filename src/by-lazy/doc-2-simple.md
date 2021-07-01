---
nav:
  title: 指南
  path: /guide
---

## 基础用法

### 安装

```shell script
npm i by-lazy
```

### 配置 tsconfig.json

```json
{
    "experimentalDecorators": true,
    ...
}
```

### 同步执行

```typescript | pure
import { byLazy } from 'by-lazy';

class Example {
  @byLazy(() => new TestObject())
  testObject: TestObject;
}
```

### 异步执行

```typescript | pure
import { byLazy } from 'by-lazy';

class Example {
  @byLazy(() =>
    import('./TestObject').then((module) => new module.TestObject()),
  )
  testObject: Promise<TestObject>;

  @byLazy(() => fetch('./test.json').then((res) => res.json()))
  featchResult: Promise<{ test: string }>;
}
```
