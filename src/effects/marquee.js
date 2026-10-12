export default function createMarquee(target, options = {}) {
  const {
    speed = 60,
    direction = "left",
    gap = 20,
    pauseOnHover = true
  } = options;

  const container = typeof target === "string"
    ? document.querySelector(target)
    : target;

  if (!container) {
    throw new Error("motiq: Marquee element not found");
  }

  if (container.children.length === 0) {
    throw new Error("motiq: Marquee needs at least one item");
  }

  if (!Number.isFinite(speed) || speed < 0) {
    throw new Error("motiq: speed must be a non-negative number");
  }

  if (!Number.isFinite(gap) || gap < 0) {
    throw new Error("motiq: gap must be a non-negative number");
  }

  if (!["left", "right"].includes(direction)) {
    throw new Error("motiq: Invalid marquee direction");
  }

  // Build a track containing one original group
  // and enough copies to fill the viewport.
  const originalItems = [...container.children];
  const originalStyles = {
    overflow: container.style.overflow,
    position: container.style.position
  };

  const track = document.createElement("div");
  const group = document.createElement("div");

  track.style.display = "flex";
  track.style.width = "max-content";
  track.style.willChange = "transform";

  group.style.display = "flex";
  group.style.alignItems = "center";
  group.style.flexShrink = "0";
  group.style.gap = `${gap}px`;
  group.style.paddingRight = `${gap}px`;

  originalItems.forEach(item => group.appendChild(item));
  track.appendChild(group);

  container.style.overflow = "hidden";
  container.appendChild(track);

  let distance = 0;
  let position = 0;
  let frame = null;
  let lastTime = null;
  let paused = false;
  let hovering = false;
  let destroyed = false;

  function measure() {
    if (destroyed) return;

    // Remove previously created copies.
    while (track.children.length > 1) {
      track.lastElementChild.remove();
    }

    distance = group.getBoundingClientRect().width;

    if (distance <= 0) return;

    // Add enough copies to keep the viewport filled
    // while the track travels by one group width.
    const copies = Math.max(
      2,
      Math.ceil(container.clientWidth / distance) + 1
    );

    for (let i = 1; i < copies; i++) {
      const clone = group.cloneNode(true);

      clone.setAttribute("aria-hidden", "true");

      // Avoid keyboard focus entering duplicate items.
      clone.inert = true;

      track.appendChild(clone);
    }

    position = ((position % distance) + distance) % distance;
  }

  function animate(time) {
    if (destroyed) return;

    if (lastTime === null) lastTime = time;

    // Avoid huge jumps after an inactive browser tab.
    const delta = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    if (!paused && !hovering && distance > 0) {
      position = (position + speed * delta) % distance;
    }

    const offset = direction === "left"
      ? -position
      : position - distance;

    track.style.transform =
      `translate3d(${offset}px, 0, 0)`;

    frame = requestAnimationFrame(animate);
  }

  function onPointerOver(event) {
    if (
      pauseOnHover &&
      event.target.closest(".motiq-marquee-item")
    ) {
      hovering = true;
    }
  }

  function onPointerOut(event) {
    if (
      !container.contains(event.relatedTarget) ||
      !event.relatedTarget?.closest(".motiq-marquee-item")
    ) {
      hovering = false;
    }
  }

  // Give every original item an identifiable class
  // before measuring and cloning.
  const itemClasses = originalItems.map(item => ({
    item,
    hadClass: item.classList.contains("motiq-marquee-item")
  }));

  originalItems.forEach(item => {
    item.classList.add("motiq-marquee-item");
  });

  container.addEventListener("pointerover", onPointerOver);
  container.addEventListener("pointerout", onPointerOut);

  const observer = new ResizeObserver(measure);
  observer.observe(container);
  observer.observe(group);

  measure();
  frame = requestAnimationFrame(animate);

  // Public controller
  return {
    pause() {
      paused = true;
    },

    play() {
      paused = false;
    },

    destroy() {
      if (destroyed) return;

      destroyed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();

      container.removeEventListener(
        "pointerover",
        onPointerOver
      );
      container.removeEventListener(
        "pointerout",
        onPointerOut
      );

      originalItems.forEach(item => {
        container.appendChild(item);
      });

      track.remove();

      itemClasses.forEach(({ item, hadClass }) => {
        if (!hadClass) {
          item.classList.remove("motiq-marquee-item");
        }
      });

      container.style.overflow = originalStyles.overflow;
      container.style.position = originalStyles.position;
    }
  };
}