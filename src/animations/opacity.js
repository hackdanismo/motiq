const opacity = {
  get(element) {
    return parseFloat(
      getComputedStyle(element).opacity
    );
  },

  set(element, value) {
    element.style.opacity = value;
  }
};

export default opacity;