package structs

type TokenDB struct {
	TokenID string `gorm:"column:id;primaryKey" json:"token_id"`
	OwnerID string `gorm:"column:owner_id" json:"owner_id"`

	Title         *string `gorm:"column:title" json:"title"`
	Description   *string `gorm:"column:description" json:"description"`
	CreatedAt     *string `gorm:"column:created_at" json:"created_at"`
	UpdatedAt     *string `gorm:"column:updated_at" json:"updated_at"`
	TransferredAt *string `gorm:"column:transferred_at" json:"transferred_at"`
	Creator       *string `gorm:"column:creator" json:"creator"`

	Status   TokenStatus `gorm:"column:status" json:"status"`
	Selleble bool        `gorm:"column:selleble" json:"selleble"`
	Price    string      `gorm:"column:price" json:"price"`

	ReportsSpeech          string `gorm:"column:reports_speech" json:"reports_speech"`
	ReportsOffence         string `gorm:"column:reports_offence" json:"reports_offence"`
	ReportsSpeechOnVerify  int    `gorm:"column:reports_speech_on_verify" json:"reports_speech_on_verify"`
	ReportsOffenceOnVerify int    `gorm:"column:reports_offence_on_verify" json:"reports_offence_on_verify"`
}

type UserDB struct {
	UserID   string `gorm:"column:id;primaryKey" json:"user_id"`
	Banned   bool   `gorm:"column:banned" json:"banned"`
	Warnings int    `gorm:"column:warnings" json:"warnings"`
}

type EventDB struct {
	EventID   string  `gorm:"column:id;primaryKey" json:"id"`
	EventType string  `gorm:"column:type" json:"type"`
	Initiator string  `gorm:"column:initiator" json:"initiator"`
	Timestamp string  `gorm:"column:timestamp" json:"timestamp"`
	Sender    *string `gorm:"column:sender" json:"sender"`
	Receiver  *string `gorm:"column:receiver" json:"receiver"`
	TokenID   *string `gorm:"column:token_id" json:"token_id"`
	Status    *string `gorm:"column:status" json:"status"`
	Selleble  *bool   `gorm:"column:selleble" json:"selleble"`
	Price     *string `gorm:"column:price" json:"price"`
}
