import React from 'react';
import AdminModal from './AdminModal.jsx';

/**
 * Modale de confirmation de suppression
 */
export default function ConfirmDeleteModal({ isOpen, title, message, onConfirm, onCancel }) {
  return (
    <AdminModal isOpen={isOpen} title={title} onClose={onCancel} size="modal-md">
      <p>{message}</p>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onCancel}>
          Annuler
        </button>
        <button className="btn btn-danger" onClick={onConfirm}>
          Supprimer
        </button>
      </div>
    </AdminModal>
  );
}
