'use client'

import { useEffect, useState } from 'react'
import { MdClose, MdCheckCircle, MdError, MdInfo } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  show: boolean
  onClose: () => void
  duration?: number
}

export default function ToastNotification({ 
  message, 
  type, 
  show, 
  onClose,
  duration = 5000 
}: ToastProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!show) return

    const timer = setTimeout(() => {
      onClose()
    }, duration)

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100))
        return newProgress <= 0 ? 0 : newProgress
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
      setProgress(100)
    }
  }, [show, duration, onClose])

  const typeConfig = {
    success: {
      icon: <MdCheckCircle className="w-5 h-5" />,
      bgGradient: 'from-green-500/20 to-green-600/10',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400',
      progressColor: 'bg-green-500',
      glowColor: 'shadow-green-500/20'
    },
    error: {
      icon: <MdError className="w-5 h-5" />,
      bgGradient: 'from-red-500/20 to-red-600/10',
      borderColor: 'border-red-500/30',
      iconColor: 'text-red-400',
      progressColor: 'bg-red-500',
      glowColor: 'shadow-red-500/20'
    },
    info: {
      icon: <MdInfo className="w-5 h-5" />,
      bgGradient: 'from-primary/20 to-purple-600/10',
      borderColor: 'border-primary/30',
      iconColor: 'text-primary',
      progressColor: 'bg-primary',
      glowColor: 'shadow-primary/20'
    }
  }

  const config = typeConfig[type]

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 right-4 z-[100000] max-w-md w-full"
        >
          <div 
            className={`
              relative overflow-hidden rounded-xl border backdrop-blur-xl
              bg-gradient-to-br ${config.bgGradient}
              ${config.borderColor} ${config.glowColor}
              shadow-2xl
            `}
          >
            {/* Glass effect overlay */}
            <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />
            
            {/* Content */}
            <div className="relative p-4 flex items-start gap-3">
              {/* Icon */}
              <div className={`${config.iconColor} flex-shrink-0 mt-0.5`}>
                {config.icon}
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium leading-relaxed break-words">
                  {message}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-white/10 rounded-lg"
                aria-label="Close notification"
              >
                <MdClose className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="relative h-1 bg-white/5">
              <motion.div
                className={`absolute inset-y-0 left-0 ${config.progressColor}`}
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>

            {/* Glow effect */}
            <div className={`absolute inset-0 opacity-20 blur-xl ${config.progressColor}`} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

