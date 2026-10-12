
import { getPosition, setPosition } from "./transform.js";

const x = {
  get(element) {
    return getPosition(element).x;
  },

  set(element, value) {
    setPosition(element, "x", value);
  }
};

export default x;
