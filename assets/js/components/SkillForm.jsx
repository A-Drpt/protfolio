import React, { useState, useEffect } from 'react';

/**
 * Formulaire de création/édition de compétence
 */
export default function SkillForm({ skill, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'hard',
    level: 'intermediate',
  });

  // Normalisation type: DB utilise "Technical"/"Soft", UI utilise "hard"/"soft"
  const normalizeTypeFromDB = (type) => {
    if (type === 'Technical') return 'hard';
    if (type === 'Soft') return 'soft';
    return type;
  };

  const normalizeTypeForDB = (type) => {
    if (type === 'hard') return 'Technical';
    if (type === 'soft') return 'Soft';
    return type;
  };

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || '',
        type: normalizeTypeFromDB(skill.type) || 'hard',
        level: skill.level || 'intermediate',
      });
    }
  }, [skill]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: formData.name,
      type: normalizeTypeForDB(formData.type),
      level: formData.level,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Nom *</label>
        <input 
          type="text"
          className="form-control"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Type *</label>
        <div>
          <div className="form-check">
            <input 
              className="form-check-input"
              type="radio"
              name="type"
              value="hard"
              checked={formData.type === 'hard'}
              onChange={handleChange}
            />
            <label className="form-check-label">Hard Skills (technique)</label>
          </div>
          <div className="form-check">
            <input 
              className="form-check-input"
              type="radio"
              name="type"
              value="soft"
              checked={formData.type === 'soft'}
              onChange={handleChange}
            />
            <label className="form-check-label">Soft Skills (interpersonnelle)</label>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Niveau *</label>
        <select 
          className="form-select"
          name="level"
          value={formData.level}
          onChange={handleChange}
          required
        >
          <option value="beginner">Débutant</option>
          <option value="intermediate">Intermédiaire</option>
          <option value="advanced">Avancé</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {skill ? 'Mettre à jour' : 'Créer'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
