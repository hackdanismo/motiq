
import Motiq from "./core/core.js";
import opacity from "./animations/opacity.js";

const motiq = new Motiq();

motiq.register("opacity", opacity);

export default motiq;
