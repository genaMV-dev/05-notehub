import { useEffect, type PropsWithChildren } from "react"
import css from "./Modal.module.css"
import { createPortal } from "react-dom"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

const Modal = ({
  isOpen,
  onClose,
  children,
}: PropsWithChildren<ModalProps>) => {
  useEffect(() => {
    if (!isOpen) return

    const escape = (event: KeyboardEvent) => {
      if (event.key === `Escape`) {
        onClose()
      }
    }

    document.addEventListener(`keydown`, escape)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener(`keydown`, escape)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null
  return createPortal(
    <div
      className={css.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
