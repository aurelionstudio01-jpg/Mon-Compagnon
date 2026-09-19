import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'mon_compagnon.db';

export const getDatabase = async () => {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  return db;
};

export const initDatabase = async () => {
  const db = await getDatabase();

  // Projets
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      color TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Personnages
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS characters (
      id TEXT PRIMARY KEY NOT NULL,
      project_id TEXT NOT NULL,
      name TEXT NOT NULL,
      age TEXT,
      appearance TEXT,
      personality TEXT,
      history TEXT,
      relations TEXT,
      fears TEXT,
      goals TEXT,
      secrets TEXT,
      powers TEXT,
      evolution TEXT,
      notes TEXT,
      custom_fields TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  // Éléments d'univers
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS world_elements (
      id TEXT PRIMARY KEY NOT NULL,
      project_id TEXT NOT NULL,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  // Idées
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY NOT NULL,
      project_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      status TEXT NOT NULL DEFAULT 'nouvelle',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
    );
  `);

  // Journal
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT NOT NULL,
      content TEXT NOT NULL,
      mood TEXT,
      events TEXT,
      ideas TEXT,
      goals TEXT,
      memories TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Mémoire permanente
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS memory_items (
      id TEXT PRIMARY KEY NOT NULL,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      category TEXT,
      project_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Brouillons / scènes
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS drafts (
      id TEXT PRIMARY KEY NOT NULL,
      project_id TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'brouillon',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );
  `);

  // Messages de chat (historique local)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      mode TEXT NOT NULL DEFAULT 'compagnon',
      project_id TEXT,
      character_id TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Paramètres du compagnon
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  // Index pour la recherche
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_characters_project ON characters(project_id);
    CREATE INDEX IF NOT EXISTS idx_world_project ON world_elements(project_id);
    CREATE INDEX IF NOT EXISTS idx_ideas_project ON ideas(project_id);
    CREATE INDEX IF NOT EXISTS idx_drafts_project ON drafts(project_id);
    CREATE INDEX IF NOT EXISTS idx_journal_date ON journal_entries(date);
  `);

  console.log('Base de données Mon Compagnon initialisée');
  return db;
};
