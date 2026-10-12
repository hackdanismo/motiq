
class Motiq {
  constructor() {
    this.properties = new Map();
  }

  // Register an animation property
  register(name, handler) {
    this.properties.set(name, handler);
    return this;
  }

  // Animate an element
  to(target, options) {
    const element =
      typeof target === "string"
        ? document.querySelector(target)
        : target;

    if (!element) {
      throw new Error("motiq: Element not found");
    }

    const {
      duration = 1000,
      ...properties
    } = options;

    const animations = [];

    // Prepare all animated properties
    for (const [name, end] of Object.entries(properties)) {
      const handler = this.properties.get(name);

      if (!handler) {
        throw new Error(`motiq: Unknown property "${name}"`);
      }

      const start = handler.get(element);

      animations.push({
        handler,
        start,
        end
      });
    }

    let startTime = null;

    const animate = (timestamp) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;

      const progress = duration <= 0
        ? 1
        : Math.min(elapsed / duration, 1);

      for (const animation of animations) {
        const { handler, start, end } = animation;

        const value = start + (end - start) * progress;

        handler.set(element, value);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}

export default Motiq;