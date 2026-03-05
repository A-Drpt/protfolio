import React, { useState, useEffect } from 'react';

/**
 * Formulaire de création/édition de projet
 */
export default function ProjectForm({ project, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    github_link: '',
    demo_link: '',
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        technologies: Array.isArray(project.technologies) 
          ? project.technologies.join(', ')
          : project.technologies || '',
        github_link: project.githubLink || '',
        demo_link: project.demoLink || '',
      });
      setExistingImages(project.images || []);
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleRemoveExistingImage = (imageName) => {
    setExistingImages(prev => 
      prev.filter(img => (typeof img === 'string' ? img : img.url) !== imageName)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construire FormData pour multipart
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    
    // Technologies: array CSV
    const techs = formData.technologies
      .split(',')
      .map(t => t.trim())
      .filter(t => t);
    data.append('technologies', JSON.stringify(techs));
    
    data.append('githubLink', formData.github_link);
    data.append('demoLink', formData.demo_link);

    // Images existantes à garder
    data.append('existingImages', JSON.stringify(
      existingImages.map(img => typeof img === 'string' ? img : img.url)
    ));

    // Nouvelles images
    newImages.forEach(file => {
      data.append('images[]', file);
    });

    // (debug logs removed)

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} id="projectForm" className="admin-form" noValidate>
      <div className="mb-3">
        <label className="form-label">Titre *</label>
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

      <div className="mb-3">
        <label className="form-label">Technologies (séparées par virgule)</label>
        <input 
          type="text"
          className="form-control"
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          placeholder="React, Node.js, MongoDB"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Lien GitHub</label>
        <input 
          type="text"
          className="form-control"
          name="github_link"
          value={formData.github_link}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Lien démo</label>
        <input 
          type="text"
          className="form-control"
          name="demo_link"
          value={formData.demo_link}
          onChange={handleChange}
        />
      </div>

      {existingImages.length > 0 && (
        <div className="mb-3">
          <label className="form-label">Images existantes</label>
          <div className="d-flex flex-wrap gap-2">
            {existingImages.map((img, idx) => {
              const imgUrl = typeof img === 'string' ? img : img.url;
              return (
                <div key={idx} className="position-relative">
                  <img 
                    src={imgUrl} 
                    alt={`Image ${idx + 1}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    className="rounded"
                  />
                  <button 
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    onClick={() => handleRemoveExistingImage(imgUrl)}
                    style={{ padding: '2px 6px' }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Ajouter des images</label>
        <input 
          type="file"
          className="form-control"
          name="images"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        <small className="text-muted">La première image sera le visuel principal</small>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {project ? 'Mettre à jour' : 'Créer'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Annuler
        </button>
      </div>
    </form>
  );
}
