package main

import (
	"crypto/ed25519"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/SteMak/be_positive/server_side/structs"
	"github.com/SteMak/be_positive/server_side/utils"
	"github.com/btcsuite/btcutil/base58"
	"github.com/gorilla/mux"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB         *gorm.DB
	ContractID string

	err error
)

func main() {
	ListenOnPort := os.Getenv("DB_VIEWER")

	dsn := fmt.Sprintf("host=localhost user=%s password=%s dbname=%s port=57565 sslmode=disable", os.Getenv("POSTGRES_USER"), os.Getenv("POSTGRES_PASSWORD"), os.Getenv("POSTGRES_DB"))
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Printf("ERROR: trouble with opening database (%s)\n", err.Error())
		return
	}

	ContractID = os.Getenv("CONTRACT_NAME")

	Router := mux.NewRouter()
	Router.Path("/token/{id}").HandlerFunc(ViewToken)
	Router.Path("/user/{id}").HandlerFunc(ViewUser)
	Router.Path("/user/").HandlerFunc(func(response http.ResponseWriter, _ *http.Request) { fmt.Fprintln(response, "null") })
	Router.Path("/tokens/{safe}/{order}-{direction}/{selleble_only}/{offset}-{limit}").HandlerFunc(ViewTokens)
	Router.Path("/owner_tokens/{mode}/{own_crt}/{bad_status}/{order}-{direction}/{selleble_only}/{offset}-{limit}").HandlerFunc(ViewOwnerTokens)
	Router.Path("/report_speech/{account}/{token}").HandlerFunc(ReportSpeech)
	Router.Path("/report_offence/{account}/{token}").HandlerFunc(ReportOffence)
	Router.NotFoundHandler = http.HandlerFunc(func(_ http.ResponseWriter, _ *http.Request) {})
	http.Handle("/", Router)

	fmt.Printf("Server is listening on http://localhost:%s ...\n", ListenOnPort)
	err = http.ListenAndServe(":"+ListenOnPort, nil)
	if err != nil {
		fmt.Printf("ERROR: trouble with listening port (%s)\n", err.Error())
		return
	}
}

func ViewToken(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("Access-Control-Allow-Origin", "*")
	vars := mux.Vars(request)
	id := vars["id"]

	tokens := []structs.TokenDB{}
	DB.Table("tokens").Where("id = ?", id).Scan(&tokens)

	if len(tokens) == 0 {
		fmt.Fprintln(response, "null")
		return
	}

	buffer, err := json.Marshal(tokens[0])
	if err != nil {
		fmt.Printf("ERROR: trouble with marshalling struct (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with marshalling struct (%s)\n", err.Error())
		return
	}

	fmt.Fprintf(response, "%s\n", string(buffer))
}

func ViewUser(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("Access-Control-Allow-Origin", "*")
	vars := mux.Vars(request)
	id := vars["id"]

	users := []structs.UserDB{}
	DB.Table("users").Where("id = ?", id).Scan(&users)

	if len(users) == 0 {
		fmt.Fprintln(response, "null")
		return
	}

	buffer, err := json.Marshal(users[0])
	if err != nil {
		fmt.Printf("ERROR: trouble with marshalling struct (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with marshalling struct (%s)\n", err.Error())
		return
	}

	fmt.Fprintf(response, "%s\n", string(buffer))
}

func ViewTokens(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("Access-Control-Allow-Origin", "*")
	vars := mux.Vars(request)
	order := vars["order"]
	direction := vars["direction"]
	selleble := vars["selleble_only"]
	safe := vars["safe"]

	offset, err := strconv.ParseUint(vars["offset"], 10, 64)
	if err != nil {
		fmt.Printf("ERROR: trouble with parsing number (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with parsing number (%s)\n", err.Error())
		return
	}
	limit, err := strconv.ParseUint(vars["limit"], 10, 64)
	if err != nil {
		fmt.Printf("ERROR: trouble with parsing number (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with parsing number (%s)\n", err.Error())
		return
	}

	if limit == 0 || limit > 101 {
		fmt.Println("ERROR: limit bounds broken")
		fmt.Fprintln(response, "ERROR: limit bounds broken")
		return
	}
	if direction != "DESC" && direction != "ASC" {
		fmt.Println("ERROR: wrong sort direction")
		fmt.Fprintln(response, "ERROR: wrong sort direction")
		return
	}
	if order != "title" && order != "created_at" && order != "updated_at" && order != "transferred_at" && order != "price" {
		fmt.Println("ERROR: wrong sort order")
		fmt.Fprintln(response, "ERROR: wrong sort order")
		return
	}
	if selleble != "false" && selleble != "true" {
		fmt.Println("ERROR: wrong selleble param")
		fmt.Fprintln(response, "ERROR: wrong selleble param")
		return
	}
	if safe != "false" && safe != "true" {
		fmt.Println("ERROR: wrong safe param")
		fmt.Fprintln(response, "ERROR: wrong safe param")
		return
	}

	result := []structs.TokenDB{}
	ResultDB := DB.Table("tokens")
	if safe == "true" {
		ResultDB = ResultDB.Where("status = ? AND reports_offence = ? OR status = ?", "Ok", " ", "SuperOk")
	} else {
		ResultDB = ResultDB.Where("status = ? OR status = ?", "Ok", "SuperOk")
	}

	if selleble == "true" {
		ResultDB = ResultDB.Where("selleble = true")
	}

	if order == "title" || order == "price" {
		ResultDB = ResultDB.Order(order + " " + direction + ", updated_at " + direction)
	} else if order == "created_at" || order == "updated_at" || order == "transferred_at" {
		ResultDB = ResultDB.Order(order + " " + direction)
	}

	ResultDB.Limit(int(limit)).Offset(int(offset)).Scan(&result)
	buffer, err := json.Marshal(result)
	if err != nil {
		fmt.Printf("ERROR: trouble with marshalling struct (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with marshalling struct (%s)\n", err.Error())
		return
	}

	fmt.Fprintf(response, "%s\n", string(buffer))
}

