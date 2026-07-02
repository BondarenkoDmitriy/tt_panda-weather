import type { ReactNode } from 'react';
import { useUser } from '../context/UserContext';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, actions }: ModalProps) {
  const { t } = useUser();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <h3 id="modal-title" className="modal__title">
            {title}
          </h3>
        )}
        <div className="modal__body">{children}</div>
        {actions && <div className="modal__actions">{actions}</div>}
        {!actions && (
          <div className="modal__actions">
            <button type="button" className="btn btn--primary" onClick={onClose}>
              {t('close')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
