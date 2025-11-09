package utils

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"os"
)

var sessionSecret = []byte(os.Getenv("SECRET_KEY"))

func GenerateToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func HashToken(token string) string {
	mac := hmac.New(sha256.New, sessionSecret)
	mac.Write([]byte(token))
	return hex.EncodeToString(mac.Sum(nil))
}
