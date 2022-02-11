package main

import (
	"fmt"
	"math/big"
	"os"
	"strings"
	"time"

	"github.com/SteMak/be_positive/server_side/structs"
	"github.com/SteMak/be_positive/server_side/utils"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
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

	NextEventIDString := ""
	DB.Table("events").Select("max(id)").Row().Scan(&NextEventIDString)

	NextEventID := new(big.Int)
	if NextEventIDString != "" {
		var ok bool
		NextEventID, ok = NextEventID.SetString(NextEventIDString, 10)
		if !ok {
			fmt.Println("Getting last event id failed")
			return
		}
		NextEventID.Add(NextEventID, new(big.Int).SetInt64(1))
	} else {
		NextEventID = NextEventID.SetInt64(0)
	}

	NextEventID = MakeTableActual(NextEventID)
	fmt.Println("Table actualized!")

	for {
		time.Sleep(13 * time.Second)
		NextEventID = MakeTableActual(NextEventID)
	}
}

func MakeTableActual(NextEventID *big.Int) *big.Int {
	Limit := uint64(100)
	LimitBig := new(big.Int).SetUint64(Limit)

	One := new(big.Int).SetInt64(1)
	SmthElse := true
	Events := []structs.Event{}

	CurrentEventID := new(big.Int).Set(NextEventID)

	for SmthElse {
		evs, err := utils.GetEvents(ContractID, NextEventID.String(), Limit)
		if err != nil {
			fmt.Printf("ERROR: trouble with getting events (%s)\n", err.Error())
			break
		}
		Events = append(Events, evs.Events...)
		SmthElse = evs.SmthElse
		NextEventID.Add(NextEventID, LimitBig)
	}

	for _, e := range Events {
		CurrentEventIDString := fmt.Sprintf("%039s", CurrentEventID.String())
		if e.Transfer != nil {
			if e.Transfer.Sender == nil {
				token, err := utils.GetToken(ContractID, e.Transfer.TokenID)
				if err != nil {
					if err.Error() != "Content-Length == 0" {
						fmt.Printf("ERROR: trouble with getting token (%s) (%s)\n", e.Transfer.TokenID, err.Error())
						return CurrentEventID
					} else {
						token.Metadata = &structs.TokenMetadata{}
						// fmt.Printf("NOTES: possible creating of burned token (%s)\n", e.Transfer.TokenID)
					}
				}

				DB.Table("tokens").Model(&structs.TokenDB{}).Create(&structs.TokenDB{
					TokenID: e.Transfer.TokenID,
					OwnerID: *e.Transfer.Receiver,

					Title:         token.Metadata.Title,
					Description:   token.Metadata.Description,
					CreatedAt:     &e.Transfer.Timestamp,
					TransferredAt: &e.Transfer.Timestamp,
					UpdatedAt:     &e.Transfer.Timestamp,
					Creator:       &e.Transfer.Initiator,

					Status:   "Ok",
					Selleble: false,
					Price:    fmt.Sprintf("%039s", "0"),

					ReportsSpeech:          " ",
					ReportsOffence:         " ",
					ReportsSpeechOnVerify:  0,
					ReportsOffenceOnVerify: 0,
				})
			} else if e.Transfer.Receiver == nil {
				DB.Table("tokens").Delete(&structs.TokenDB{}, "id = ?", e.Transfer.TokenID)
			} else {
				token := &structs.TokenDB{}
				row := DB.Table("tokens").Where("id = ?", e.Transfer.TokenID).Select("owner_id", "transferred_at", "updated_at", "selleble").Scan(&token)
				if token.OwnerID != *e.Transfer.Sender {
					fmt.Println("Warning: old_owner doesn't match (", token.OwnerID, ") != (", *e.Transfer.Sender, ")")
				}
				row.Update("owner_id", e.Transfer.Receiver)
				row.Update("selleble", false)
				row.Update("transferred_at", e.Transfer.Timestamp)
				row.Update("updated_at", e.Transfer.Timestamp)
			}

			DB.Table("events").Model(&structs.EventDB{}).Create(&structs.EventDB{
				EventID:   CurrentEventIDString,
				EventType: "Transfer",
				Initiator: e.Transfer.Initiator,
				Timestamp: e.Transfer.Timestamp,
				Sender:    e.Transfer.Sender,
				Receiver:  e.Transfer.Receiver,
				TokenID:   &e.Transfer.TokenID,
				Status:    nil,
				Selleble:  nil,
				Price:     nil,
			})
		} else if e.Pricing != nil {
			row := DB.Table("tokens").Where("id = ?", e.Pricing.TokenID)
			row.Update("price", fmt.Sprintf("%039s", e.Pricing.Price))
			row.Update("selleble", e.Pricing.Selleble)
			row.Update("updated_at", e.Pricing.Timestamp)

			DB.Table("events").Model(&structs.EventDB{}).Create(&structs.EventDB{
				EventID:   CurrentEventIDString,
				EventType: "Pricing",
				Initiator: e.Pricing.Initiator,
				Timestamp: e.Pricing.Timestamp,
				Sender:    nil,
				Receiver:  nil,
				TokenID:   &e.Pricing.TokenID,
				Status:    nil,
				Selleble:  &e.Pricing.Selleble,
				Price:     &e.Pricing.Price,
			})
		} else if e.Lock != nil {
			token := structs.TokenDB{}
			row := DB.Table("tokens").Where("id = ?", e.Lock.TokenID).Scan(&token)
			row.Update("status", e.Lock.Status)
			row.Update("updated_at", e.Lock.Timestamp)
			row.Update("reports_speech_on_verify", len(strings.Split(token.ReportsSpeech, " "))-2)
			row.Update("reports_offence_on_verify", len(strings.Split(token.ReportsOffence, " "))-2)

			DB.Table("events").Model(&structs.EventDB{}).Create(&structs.EventDB{
				EventID:   CurrentEventIDString,
				EventType: "Lock",
				Initiator: e.Lock.Initiator,
				Timestamp: e.Lock.Timestamp,
				Sender:    nil,
				Receiver:  nil,
				TokenID:   &e.Lock.TokenID,
				Status:    (*string)(&e.Lock.Status),
				Selleble:  nil,
				Price:     nil,
			})
		} else if e.UserBan != nil {
			if e.UserBan.Status == structs.Ban {
				var count int64
				row := DB.Table("users").Where("id = ?", e.UserBan.Receiver).Count(&count)
				if count > 0 {
					row.Update("banned", true)
				} else {
					DB.Table("users").Create(&structs.UserDB{
						UserID:   e.UserBan.Receiver,
						Banned:   true,
						Warnings: 0,
					})
				}
			} else if e.UserBan.Status == structs.Unban {
				user := structs.UserDB{}
				row := DB.Table("users").Where("id = ?", e.UserBan.Receiver).Scan(&user)
				if user.Warnings == 0 {
					row.Delete(structs.UserDB{})
				} else {
					row.Update("banned", false)
				}
			} else if e.UserBan.Status == structs.Warning {
				var count int64
				user := structs.UserDB{}
				row := DB.Table("users").Where("id = ?", e.UserBan.Receiver).Scan(&user).Count(&count)
				if count > 0 {
					row.Update("warnings", user.Warnings+1)
				} else {
					DB.Table("users").Create(&structs.UserDB{
						UserID:   e.UserBan.Receiver,
						Banned:   false,
						Warnings: 1,
					})
				}
			}

			DB.Table("events").Model(&structs.EventDB{}).Create(&structs.EventDB{
				EventID:   CurrentEventIDString,
				EventType: "UserBan",
				Initiator: e.UserBan.Initiator,
				Timestamp: e.UserBan.Timestamp,
				Sender:    nil,
				Receiver:  &e.UserBan.Receiver,
				TokenID:   nil,
				Status:    (*string)(&e.UserBan.Status),
				Selleble:  nil,
				Price:     nil,
			})
		}

		CurrentEventID.Add(CurrentEventID, One)
	}
	return CurrentEventID
}
