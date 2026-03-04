import React from 'react';

/**
 * Liste des expériences en cards
 */
export default function ExperienceList({ experiences, onEdit, onDelete }) {
  if (!experiences || experiences.length === 0) {
    return <p className="text-muted">Aucune expérience pour le moment.</p>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Présent';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="row g-3">
      {experiences.map(experience => (
        <div key={experience.id} className="col-md-6">
          <div className="admin-card">
            <h5 className="mb-2">{experience.title}</h5>
            <p className="text-muted mb-2">
              {experience.company} • {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
            </p>
            <p className="mb-3">
              {experience.description?.substring(0, 100)}
              {experience.description?.length > 100 ? '...' : ''}
            </p>
            <div className="d-flex gap-2">
              <button 
                className="btn-admin-edit"
                onClick={() => onEdit(experience)}
              >
                Modifier
              </button>
              <button 
                className="btn-admin-delete"
                onClick={() => onDelete(experience)}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
