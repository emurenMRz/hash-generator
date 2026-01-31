package main

import (
	"encoding/base64"
	"syscall/js"

	"golang.org/x/crypto/argon2"
)

func argon2id(this js.Value, args []js.Value) interface{} {
	if len(args) < 6 {
		return js.ValueOf("")
	}
	password := args[0].String()
	saltB64 := args[1].String()
	timeCost := uint32(args[2].Int())
	memoryCost := uint32(args[3].Int()) // in KB
	parallelism := uint8(args[4].Int())
	keyLen := uint32(args[5].Int())

	salt, err := base64.StdEncoding.DecodeString(saltB64)
	if err != nil {
		return js.ValueOf("")
	}

	hash := argon2.IDKey([]byte(password), salt, timeCost, memoryCost, parallelism, keyLen)
	out := base64.StdEncoding.EncodeToString(hash)
	return js.ValueOf(out)
}
