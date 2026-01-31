package main

import (
	"syscall/js"
)

func registerCallbacks() {
	js.Global().Set("argon2id", js.FuncOf(argon2id))
	js.Global().Set("bcryptHash", js.FuncOf(bcryptHash))
}

func main() {
	registerCallbacks()
	select{}
}