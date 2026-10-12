
const positions = new WeakMap();

export function getPosition(element) {
  if (!positions.has(element)) {
    const style = getComputedStyle(element);
    const matrix = new DOMMatrixReadOnly(style.transform);

    positions.set(element, {
      x: matrix.m41,
      y: matrix.m42,
      baseTransform: element.style.transform
    });
  }

  return positions.get(element);
}

export function setPosition(element, property, value) {
  const position = getPosition(element);

  position[property] = value;

  element.style.transform =
    `translate(${position.x}px, ${position.y}px)`;
}
