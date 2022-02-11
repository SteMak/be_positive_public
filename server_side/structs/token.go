package structs

type TokenStatus string

const (
	Ok               TokenStatus = "Ok"
	LockedToTransfer TokenStatus = "LockedToTransfer"
	LockedToListen   TokenStatus = "LockedToListen"
)

type BanStatus string

const (
	Ban     BanStatus = "Ban"
	Unban   BanStatus = "Unban"
	Warning BanStatus = "Warning"
)

type TokenMetadata struct {
	Title       *string `json:"title"`
	Description *string `json:"description"`
	Media       *string `json:"media"`
	CreatedAt   *string `json:"issued_at"`
	UpdatedAt   *string `json:"updated_at"`
	Creator     *string `json:"creator"`

	Status   *TokenStatus `json:"status"`
	Selleble *bool        `json:"selleble"`
	Price    *string      `json:"price_str"`
}

type Token struct {
	TokenID  string         `json:"token_id"`
	OwnerID  string         `json:"owner_id"`
	Metadata *TokenMetadata `json:"metadata"`
}
