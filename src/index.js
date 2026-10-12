
import Motiq from "./core/core.js";

import opacity from "./animations/opacity.js";
import x from "./animations/x.js";
import y from "./animations/y.js";

import createMarquee from "./effects/marquee.js";
import reveal from "./scroll/reveal.js";

const motiq = new Motiq();

motiq.register("opacity", opacity);
motiq.register("x", x);
motiq.register("y", y);

motiq.marquee = createMarquee;
motiq.reveal = reveal;

export default motiq;
