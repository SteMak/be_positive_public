package main

import (
	"fmt"
	"os"

	"github.com/SteMak/be_positive/server_side/structs"
	shell "github.com/ipfs/go-ipfs-api"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	sh         *shell.Shell
	DB         *gorm.DB
	ContractID string

	err error
)

func main() {
	dsn := fmt.Sprintf("host=localhost user=%s password=%s dbname=%s port=57565 sslmode=disable", os.Getenv("POSTGRES_USER"), os.Getenv("POSTGRES_PASSWORD"), os.Getenv("POSTGRES_DB"))
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Printf("ERROR: trouble with opening database (%s)\n", err.Error())
		return
	}

	ContractID = os.Getenv("CONTRACT_NAME")

	IpfsPort := os.Getenv("IPFS_PORT")

	sh = shell.NewShell("localhost:" + IpfsPort)

	tokens := []*structs.TokenDB{}
	DB.Table("tokens").Select("id").Scan(&tokens)

	for _, token := range tokens {
		err = sh.Pin((*token).TokenID)
		if err != nil {
			fmt.Printf("ERROR while pinning (%s) occured (%s)\n", (*token).TokenID, err.Error())
		}
	}

	fmt.Println("IPFS actualized!")
}
