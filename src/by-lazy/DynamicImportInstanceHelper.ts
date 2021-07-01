/**
 * 动态导入单例锁帮助类
 * @description (避免初始化多个对象)
 * @author uglyer
 * @date 2020/7/15 11:19
 * @example_code 调用方式
 * virtualMeshRenderHelper = new DynamicImportInstanceHelper<VirtualMeshRenderHelper>(() => import("./helper/VirtualMeshRenderHelper")
 *    .then(model => new model.VirtualMeshRenderHelper(this))
 * );
 * await virtualMeshRenderHelper.get();
 */
export class DynamicImportInstanceHelper<T> {
  private getModelFunc: () => Promise<T> | T;
  private loadLock?: boolean;
  private target?: T;
  private callbackResolve: Array<(target: any) => void> = [];
  isPromise?: boolean;

  /**
   * 初始化
   * @param getModelFunc 实例化单例对象的方法
   */
  constructor(getModelFunc: () => Promise<T> | T) {
    this.getModelFunc = getModelFunc;
  }

  /**
   * 动态运行,运行时监测是否为异步
   */
  dynamicRun() {
    if (this.loadLock) {
      return;
    }
    this.loadLock = true;
    const result = this.getModelFunc();
    if (result instanceof Promise) {
      this.isPromise = true;
      result.then((target) => {
        this.target = target;
        this.callbackResolve.forEach((it) => it(this.target));
        this.callbackResolve = [];
        this.loadLock = false;
      });
    } else {
      this.target = result;
      this.loadLock = false;
    }
  }

  /**
   * 获取实例化对象, 如果未创建, 会执行实例化
   */
  async get(): Promise<T> {
    if (this.loadLock) {
      return new Promise<T>((resolve) => {
        this.callbackResolve.push(resolve);
      });
    }
    if (!this.target) {
      this.loadLock = true;
      this.target = await this.getModelFunc();
      this.callbackResolve.forEach((it) => it(this.target));
      this.callbackResolve = [];
      this.loadLock = false;
    }
    return this.target;
  }

  /**
   * 是否已经初始化
   */
  hasTarget() {
    return !!this.target;
  }

  /**
   * 获取原始对象，可能为 null
   */
  getRawTarget() {
    return this.target;
  }

  /**
   * 设置目标对象
   * @param target
   */
  setTarget(target: T) {
    this.target = target;
  }

  /**
   * 释放
   */
  release() {
    // @ts-ignore
    delete this.target;
    // @ts-ignore
    delete this.getModelFunc;
    // @ts-ignore
    delete this.callbackResolve;
  }
}
