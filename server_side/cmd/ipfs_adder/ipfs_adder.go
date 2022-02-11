package main

import (
	"bytes"
	"fmt"
	"io"
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
	ListenOnPort := os.Getenv("IPFS_ADDER")
	IpfsPort := os.Getenv("IPFS_PORT")

	sh = shell.NewShell("localhost:" + IpfsPort)

	ContractID = os.Getenv("CONTRACT_NAME")

	Router := mux.NewRouter()
	Router.Path("/nft_create/{hash}").Methods("POST").HandlerFunc(CreateNFT)
	Router.Path("/nft_hash").Methods("POST").HandlerFunc(GetHash)
	Router.NotFoundHandler = http.HandlerFunc(func(_ http.ResponseWriter, _ *http.Request) {})
	http.Handle("/", Router)

	fmt.Printf("Server is listening on http://localhost:%s ...\n", ListenOnPort)
	err := http.ListenAndServe(":"+ListenOnPort, nil)
	if err != nil {
		fmt.Printf("ERROR: trouble with listening port (%s)\n", err.Error())
		return
	}
}

func CreateNFT(response http.ResponseWriter, request *http.Request) {
	vars := mux.Vars(request)
	hash := vars["hash"]

	file, _, err := request.FormFile("nft_file")
	if err != nil {
		fmt.Printf("ERROR: trouble with forming nft_file (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with forming nft_file (%s)\n", err.Error())
		return
	}

	var buf bytes.Buffer
	io.Copy(&buf, file)
	file.Close()

	if buf.Len() >= 2000000 {
		fmt.Printf("ERROR: file is too big (%d)\n", buf.Len())
		fmt.Fprintf(response, "ERROR: file is too big (%d)\n", buf.Len())
		return
	}

	_, err = utils.GetToken(ContractID, hash)
	if err != nil {
		fmt.Printf("ERROR: trouble with getting token (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with getting token (%s)\n", err.Error())
		return
	}

	cid, err := sh.Add(bytes.NewReader(buf.Bytes()), shell.OnlyHash(true))
	if err != nil {
		fmt.Printf("ERROR: trouble with getting ipfs hash (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with getting ipfs hash (%s)\n", err.Error())
		return
	}

	if cid != hash {
		fmt.Printf("ERROR: given hash not equal to computed (%s) != (%s)\n", cid, hash)
		fmt.Fprintf(response, "ERROR: given hash not equal to computed  (%s) != (%s)\n", cid, hash)
		return
	}

	_, err = sh.Add(bytes.NewReader(buf.Bytes()), shell.Pin(true))
	if err != nil {
		fmt.Printf("ERROR: trouble with pinning to ipfs (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with pinning to ipfs (%s)\n", err.Error())
		return
	}

	fmt.Fprintf(response, "200 OK\n")
}

func GetHash(response http.ResponseWriter, request *http.Request) {
	file, _, err := request.FormFile("nft_file")
	if err != nil {
		fmt.Printf("ERROR: trouble with forming nft_file (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with forming nft_file (%s)\n", err.Error())
		return
	}

	var buf bytes.Buffer
	io.Copy(&buf, file)
	file.Close()

	if buf.Len() >= 2000000 {
		fmt.Printf("ERROR: file is too big (%d)\n", buf.Len())
		fmt.Fprintf(response, "ERROR: file is too big (%d)\n", buf.Len())
		return
	}

	cid, err := sh.Add(bytes.NewReader(buf.Bytes()), shell.OnlyHash(true))
	if err != nil {
		fmt.Printf("ERROR: trouble with getting ipfs hash (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with getting ipfs hash (%s)\n", err.Error())
		return
	}

	fmt.Fprintf(response, "%s", cid)
}
