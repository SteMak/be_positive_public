package utils

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"

	"github.com/SteMak/be_positive/server_side/structs"
)

func GetToken(ContractID, TokenID string) (structs.Token, error) {
	json_data, err := json.Marshal(
		structs.BlockchainRequest{
			Contract: ContractID,
			Method:   "nft_token",
			Params:   structs.BlockchainRequestParams{TokenID: TokenID},
			RpcNode:  "https://rpc.testnet.near.org",
		})
	if err != nil {
		return structs.Token{}, err
	}
	resp, err := http.Post("https://rest.nearapi.org/view", "application/json", bytes.NewBuffer(json_data))
	if err != nil || resp.Status != "200 OK" || resp.Header.Get("Content-Length") == "0" {
		if err != nil {
		} else if resp.Status != "200 OK" {
			err = errors.New(resp.Status + " != 200 OK")
		} else {
			err = errors.New("Content-Length == 0")
		}
		return structs.Token{}, err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return structs.Token{}, err
	}

	var token structs.Token
	if err := json.Unmarshal(body, &token); err != nil {
		return structs.Token{}, err
	}

	return token, nil
}

func GetEvents(ContractID, from string, limit uint64) (structs.Events, error) {
	json_data, err := json.Marshal(
		structs.BlockchainRequest{
			Contract: ContractID,
			Method:   "view_events",
			Params: structs.BlockchainRequestParams{
				From:  from,
				Limit: limit,
			},
			RpcNode: "https://rpc.testnet.near.org",
		})
	if err != nil {
		return structs.Events{}, err
	}
	resp, err := http.Post("https://rest.nearapi.org/view", "application/json", bytes.NewBuffer(json_data))
	if err != nil || resp.Status != "200 OK" || resp.Header.Get("Content-Length") == "0" {
		if err != nil {
		} else if resp.Status != "200 OK" {
			err = errors.New(resp.Status + " != 200 OK")
		} else {
			err = errors.New("Content-Length == 0")
		}
		return structs.Events{}, err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return structs.Events{}, err
	}

	var events structs.Events
	if err := json.Unmarshal(body, &events); err != nil {
		return structs.Events{}, err
	}

	return events, nil
}

func IsEmptyToken(ContractID, TokenID string) (bool, error) {
	json_data, err := json.Marshal(
		structs.BlockchainRequest{
			Contract: ContractID,
			Method:   "nft_token",
			Params:   structs.BlockchainRequestParams{TokenID: TokenID},
			RpcNode:  "https://rpc.testnet.near.org",
		})
	if err != nil {
		return false, err
	}
	resp, err := http.Post("https://rest.nearapi.org/view", "application/json", bytes.NewBuffer(json_data))

	if err != nil || resp.Status != "200 OK" {
		if err != nil {
		} else if resp.Status != "200 OK" {
			err = errors.New(resp.Status + " != 200 OK")
		}
		return false, err
	}

	if resp.Header.Get("Content-Length") == "0" {
		return true, nil
	}

	return false, nil
}

func GetAccounts(PublicKey string) ([]string, error) {
	resp, err := http.Get("https://helper.testnet.near.org/publicKey/" + PublicKey + "/accounts")
	if err != nil || resp.Status != "200 OK" || resp.Header.Get("Content-Length") == "0" {
		if err != nil {
		} else if resp.Status != "200 OK" {
			err = errors.New(resp.Status + " != 200 OK")
		} else {
			err = errors.New("Content-Length == 0")
		}
		return []string{}, err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return []string{}, err
	}

	var accounts []string
	if err := json.Unmarshal(body, &accounts); err != nil {
		return []string{}, err
	}

	return accounts, nil
}

func Contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
