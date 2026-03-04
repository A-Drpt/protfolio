import React from 'react';

/**
 * Liste des projets en table
 */
export default function ProjectList({ projects, onEdit, onDelete }) {
  if (!projects || projects.length === 0) {
    return <p className="text-muted">Aucun projet pour le moment.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Description</th>
            <th>Technologies</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>{project.title}</td>
              <td>
                {project.description?.substring(0, 80)}
                {project.description?.length > 80 ? '...' : ''}
              </td>
              <td>
                {Array.isArray(project.technologies) 
                  ? project.technologies.join(', ') 
                  : project.technologies}
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button 
                    className="btn-admin-edit"
                    onClick={() => onEdit(project)}
                  >
                    Modifier
                  </button>
                  <button 
                    className="btn-admin-delete"
                    onClick={() => onDelete(project)}
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
