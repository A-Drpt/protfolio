import React from 'react';

/**
 * Modale réutilisable Bootstrap 5
 */
export default function AdminModal({ isOpen, title, onClose, children, size = 'modal-lg' }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
      <div className={`modal fade show d-block`} style={{ display: 'block' }} tabIndex="-1">
        <div className={`modal-dialog ${size}`}>
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
}
