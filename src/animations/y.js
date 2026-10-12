
import { getPosition, setPosition } from "./transform.js";

const y = {
  get(element) {
    return getPosition(element).y;
  },

  set(element, value) {
    setPosition(element, "y", value);
  }
};

export default y;
