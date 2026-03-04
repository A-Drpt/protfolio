import React, { useState, useEffect } from 'react';
import * as Api from '../api/client.js';
import { useAdmin } from './AdminDashboard.jsx';
import ProjectForm from './ProjectForm.jsx';
import ProjectList from './ProjectList.jsx';
import AdminModal from './AdminModal.jsx';
import ConfirmDeleteModal from './ConfirmDeleteModal.jsx';

/**
 * Tab Projets du dashboard
 */
export default function ProjectsTab() {
  const { setLoading, setError, setSuccess } = useAdmin();
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await Api.getProjects();
      setProjects(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      await Api.createProject(formData);
      await loadProjects();
      setShowForm(false);
      setSuccess('Projet créé avec succès!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleUpdate = async (formData) => {
    setLoading(true);
    try {
      await Api.updateProject(editingProject.id, formData);
      await loadProjects();
      setShowForm(false);
      setEditingProject(null);
      setSuccess('Projet mis à jour avec succès!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setLoading(true);
    try {
      await Api.deleteProject(projectToDelete.id);
      await loadProjects();
      setProjectToDelete(null);
      setSuccess('Projet supprimé avec succès!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  return (
    <div className="tab-pane fade show active" id="projects-tab" role="tabpanel">
      <div className="mb-4">
        <button 
          className="btn btn-success"
          onClick={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
        >
          ➕ Ajouter un projet
        </button>
      </div>

      <AdminModal
        isOpen={showForm}
        title={editingProject ? 'Modifier un projet' : 'Ajouter un projet'}
        onClose={handleCloseForm}
      >
        <ProjectForm 
          project={editingProject}
          onSubmit={editingProject ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
        />
      </AdminModal>

      <ConfirmDeleteModal
        isOpen={!!projectToDelete}
        title="Supprimer le projet"
        message={projectToDelete ? `Voulez-vous vraiment supprimer « ${projectToDelete.title} » ?` : ''}
        onConfirm={handleDelete}
        onCancel={() => setProjectToDelete(null)}
      />

      <ProjectList 
        projects={projects}
        onEdit={handleEdit}
        onDelete={(project) => setProjectToDelete(project)}
      />
    </div>
  );
}
