package db

import (
    "bufio"
    "database/sql"
    "errors"
    "fmt"
    "io/fs"
    "os"
    "path/filepath"
    "sort"
    "strings"
    "time"
)

const migrationsTable = "schema_migrations"

// RunMigrations выполняет все .up.sql миграции из указанной директории, которые ещё не применены
func RunMigrations(database *sql.DB, migrationsDir string) error {
    if database == nil {
        return errors.New("nil db")
    }

    if err := ensureMigrationsTable(database); err != nil {
        return fmt.Errorf("ensure migrations table: %w", err)
    }

    files, err := readMigrationFiles(migrationsDir, ".up.sql")
    if err != nil {
        return fmt.Errorf("read migration files: %w", err)
    }

    for _, f := range files {
        applied, err := isApplied(database, f)
        if err != nil {
            return fmt.Errorf("check applied %s: %w", f, err)
        }
        if applied {
            continue
        }

        content, err := os.ReadFile(filepath.Join(migrationsDir, f))
        if err != nil {
            return fmt.Errorf("read file %s: %w", f, err)
        }

        if err := execSQLStatements(database, string(content)); err != nil {
            return fmt.Errorf("execute migration %s: %w", f, err)
        }

        if err := markApplied(database, f); err != nil {
            return fmt.Errorf("mark applied %s: %w", f, err)
        }
    }
    return nil
}

func ensureMigrationsTable(db *sql.DB) error {
    q := `CREATE TABLE IF NOT EXISTS ` + migrationsTable + ` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
    _, err := db.Exec(q)
    return err
}

func readMigrationFiles(dir string, suffix string) ([]string, error) {
    entries := make([]string, 0)
    walkFn := func(path string, d fs.DirEntry, err error) error {
        if err != nil {
            return err
        }
        if d.IsDir() {
            return nil
        }
        name := d.Name()
        if strings.HasSuffix(name, suffix) {
            entries = append(entries, name)
        }
        return nil
    }
    if err := filepath.WalkDir(dir, walkFn); err != nil {
        return nil, err
    }
    sort.Strings(entries)
    return entries, nil
}

func isApplied(db *sql.DB, name string) (bool, error) {
    var count int
    err := db.QueryRow("SELECT COUNT(1) FROM "+migrationsTable+" WHERE name = ?", name).Scan(&count)
    if err != nil {
        return false, err
    }
    return count > 0, nil
}

func markApplied(db *sql.DB, name string) error {
    _, err := db.Exec("INSERT INTO "+migrationsTable+" (name, applied_at) VALUES (?, ?)", name, time.Now())
    return err
}

// execSQLStatements выполняет SQL по одному выражению за раз, разделяя по ';'
// Это избегает необходимости включать multiStatements в DSN
func execSQLStatements(db *sql.DB, sqlContent string) error {
    scanner := bufio.NewScanner(strings.NewReader(sqlContent))
    scanner.Buffer(make([]byte, 0, 1024*1024), 1024*1024)

    var builder strings.Builder
    for scanner.Scan() {
        line := scanner.Text()
        // пропускаем комментарии -- и пустые строки
        trimmed := strings.TrimSpace(line)
        if strings.HasPrefix(trimmed, "--") || trimmed == "" {
            continue
        }
        builder.WriteString(line)
        builder.WriteString("\n")
        if strings.Contains(line, ";") {
            statement := strings.TrimSpace(builder.String())
            // убираем конечную ';'
            statement = strings.TrimSuffix(statement, ";")
            statement = strings.TrimSpace(statement)
            if statement != "" {
                if _, err := db.Exec(statement); err != nil {
                    return err
                }
            }
            builder.Reset()
        }
    }

    if err := scanner.Err(); err != nil {
        return err
    }

    // выполнить хвост без ';' (на случай последней строки без точки с запятой)
    rest := strings.TrimSpace(builder.String())
    if rest != "" {
        if _, err := db.Exec(rest); err != nil {
            return err
        }
    }
    return nil
}


