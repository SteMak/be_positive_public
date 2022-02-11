package structs

type BlockchainRequestParams struct {
	TokenID string `json:"token_id"`
	From    string `json:"from_index"`
	Limit   uint64 `json:"limit"`
}

type BlockchainRequest struct {
	Contract string                  `json:"contract"`
	Method   string                  `json:"method"`
	Params   BlockchainRequestParams `json:"params"`
	RpcNode  string                  `json:"rpc_node"`
}

type ReportRequest struct {
	Message   []byte `json:"message"`
	KeyType   string `json:"key_type"`
	PublicKey []byte `json:"public_key"`
	Signature []byte `json:"signature"`
}