func ViewOwnerTokens(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("Access-Control-Allow-Origin", "*")
	vars := mux.Vars(request)
	order := vars["order"]
	direction := vars["direction"]
	selleble := vars["selleble_only"]
	mode := vars["mode"]
	own_crt := vars["own_crt"]
	bad_status := vars["bad_status"]

	offset, err := strconv.ParseUint(vars["offset"], 10, 64)
	if err != nil {
		fmt.Printf("ERROR: trouble with parsing number (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with parsing number (%s)\n", err.Error())
		return
	}
	limit, err := strconv.ParseUint(vars["limit"], 10, 64)
	if err != nil {
		fmt.Printf("ERROR: trouble with parsing number (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with parsing number (%s)\n", err.Error())
		return
	}

	if limit == 0 || limit > 101 {
		fmt.Println("ERROR: limit bounds broken")
		fmt.Fprintln(response, "ERROR: limit bounds broken")
		return
	}
	if direction != "DESC" && direction != "ASC" {
		fmt.Println("ERROR: wrong sort direction")
		fmt.Fprintln(response, "ERROR: wrong sort direction")
		return
	}
	if order != "title" && order != "created_at" && order != "updated_at" && order != "transferred_at" && order != "price" {
		fmt.Println("ERROR: wrong sort order")
		fmt.Fprintln(response, "ERROR: wrong sort order")
		return
	}
	if selleble != "false" && selleble != "true" {
		fmt.Println("ERROR: wrong selleble param")
		fmt.Fprintln(response, "ERROR: wrong selleble param")
		return
	}
	if mode != "own" && mode != "crt" {
		fmt.Println("ERROR: wrong mode param")
		fmt.Fprintln(response, "ERROR: wrong mode param")
		return
	}
	if bad_status != "false" && bad_status != "true" {
		fmt.Println("ERROR: wrong bad_status param")
		fmt.Fprintln(response, "ERROR: wrong bad_status param")
		return
	}

	result := []structs.TokenDB{}
	ResultDB := DB.Table("tokens")
	if mode == "own" {
		ResultDB = ResultDB.Where("owner_id = ?", own_crt)
	} else {
		ResultDB = ResultDB.Where("creator = ?", own_crt)
	}

	if selleble == "true" {
		ResultDB = ResultDB.Where("selleble = true")
	}
	if bad_status == "true" {
		ResultDB = ResultDB.Where("status = ? OR status = ?", "LockedToTransfer", "LockedToListen")
	} else {
		ResultDB = ResultDB.Where("status = ? OR status = ?", "Ok", "SuperOk")
	}

	if order == "title" || order == "price" {
		ResultDB = ResultDB.Order(order + " " + direction + ", updated_at " + direction)
	} else if order == "created_at" || order == "updated_at" || order == "transferred_at" {
		ResultDB = ResultDB.Order(order + " " + direction)
	}

	ResultDB.Limit(int(limit)).Offset(int(offset)).Scan(&result)
	buffer, err := json.Marshal(result)
	if err != nil {
		fmt.Printf("ERROR: trouble with marshalling struct (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: trouble with marshalling struct (%s)\n", err.Error())
		return
	}

	fmt.Fprintf(response, "%s\n", string(buffer))
}

