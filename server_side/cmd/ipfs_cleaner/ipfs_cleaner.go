package main

import (
	"fmt"
	"os"

	"github.com/SteMak/be_positive/server_side/utils"
	shell "github.com/ipfs/go-ipfs-api"
)

var (
	sh         *shell.Shell
	ContractID string
)

func main() {
	IpfsPort := os.Getenv("IPFS_PORT")

	sh = shell.NewShell("localhost:" + IpfsPort)

	ContractID = os.Getenv("CONTRACT_NAME")

	pins, err := sh.Pins()
	if err != nil {
		fmt.Printf("ERROR: trouble with getting pins (%s)\n", err.Error())
		return
	}

	for hash, pin := range pins {
		if pin.Type == "recursive" {
			RemoveNFT(hash)
		}
	}

	fmt.Println("IPFS cleaned!")
}

func RemoveNFT(hash string) error {
	empty, err := utils.IsEmptyToken(ContractID, hash)
	if err != nil {
		fmt.Printf("ERROR: trouble with getting token (%s) (%s)\n", hash, err.Error())
		return err
	}

	if !empty {
		return nil
	}

	sh.Unpin(hash)
	if err != nil {
		fmt.Printf("ERROR: trouble with uppinning (%s) from ipfs (%s)\n", hash, err.Error())
		return err
	}

	return nil
}
