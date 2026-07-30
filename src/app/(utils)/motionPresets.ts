// src/app/(utils)/motionPresets.ts
import { Variants, Transition } from "framer-motion";

/* ---------------------------------------------
   🧠 Global Motion Configuration
   Keep all reveal animations consistent across site
--------------------------------------------- */

export const defaultTransition: Transition = {
  duration: 0.7,
  ease: [0.25, 0.1, 0.25, 1], // cubic-bezier (ease-in-out)
};

/* ---------------------------------------------
   🎬 Section-level motion
--------------------------------------------- */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: defaultTransition,
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

/* ---------------------------------------------
   💡 Usage Example:
   import { motion } from "framer-motion";
   import { fadeUp, fadeLeft, staggerContainer } from "@/app/(utils)/motionPresets";

   <motion.div
     variants={staggerContainer}
     initial="hidden"
     whileInView="visible"
     viewport={{ once: true }}
   >
     <motion.h2 variants={fadeUp}>Heading</motion.h2>
     <motion.p variants={fadeUp}>Paragraph</motion.p>
   </motion.div>
--------------------------------------------- */