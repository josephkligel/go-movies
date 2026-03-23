package main

import (
	"backend/internal/repository"
	"backend/internal/repository/dbrepo"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
)

const port = 8081

type application struct {
	DSN          string
	Domain       string
	DB           repository.DatabaseRepo
	auth         Auth
	JWTSecret    string
	JWTIssuer    string
	JWTAudience  string
	CookieDomain string
	APIKey       string
}

func main() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Set application config
	var app application

	// read from command line
	flag.StringVar(&app.DSN, "dsn", os.Getenv("DB_URL"), "PostgreSQL connection string")
	flag.StringVar(&app.JWTSecret, "jwt-secret", os.Getenv("JWT_Secret"), "signing secret")
	flag.StringVar(&app.JWTIssuer, "jwt-issuer", os.Getenv("JWT_Issuer"), "signing issuer")
	flag.StringVar(&app.JWTAudience, "jwt-audience", os.Getenv("JWT_Audience"), "signing audience")
	flag.StringVar(&app.CookieDomain, "cookie-domain", os.Getenv("Cookie_Domain"), "cookie domain")
	flag.StringVar(&app.Domain, "domain", os.Getenv("Domain"), "domain")
	flag.StringVar(&app.APIKey, "api-key", os.Getenv("TMDB_API"), "api key")
	flag.Parse()

	// conntect to database
	conn, errapp := app.connectDB()
	if errapp != nil {
		log.Fatal(errapp)
	}
	app.DB = &dbrepo.PostgresDBRepo{DB: conn}
	defer app.DB.Connection().Close()

	app.auth = Auth{
		Issuer:        app.JWTIssuer,
		Audience:      app.JWTAudience,
		Secret:        app.JWTSecret,
		TokenExpiry:   time.Minute * 15,
		RefreshExpiry: time.Hour * 24,
		CookiePath:    "/",
		CookieName:    "__Host-refresh_token",
		CookieDomain:  app.CookieDomain,
	}

	log.Println("Starting server on port", port)

	// start web server
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), app.routes())
	if err != nil {
		log.Fatal(err)
	}
}
