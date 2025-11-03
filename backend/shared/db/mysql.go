package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"sync"

	_ "github.com/go-sql-driver/mysql"
)

const (
	DBProvider = "mysql"
)

type MySQLConfig struct {
	User   string
	Passwd string
	Host   string
	Port   string
	DBName string
}

func newMySQLDefaultConfig() *MySQLConfig {
	host := os.Getenv("MY_SQL_HOST")
	if os.Getenv("DOCKER_ENV") == "true" {
		host = "mysql"
	}

	return &MySQLConfig{
		User:   os.Getenv("MYSQL_USER"),
		Passwd: os.Getenv("MYSQL_PASSWORD"),
		Host:   host,
		Port:   os.Getenv("MY_SQL_PORT"),
		DBName: os.Getenv("MYSQL_DATABASE"),
	}
}

func formDSNFromConfig(config *MySQLConfig) string {
	host := config.Host
	if host == "" {
		host = "127.0.0.1"
	}
	port := config.Port
	if port == "" {
		port = "3306"
	}
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&charset=utf8mb4&loc=Local",
		config.User, config.Passwd, host, port, config.DBName)
}

var (
	db   *sql.DB
	once sync.Once
)

func NewMySQLDatabase() (*sql.DB, error) {
	var err error
	once.Do(func() {
		dsn := formDSNFromConfig(newMySQLDefaultConfig())
		db, err = sql.Open(DBProvider, dsn)
		if err != nil {
			err = fmt.Errorf("sql.Open error: %w", err)
			return
		}

		if pingErr := db.Ping(); pingErr != nil {
			err = fmt.Errorf("failed to ping db: %w", pingErr)
			return
		}

		log.Printf("Successfully connected to MySQL at %s:%s/%s",
			newMySQLDefaultConfig().Host,
			newMySQLDefaultConfig().Port,
			newMySQLDefaultConfig().DBName)
	})

	if err != nil {
		return nil, err
	}
	return db, nil
}
