package main

import (
	"fmt"
	"log"
	db2 "main/shared/db"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load("./cmd/.env"); err != nil {
		log.Println("No .env file found, using system env")
	}

	db, err := db2.NewMySQLDatabase()

	if err != nil {
		log.Fatal(err)
	}

	rows, err := db.Query(fmt.Sprintf("SELECT user_id, last_name FROM %v", db2.UsersCollection))
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id string
		var first_name string

		if err := rows.Scan(&id, &first_name); err != nil {
			log.Fatal(err)
		}

		log.Printf("Actor: id=%s, name=%s", id, first_name)
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}

}
