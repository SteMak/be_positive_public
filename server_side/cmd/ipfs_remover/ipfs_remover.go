package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/SteMak/be_positive/server_side/utils"
	"github.com/gorilla/mux"
	shell "github.com/ipfs/go-ipfs-api"
)

var (
	sh         *shell.Shell
	ContractID string
)

func main() {
	ListenOnPort := os.Getenv("IPFS_REMOVER")
	IpfsPort := os.Getenv("IPFS_PORT")

	sh = shell.NewShell("localhost:" + IpfsPort)

	ContractID = os.Getenv("CONTRACT_NAME")

	Router := mux.NewRouter()
	Router.Path("/nft_remove/{hash}").HandlerFunc(RemoveNFT)
	Router.NotFoundHandler = http.HandlerFunc(func(_ http.ResponseWriter, _ *http.Request) {})
	http.Handle("/", Router)

	fmt.Printf("Server is listening on http://localhost:%s ...\n", ListenOnPort)
	err := http.ListenAndServe(":"+ListenOnPort, nil)
	if err != nil {
		fmt.Printf("ERROR: trouble with listening port (%s)\n", err.Error())
		return
	}
}

func RemoveNFT(response http.ResponseWriter, request *http.Request) {
	vars := mux.Vars(request)
	hash := vars["hash"]

	empty, err := utils.IsEmptyToken(ContractID, hash)
	if err != nil {
		fmt.Printf("ERROR: trouble with getting token (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with getting token (%s)\n", err.Error())
		return
	}

	if !empty {
		fmt.Println("ERROR: token exist in blockchain")
		fmt.Fprintln(response, "ERROR: token exist in blockchain")
		return
	}

	sh.Unpin(hash)
	if err != nil {
		fmt.Printf("ERROR: trouble with uppinning from ipfs (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with uppinning from ipfs (%s)\n", err.Error())
		return
	}

	fmt.Fprintf(response, "200 OK\n")
}
