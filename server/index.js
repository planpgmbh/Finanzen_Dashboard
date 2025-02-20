import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Nutzer anlegen
app.post('/api/users', async (req, res) => {
  const { email, password, role } = req.body;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { role },
  });

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json(data);
});

// Nutzer löschen (optional)
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).send('User deleted');
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server läuft auf http://localhost:${PORT}`));