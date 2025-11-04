'use client'

import ToastNotification from './toast-notification'
import { useGlobalContext } from '@/context/GlobalContext'

export default function ToastWrapper() {
  const { toast, setToast } = useGlobalContext()

  return (
    <ToastNotification
      message={toast.message}
      type={toast.type}
      show={toast.show}
      onClose={() => setToast({ ...toast, show: false })}
    />
  )
}

