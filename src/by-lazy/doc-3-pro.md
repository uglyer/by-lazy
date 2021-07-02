---
nav:
  title: 指南
  path: /guide
---

## 高级用法

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
  @byLazy(() => new TestObject(), (instance) => console.log('如果被实例化, 释放时调用'))
  testObject: TestObject;

  release() {
    releaseByLazyInstance(this);
  }
}
```
