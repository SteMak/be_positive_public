package structs

type Events struct {
	Events   []Event `json:"events"`
	SmthElse bool    `json:"smth_else"`
}

type Event struct {
	Transfer *EventTransfer `json:"Transfer"`
	Pricing  *EventPricing  `json:"Pricing"`
	Lock     *EventLock     `json:"Lock"`
	UserBan  *EventBan      `json:"Ban"`
}

type EventTransfer struct {
	Initiator string  `json:"initiator"`
	Sender    *string `json:"sender"`
	Receiver  *string `json:"receiver"`
	TokenID   string  `json:"token_id"`
	Timestamp string  `json:"timestamp"`
}

type EventLock struct {
	Initiator string      `json:"initiator"`
	Status    TokenStatus `json:"status"`
	TokenID   string      `json:"token_id"`
	Timestamp string      `json:"timestamp"`
}

type EventPricing struct {
	Initiator string `json:"initiator"`
	Price     string `json:"price"`
	Selleble  bool   `json:"selleble"`
	TokenID   string `json:"token_id"`
	Timestamp string `json:"timestamp"`
}

type EventBan struct {
	Initiator string    `json:"initiator"`
	Receiver  string    `json:"receiver"`
	Status    BanStatus `json:"status"`
	Timestamp string    `json:"timestamp"`
}
