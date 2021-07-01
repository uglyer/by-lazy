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

### 是否被实例化

```typescript | pure
import { byLazy, hasLoadedByLazy } from 'by-lazy';

class Example {
  @byLazy(() => new TestObject())
  testObject: TestObject;

  hasInit() {
    return hasLoadedByLazy(this, 'testObject');
  }
}
```

### 释放

```typescript | pure
import { byLazy, releaseByLazyInstance } from 'by-lazy';

class Example {
  @byLazy(
    () => new TestObject(),
    (instance) => console.log('如果被实例化, 释放时调用'),
  )
  testObject: TestObject;

  release() {
    releaseByLazyInstance(this);
  }
}
```
