import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { useToast } from '../components/common/Toast';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

interface User {
  id: string;
  email: string;
  permissions: {
    pages: Record<string, boolean>;
    features: Record<string, boolean>;
  };
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (email: string, password: string) => Promise<void>;
}

function AddUserModal({ isOpen, onClose, onAdd }: AddUserModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onAdd(email, password);
      setEmail('');
      setPassword('');
      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Neuen Nutzer hinzufügen"
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Abbrechen</Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>Nutzer erstellen</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="E-Mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          error={error}
        />
        <Input
          label="Passwort"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          helperText="Mindestens 6 Zeichen"
        />
      </form>
    </Modal>
  );
}

export function Administration() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showToast } = useToast();

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase.from('app_users').select('*').order('email');
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      showToast({ type: 'error', message: 'Fehler beim Laden der Nutzer' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (email: string, password: string) => {
    try {
      await axios.post(`${API_URL}/users`, { email, password });
      showToast({ type: 'success', message: 'Nutzer erfolgreich erstellt' });
      await loadUsers();
    } catch (error: any) {
      console.error('Error adding user:', error.response?.data?.error || error.message || error.toString());
      throw new Error(error.response?.data?.error || error.message || 'Fehler beim Erstellen des Nutzers');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Administration</h1>
      <Button variant="primary" icon={<Plus />} onClick={() => setShowAddModal(true)}>Nutzer hinzufügen</Button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>

      <AddUserModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddUser} />
    </div>
  );
}
