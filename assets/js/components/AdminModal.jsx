import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modale réutilisable Bootstrap 5
 */
export default function AdminModal({ isOpen, title, onClose, children, size = 'modal-lg' }) {
  useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
      <div className={`modal fade show d-block admin-modal`} style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-modal="true">
        <div className={`modal-dialog modal-dialog-scrollable ${size}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
