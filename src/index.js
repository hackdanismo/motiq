import Motiq from "./core/core.js";

import opacity from "./animations/opacity.js";
import createMarquee from "./effects/marquee.js";

const motiq = new Motiq();

// Animation properties
motiq.register("opacity", opacity);

// Animation effects
motiq.marquee = createMarquee;

export default motiq;