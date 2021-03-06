# by-lazy

## 什么是 byLazy

一种延迟加载方式, 受 Kotlin by lazy 启发, JS 端的懒加载装饰器

支持异步锁, 无需担心异步任务执行多次

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
  @byLazy(() => import('./TestObject').then((module) => new module.TestObject()))
  testObject: Promise<TestObject>;

  @byLazy(() => fetch('./test.json').then((res) => res.json()))
  fetchResult: Promise<{ test: string }>;
}
```

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

```typescript
import { byLazy } from 'by-lazy';

class Example {
  // 低频使用功能, 动态加载(dynamic import) 以降低初始包体积
  @byLazy(() => import('./TestObject').then((module) => new module.TestObject()))
  testObject: Promise<TestObject>;

  @byLazy(() => fetch('./test.json').then((res) => res.json()))
  fetchResult: Promise<{ test: string }>;
}
```

## Getting Started

Install dependencies,

```bash
$ npm i
```

Start the dev server,

```bash
$ npm start
```

Build documentation,

```bash
$ npm run docs:build
```
