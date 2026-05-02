import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

/**
 * Sık güncellenen sayıları (sayım / odeometre hissiyle) tween veya yay ile bir önceki değere göre süzükür.
 * Yeni `value` gelince önceki `animate()` iptal edilir — titreşmez.
 *
 * Varsayılan ~0.76s tween · 1 sn’lik oyuncu döngüsüyle uyumlu.
 */
export default function AnimatedNumber({
  value,
  integer = false,
  minFractionDigits = 0,
  maxFractionDigits = 2,
  /** Örn. saat kartı için `02:00` */
  padStartDigits = null,
  prefix = '',
  suffix = '',
  locale = 'tr-TR',
  className,
  variant = 'tween',
}) {
  const finite = typeof value === 'number' && Number.isFinite(value) ? value : 0
  const mv = useMotionValue(finite)
  const reduceMotion = useReducedMotion()

  const format = useMemo(() => {
    return (latest) => {
      const raw = typeof latest === 'number' && Number.isFinite(latest) ? latest : 0
      let body = ''
      if (integer && padStartDigits != null) {
        body = String(Math.round(raw)).padStart(padStartDigits, '0')
      } else if (integer) {
        body = String(Math.round(raw))
      } else {
        body = raw.toLocaleString(locale, {
          minimumFractionDigits: minFractionDigits,
          maximumFractionDigits: maxFractionDigits,
        })
      }
      return `${prefix}${body}${suffix}`
    }
  }, [integer, maxFractionDigits, minFractionDigits, locale, padStartDigits, prefix, suffix])

  const [text, setText] = useState(() => format(finite))

  useMotionValueEvent(mv, 'change', (latest) => {
    setText(format(latest))
  })

  useEffect(() => {
    const target = typeof value === 'number' && Number.isFinite(value) ? value : 0

    if (reduceMotion) {
      mv.jump(target)
      setText(format(target))
      return
    }

    const opts =
      variant === 'spring'
        ? {
            type: 'spring',
            stiffness: 58,
            damping: 19,
            mass: 0.5,
          }
        : {
            duration: 0.76,
            ease: [0.2, 0.85, 0.37, 0.96],
          }

    const ctrl = animate(mv, target, opts)
    return () => ctrl.stop()
  }, [value, mv, reduceMotion, variant, format])

  const spanClass = ['tabular-nums', className].filter(Boolean).join(' ')
  return <span className={spanClass}>{text}</span>
}

/** Yüzdelik doluluk çubuğu — yaylı genişlik; sık yüzde sıçramasında akıcı. */
export function AnimatedPctFill({ pct, active, className }) {
  const reduceMotion = useReducedMotion()
  const clamped =
    typeof pct === 'number' && Number.isFinite(pct)
      ? Math.min(100, Math.max(0, pct))
      : 0

  return (
    <motion.div
      className={className}
      initial={false}
      animate={{ width: active ? `${clamped}%` : '0%' }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 76,
              damping: 24,
              mass: 0.42,
            }
      }
    />
  )
}
