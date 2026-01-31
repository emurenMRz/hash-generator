package main

import (
	"syscall/js"

	"golang.org/x/crypto/bcrypt"
)

func bcryptHash(this js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return js.ValueOf("")
	}
	password := []byte(args[0].String())
	cost := args[1].Int()
	hashed, err := bcrypt.GenerateFromPassword(password, cost)
	if err != nil {
		return js.ValueOf("")
	}
	return js.ValueOf(string(hashed))
}
