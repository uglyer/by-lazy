---
nav:
  title: 指南
  path: /guide
---

## 什么是 byLazy

一种延迟加载方式, 受 Kotlin by lazy 启发, JS 端的懒加载装饰器

支持异步锁, 无需担心异步任务执行多次

### 执行顺序

```typescript
import { byLazy } from 'by-lazy';

class Bean {
  @byLazy(() => {
    console.log('Init lazy');
    return 'Hello World';
  })
  str: string;
}

const bean = new Bean();
console.log('Init Bean');
console.log(bean.str);
```

```shell script
Init Bean
Init lazy
Hello World
```

### 可以在哪些场景下使用

- 内存敏感

- 包体积敏感

```typescript | pure
import { byLazy } from 'by-lazy';

class Example {
  // 低频使用功能, 动态加载(dynamic import) 以降低初始包体积
  @byLazy(() =>
    import('./TestObject').then((module) => new module.TestObject()),
  )
  testObject: Promise<TestObject>;

  @byLazy(() => fetch('./test.json').then((res) => res.json()))
  fetchResult: Promise<{ test: string }>;
}
```
