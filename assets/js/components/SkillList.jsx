import React from 'react';

/**
 * Liste des compétences groupées par type
 */
export default function SkillList({ skills, onEdit, onDelete }) {
  // Normalisation type pour affichage
  const normalizeType = (type) => {
    if (type === 'Technical') return 'hard';
    if (type === 'Soft') return 'soft';
    return type;
  };

  // Grouper par type
  const grouped = {};
  skills.forEach(skill => {
    const type = normalizeType(skill.type);
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(skill);
  });

  if (!skills || skills.length === 0) {
    return <p className="text-muted">Aucune compétence pour le moment.</p>;
  }

  return (
    <div>
      {['hard', 'soft'].map(type => {
        const skillsOfType = grouped[type] || [];
        if (skillsOfType.length === 0) return null;

        return (
          <div key={type} className="mb-4">
            <h4 className="mb-3">
              {type === 'hard' ? 'Hard Skills' : 'Soft Skills'}
            </h4>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Type</th>
                    <th>Niveau</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {skillsOfType.map(skill => (
                    <tr key={skill.id}>
                      <td>{skill.name}</td>
                      <td>{type === 'hard' ? 'Technique' : 'Interpersonnelle'}</td>
                      <td>
                        {skill.level === 'beginner' && 'Débutant'}
                        {skill.level === 'intermediate' && 'Intermédiaire'}
                        {skill.level === 'advanced' && 'Avancé'}
                        {skill.level === 'expert' && 'Expert'}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn-admin-edit"
                            onClick={() => onEdit(skill)}
                          >
                            Modifier
                          </button>
                          <button 
                            className="btn-admin-delete"
                            onClick={() => onDelete(skill)}
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
          </div>
        );
      })}
    </div>
  );
}
