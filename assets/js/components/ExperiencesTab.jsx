import React, { useState, useEffect } from 'react';
import * as Api from '../api/client.js';
import { useAdmin } from './AdminDashboard.jsx';
import ExperienceForm from './ExperienceForm.jsx';
import ExperienceList from './ExperienceList.jsx';
import AdminModal from './AdminModal.jsx';
import ConfirmDeleteModal from './ConfirmDeleteModal.jsx';

/**
 * Tab Expériences du dashboard
 */
export default function ExperiencesTab() {
  const { setLoading, setError, setSuccess } = useAdmin();
  const [experiences, setExperiences] = useState([]);
  const [editingExperience, setEditingExperience] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);

  useEffect(() => {
    loadExperiences();
  }, []);

  const loadExperiences = async () => {
    setLoading(true);
    try {
      const data = await Api.getExperiences();
      setExperiences(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    setLoading(true);
    try {
      await Api.createExperience(data);
      await loadExperiences();
      setShowForm(false);
      setSuccess('Expérience créée avec succès!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);
    setShowForm(true);
  };

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      await Api.updateExperience(editingExperience.id, data);
      await loadExperiences();
      setShowForm(false);
      setEditingExperience(null);
      setSuccess('Expérience mise à jour avec succès!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!experienceToDelete) return;
    setLoading(true);
    try {
      await Api.deleteExperience(experienceToDelete.id);
      await loadExperiences();
      setExperienceToDelete(null);
      setSuccess('Expérience supprimée avec succès!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExperience(null);
  };

  return (
    <div className="tab-pane fade" id="experiences-tab" role="tabpanel">
      <div className="mb-4">
        <button 
          className="btn-admin-add"
          onClick={() => {
            setEditingExperience(null);
            setShowForm(true);
          }}
        >
          Ajouter une expérience
        </button>
      </div>

      <AdminModal
        isOpen={showForm}
        title={editingExperience ? 'Modifier une expérience' : 'Ajouter une expérience'}
        onClose={handleCloseForm}
      >
        <ExperienceForm 
          experience={editingExperience}
          onSubmit={editingExperience ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
        />
      </AdminModal>

      <ConfirmDeleteModal
        isOpen={!!experienceToDelete}
        title="Supprimer l'expérience"
        message={experienceToDelete ? `Voulez-vous vraiment supprimer « ${experienceToDelete.title} » ?` : ''}
        onConfirm={handleDelete}
        onCancel={() => setExperienceToDelete(null)}
      />

      <ExperienceList 
        experiences={experiences}
        onEdit={handleEdit}
        onDelete={(experience) => setExperienceToDelete(experience)}
      />
    </div>
  );
}
