import React from 'react'
import { useScroll, useTransform } from "motion/react";

import { GoogleGeminiEffect } from "./ui/google-gemini-effect";

const Gemini = () => {

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);
  return (
    <div className="w-screen h-auto">
      <div
        className="
      h-[150vh]        // default (mobile-first)
      sm:h-[250vh]     // small screen (>= 640px)
      md:h-[300vh]     // medium screen (>= 768px)
      lg:h-[400vh]     // large screen and up (>= 1024px)
      bg-gradient-to-t from-black to-[#0A0A0A]
      w-full relative overflow-clip
    "
        ref={ref}
      >
        <GoogleGeminiEffect
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
        />
      </div>
    </div>

  )
}

export default Gemini
