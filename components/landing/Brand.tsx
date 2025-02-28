"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Leaf, Heart, Zap } from "lucide-react"

const brandValues = [
  {
    icon: Leaf,
    title: "Сталий розвиток",
    description:
      "Ми використовуємо екологічно чисті матеріали та етичні методи виробництва, щоб мінімізувати вплив на довкілля.",
  },
  {
    icon: Heart,
    title: "Якість і комфорт",
    description:
      "Наші вироби створені з увагою до деталей, забезпечуючи неперевершену якість та комфорт у повсякденному житті.",
  },
  {
    icon: Zap,
    title: "Інноваційний підхід",
    description:
      "Ми поєднуємо сучасний дизайн із функціональністю, створюючи стильні та практичні рішення для вашого гардеробу.",
  },
]

export default function Brand() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <motion.section
      ref={sectionRef}
      className="w-full py-24 bg-white"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          className="text-heading1-bold mb-12 text-center text-neutral-900"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Наші принципи
        </motion.h2>
        <motion.p
          className="text-body-medium text-neutral-600 text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Ми створюємо більше, ніж просто одяг — це стиль життя, що поєднує естетику, комфорт та відповідальний підхід.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {brandValues.map((value, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <div className="mb-6 p-4 rounded-full bg-neutral-100">
                <value.icon className="w-8 h-8 text-neutral-900" />
              </div>
              <h3 className="text-heading3-bold mb-4 text-neutral-900">{value.title}</h3>
              <p className="text-base-regular text-neutral-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