func ReportSpeech(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("Access-Control-Allow-Origin", "*")
	vars := mux.Vars(request)
	account := vars["account"]
	token := vars["token"]

	var signed structs.ReportRequest

	err := json.NewDecoder(request.Body).Decode(&signed)
	if err != nil {
		fmt.Printf("ERROR: cannot decode body (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: cannot decode body (%s)\n", err.Error())
		return
	}
	if signed.KeyType == "ed25519" {
		if !ed25519.Verify(signed.PublicKey, signed.Message, signed.Signature) {
			fmt.Printf("ERROR: wrong encoded data (%s)\n", "ed25519.Verify failed")
			fmt.Fprintf(response, "ERROR: wrong encoded data (%s)\n", "ed25519.Verify failed")
			return
		}

		if string(signed.Message) != token {
			fmt.Printf("ERROR: wrong encoded data (%s) != (%s)\n", string(signed.Message), token)
			fmt.Fprintf(response, "ERROR: wrong encoded data (%s) != (%s)\n", string(signed.Message), token)
			return
		}

		accounts, err := utils.GetAccounts("ed25519:" + base58.Encode(signed.PublicKey))
		if err != nil {
			fmt.Printf("ERROR: unable get account by the key (%s)\n", err.Error())
			fmt.Fprintf(response, "ERROR: unable get account by the key (%s)\n", err.Error())
			return
		}

		if !utils.Contains(accounts, account) {
			fmt.Printf("ERROR: unable to found in allowed keys (%s)\n", account)
			fmt.Fprintf(response, "ERROR: unable to found in allowed keys (%s)\n", account)
			return
		}
	} else {
		fmt.Printf("ERROR: unknown key type (%s)\n", signed.KeyType)
		fmt.Fprintf(response, "ERROR: unknown key type (%s)\n", signed.KeyType)
		return
	}

	token_var := []structs.TokenDB{}
	row := DB.Table("tokens").Where("id = ?", token).Scan(&token_var)
	if len(token_var) == 0 {
		fmt.Printf("ERROR: cannot find the row (%s)\n", token)
		fmt.Fprintf(response, "ERROR: cannot find the row (%s)\n", token)
		return
	}

	if strings.Contains(token_var[0].ReportsSpeech, " "+account+" ") {
		fmt.Printf("ERROR: already reported speech for (%s) by (%s)\n", token, account)
		fmt.Fprintf(response, "ERROR: already reported speech for (%s) by (%s)\n", token, account)
		return
	}

	row.Update("reports_speech", token_var[0].ReportsSpeech+account+" ")
	fmt.Fprintf(response, "Done")
}

func ReportOffence(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("Access-Control-Allow-Origin", "*")
	vars := mux.Vars(request)
	account := vars["account"]
	token := vars["token"]

	var signed structs.ReportRequest

	err := json.NewDecoder(request.Body).Decode(&signed)
	if err != nil {
		fmt.Printf("ERROR: cannot decode body (%s)\n", err.Error())
		fmt.Fprintf(response, "ERROR: cannot decode body (%s)\n", err.Error())
		return
	}
	if signed.KeyType == "ed25519" {
		if !ed25519.Verify(signed.PublicKey, signed.Message, signed.Signature) {
			fmt.Printf("ERROR: wrong encoded data (%s)\n", "ed25519.Verify failed")
			fmt.Fprintf(response, "ERROR: wrong encoded data (%s)\n", "ed25519.Verify failed")
			return
		}

		if string(signed.Message) != token {
			fmt.Printf("ERROR: wrong encoded data (%s) != (%s)\n", string(signed.Message), token)
			fmt.Fprintf(response, "ERROR: wrong encoded data (%s) != (%s)\n", string(signed.Message), token)
			return
		}

		accounts, err := utils.GetAccounts("ed25519:" + base58.Encode(signed.PublicKey))
		if err != nil {
			fmt.Printf("ERROR: unable get account by the key (%s)\n", err.Error())
			fmt.Fprintf(response, "ERROR: unable get account by the key (%s)\n", err.Error())
			return
		}

		if !utils.Contains(accounts, account) {
			fmt.Printf("ERROR: unable to found in allowed keys (%s)\n", account)
			fmt.Fprintf(response, "ERROR: unable to found in allowed keys (%s)\n", account)
			return
		}
	} else {
		fmt.Printf("ERROR: unknown key type (%s)\n", signed.KeyType)
		fmt.Fprintf(response, "ERROR: unknown key type (%s)\n", signed.KeyType)
		return
	}

	token_var := []structs.TokenDB{}
	row := DB.Table("tokens").Where("id = ?", token).Scan(&token_var)
	if len(token_var) == 0 {
		fmt.Printf("ERROR: cannot find the row (%s)\n", token)
		fmt.Fprintf(response, "ERROR: cannot find the row (%s)\n", token)
		return
	}

	if strings.Contains(token_var[0].ReportsOffence, " "+account+" ") {
		fmt.Printf("ERROR: already reported offence for (%s) by (%s)\n", token, account)
		fmt.Fprintf(response, "ERROR: already reported offence for (%s) by (%s)\n", token, account)
		return
	}

	row.Update("reports_offence", token_var[0].ReportsOffence+account+" ")
	fmt.Fprintf(response, "Done")
}
