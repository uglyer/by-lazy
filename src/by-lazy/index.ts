import 'reflect-metadata';
import { DynamicImportInstanceHelper } from './DynamicImportInstanceHelper';

/**
 * 懒加载
 * @example_code 同步
 * ```
 * class Test {
 *     @byLazy(()=>new XXX())
 *     target:XXX;
 * }
 * ```
 * @example_code 异步
 * ```
 * class Test {
 *     @byLazy(()=> import("./helper/VirtualMeshRenderHelper")
 *          .then(model => new model.VirtualMeshRenderHelper(this)))
 *     target:Promise<Test>
 * }
 * ```
 */
export function byLazy<T>(
  onCreate: (target: any) => T,
  onRelease?: (instance: T) => void,
) {
  return function (target: any, key: any) {
    const getHelper = (target: any) => {
      let helper: DynamicImportInstanceHelper<any> = Reflect.getMetadata(
        `byLazy:target`,
        target,
        key as string,
      );
      if (!helper) {
        helper = new DynamicImportInstanceHelper(() => onCreate(target));
        Reflect.defineMetadata(`byLazy:target`, helper, target, key);
        const releaseFunc = (tryCallRelease: boolean) => {
          const instance = helper.getRawTarget();
          if (tryCallRelease) {
            try {
              onRelease?.(instance);
              // eslint-disable-next-line no-empty
            } catch (e) {}
          }
          helper.release();
          Reflect.deleteMetadata(`byLazy:target`, target, key);
        };
        const needReleaseFuncList = Reflect.getMetadata(
          `byLazy:target:release`,
          target,
        ) as Array<(call: boolean) => void>;
        if (!needReleaseFuncList) {
          // 不存在定时
          Reflect.defineMetadata(
            `byLazy:target:release`,
            [releaseFunc],
            target,
          );
        } else {
          needReleaseFuncList.push(releaseFunc);
        }
      }
      return helper;
    };
    Object.defineProperty(target, key, {
      get: function () {
        let helper: DynamicImportInstanceHelper<any> = getHelper(this);
        if (!helper.hasTarget()) {
          helper.dynamicRun();
        }
        if (helper.isPromise) {
          return helper.get();
        } else {
          return helper.getRawTarget();
        }
      },
      set: function (value: T) {
        getHelper(this).setTarget(value);
      },
      configurable: true,
      enumerable: false,
    });
  };
}

/**
 * 是否已经通过 byLazy 初始化
 * @param target
 * @param key
 */
export function hasLoadedByLazy<T, K extends keyof T>(
  target: T,
  key: K,
): boolean {
  return !!Reflect.getMetadata(`byLazy:target`, target, key as string);
}

/**
 * 释放通过 byLazy初始化的实例
 * @param target
 * @param callRelease 是否调用方式回调
 */
export function releaseByLazyInstance<T>(
  target: T,
  callRelease: boolean = true,
) {
  const needReleaseFuncList = Reflect.getMetadata(
    `byLazy:target:release`,
    target,
  ) as Array<(tryCall: boolean) => void>;
  if (needReleaseFuncList) {
    needReleaseFuncList.forEach((it) => it(callRelease));
    Reflect.deleteMetadata(`byLazy:target:release`, target);
  }
  Reflect.deleteMetadata(`byLazy:target`, target);
}
