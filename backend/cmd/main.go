package main

import (
	"context"
	"log"
	order "main/services/order-service/cmd"
	user "main/services/user-service/cmd"
	db2 "main/shared/db"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	if err := godotenv.Load("./cmd/.env"); err != nil {
		log.Println("No .env file found, using system env")
	}

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	db, err := db2.NewMySQLDatabase()

	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()

	userMux := user.NewHandler(db)

	orderMux := order.NewHandler(db)

	mux.Handle("/user/", http.StripPrefix("/user", userMux))
	mux.Handle("/orders/", http.StripPrefix("/orders", orderMux))

	httpAddr := os.Getenv("HTTP_ADDR")
	if httpAddr == "" {
		httpAddr = ":8080"
	}

	handler := c.Handler(mux)

	server := &http.Server{
		Addr:    httpAddr,
		Handler: handler,
	}

	serverErrors := make(chan error, 1)

	go func() {
		log.Printf("listen on %v", httpAddr)
		serverErrors <- server.ListenAndServe()
	}()

	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	select {
	case err := <-serverErrors:
		log.Printf("Error starting the server: %v", err)

	case sig := <-shutdown:
		log.Printf("Server is shutting down due to %v signal", sig)

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		if err := server.Shutdown(ctx); err != nil {
			log.Printf("Could not stop the server gracefully: %v", err)
			server.Close()
		}
	}
}
