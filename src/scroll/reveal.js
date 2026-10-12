
export default function reveal(target, options = {}) {
  const {
    direction = "bottom",
    distance = 80,
    duration = 800,
    ease = "ease-out",
    threshold = 0.2,
    once = true
  } = options;

  const elements = typeof target === "string"
    ? document.querySelectorAll(target)
    : target instanceof Element
      ? [target]
      : target;

  const directions = {
    left: [-distance, 0],
    right: [distance, 0],
    top: [0, -distance],
    bottom: [0, distance]
  };

  if (!directions[direction]) {
    throw new Error("motiq: Invalid reveal direction");
  }

  const [x, y] = directions[direction];

  const hiddenTransform =
    `translate3d(${x}px, ${y}px, 0)`;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const states = new Map();

  elements.forEach(element => {
    const original = {
      opacity: element.style.opacity,
      transform: element.style.transform,
      visibility: element.style.visibility
    };

    states.set(element, {
      original,
      animation: null,
      visible: false
    });

    if (!reducedMotion) {
      element.style.opacity = "0";
      element.style.transform = hiddenTransform;
    }
  });

  function animateElement(element, visible) {
    const state = states.get(element);

    if (!state || state.visible === visible) return;

    state.visible = visible;

    state.animation?.cancel();

    if (reducedMotion) return;

    const start = visible
      ? { opacity: 0, transform: hiddenTransform }
      : { opacity: 1, transform: "none" };

    const end = visible
      ? { opacity: 1, transform: "none" }
      : { opacity: 0, transform: hiddenTransform };

    const animation = element.animate(
      [start, end],
      {
        duration,
        easing: ease,
        fill: "forwards"
      }
    );

    state.animation = animation;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateElement(entry.target, true);

        if (once) {
          observer.unobserve(entry.target);
        }
      } else if (!once) {
        animateElement(entry.target, false);
      }
    });
  }, { threshold });

  elements.forEach(element => observer.observe(element));

  return {
    destroy() {
      observer.disconnect();

      states.forEach((state, element) => {
        state.animation?.cancel();

        element.style.opacity = state.original.opacity;
        element.style.transform = state.original.transform;
        element.style.visibility = state.original.visibility;
      });

      states.clear();
    }
  };
}