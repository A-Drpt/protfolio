import React, { useState, useEffect } from 'react';
import * as Api from '../api/client.js';
import { useAdmin } from './AdminDashboard.jsx';
import SkillForm from './SkillForm.jsx';
import SkillList from './SkillList.jsx';
import AdminModal from './AdminModal.jsx';
import ConfirmDeleteModal from './ConfirmDeleteModal.jsx';

/**
 * Tab Compétences du dashboard
 */
export default function SkillsTab() {
  const { setLoading, setError, setSuccess } = useAdmin();
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const data = await Api.getSkills();
      setSkills(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    setLoading(true);
    try {
      await Api.createSkill(data);
      await loadSkills();
      setShowForm(false);
      setSuccess('Compétence créée avec succès!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleUpdate = async (data) => {
    setLoading(true);
    try {
      await Api.updateSkill(editingSkill.id, data);
      await loadSkills();
      setShowForm(false);
      setEditingSkill(null);
      setSuccess('Compétence mise à jour avec succès!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete) return;
    setLoading(true);
    try {
      await Api.deleteSkill(skillToDelete.id);
      await loadSkills();
      setSkillToDelete(null);
      setSuccess('Compétence supprimée avec succès!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSkill(null);
  };

  return (
    <div className="tab-pane active fade show" id="skills-tab" role="tabpanel" aria-labelledby="skills-tab-button">
      <div className="mb-4">
        <button 
          className="btn btn-success"
          onClick={() => {
            setEditingSkill(null);
            setShowForm(true);
          }}
        >
          ➕ Ajouter une compétence
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="alert alert-info">Aucune compétence. Cliquez sur "Ajouter une compétence" pour en créer une.</div>
      ) : (
        <SkillList 
          skills={skills}
          onEdit={handleEdit}
          onDelete={(skill) => setSkillToDelete(skill)}
        />
      )}

      <AdminModal
        isOpen={showForm}
        title={editingSkill ? 'Modifier une compétence' : 'Ajouter une compétence'}
        onClose={handleCloseForm}
        size="modal-md"
      >
        <SkillForm 
          skill={editingSkill}
          onSubmit={editingSkill ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
        />
      </AdminModal>

      <ConfirmDeleteModal
        isOpen={!!skillToDelete}
        title="Supprimer la compétence"
        message={skillToDelete ? `Voulez-vous vraiment supprimer « ${skillToDelete.name} » ?` : ''}
        onConfirm={handleDelete}
        onCancel={() => setSkillToDelete(null)}
      />
    </div>
  );
}
