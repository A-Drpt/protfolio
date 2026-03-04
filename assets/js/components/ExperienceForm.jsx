import React, { useState, useEffect } from 'react';

/**
 * Formulaire de création/édition d'expérience
 */
export default function ExperienceForm({ experience, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company || '',
        title: experience.title || '',
        description: experience.description || '',
        startDate: experience.startDate ? experience.startDate.split('T')[0] : '',
        endDate: experience.endDate ? experience.endDate.split('T')[0] : '',
      });
    }
  }, [experience]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      company: formData.company,
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Entreprise *</label>
        <input 
          type="text"
          className="form-control"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Poste *</label>
        <input 
          type="text"
          className="form-control"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description *</label>
        <textarea 
          className="form-control"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Date de début *</label>
          <input 
            type="date"
            className="form-control"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Date de fin</label>
          <input 
            type="date"
            className="form-control"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          <small className="text-muted">Laissez vide si en cours</small>
        </div>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {experience ? 'Mettre à jour' : 'Créer'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
