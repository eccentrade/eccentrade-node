const hooks = [];

export default class Hook {
  static register(name, fn) {
    if (!hooks[name]) {
      hooks[name] = [];
    }
    hooks[name].push(fn);
  }

  static call(name, ...rest) {
    if (!hooks[name]) {
      throw new Error('Hook not found');
    }
    for (const hook of hooks[name]) {
      hook(rest);
    }
  }
}