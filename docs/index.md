---
hero:
  title: byLazy
  desc: 一种延迟加载方式, 受 Kotlin by lazy 启发, JS 端的懒加载装饰器(支持异步)
  actions:
    - text: Getting Started
      link: /guide
features:
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/881dc458-f20b-407b-947a-95104b5ec82b/k79dm8ih_w144_h144.png
    title: 开箱即用
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/d60657df-0822-4631-9d7c-e7a869c2f21c/k79dmz3q_w126_h126.png
    title: 按需加载
  - icon: https://gw.alipayobjects.com/zos/bmw-prod/d1ee0c6f-5aed-4a45-a507-339a4bfe076c/k7bjsocq_w144_h144.png
    title: 支持异步
footer: Open-source MIT Licensed | Copyright © 2020<br />Powered by [dumi](https://d.umijs.org)
---

## 快速上手

```shell script
npm i by-lazy
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
  fetchResult: Promise<{ test: string }>;
}
```
