package main

import (
	"account/pkg/accounter"
)

func main() {
	acc := accounter.NewAccounter()
	acc.Run()
}
