near --accountId chestedos.testnet call $(cat ../neardev/dev-account) init_meta '{"owner":"chestedos.testnet"}' --gas 200000000000000

near --accountId chestedos.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 1", "description":"This is a token of well laugh", "media":"QmdWw5BfYgtHahSVZLvbtE5eTPeJfbtvryF2q5e67ri6ZZ", "price":"1000000000000000000000000", "selleble":true}' --amount 1 --gas 200000000000000
near --accountId chestedos.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 2", "description":"This is a token of well laugh", "media":"QmRmKCMo75hzenLYKaxCRcjx3kVd5jpWjaVJScBpUDb6jK", "price":"1000000000000000000000000", "selleble":true}' --amount 1 --gas 200000000000000
near --accountId chestedos.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 3", "description":"This is a token of well laugh", "media":"QmXtUWi3wBWViTvvv1AQFifnDniSTeY3HAcAEb9GKGJ9Zp", "price":"1000000000000000000000000", "selleble":true}' --amount 1 --gas 200000000000000
near --accountId chestedos.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 4", "description":"This is a token of well laugh", "media":"QmZGrnXfVUDPqnWrbJ6VbDYaeCKrbZWQVHBoSLaYPkNRnJ", "price":"1000000000000000000000000", "selleble":true}' --amount 1 --gas 200000000000000
near --accountId chestedos.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 5", "description":"This is a token of well laugh", "media":"QmeZ7EEXCQAtEMGoRAgHgjLVHMDWxMxr6UnkSYFEZA3ipm", "price":"0", "selleble":false}' --amount 1 --gas 200000000000000
near --accountId tu.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 6", "description":"This is a token of well laugh", "media":"QmehN5TWL23vDSTtcR5oLAEu2huENvq4WbpD3AD1UAantJ", "price":"1000000000000000000000000", "selleble":true}' --amount 1 --gas 200000000000000
near --accountId tu.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 7", "description":"This is a token of well laugh", "media":"Qmf1HTQL8NrEEKqu1P3k7yRTFEeYKPBWf4V64Jjk2UggH9", "price":"1000000000000000000000000", "selleble":true}' --amount 1 --gas 200000000000000
near --accountId tu.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 8", "description":"This is a token of well laugh", "media":"QmXMVNupRPrgXBj7x9xzb1epy16D1AtckcrgHBh25BnFDy", "price":"1000000000000000000000000", "selleble":true}' --amount 1 --gas 200000000000000
near --accountId tu.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 9", "description":"This is a token of well laugh", "media":"QmTF1cfB7yivEsmUk8h979j4CRbJepPWodNsmQ6S3iaB99", "price":"1000000000000000000000000", "selleble":true}' --amount 1 --gas 200000000000000
near --accountId tu.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 10", "description":"This is a token of well laugh", "media":"QmWK7fuoeXaf2dd3vqSuhkiQkntmt36qEQgto9cJeCDnKy", "price":"1000000000000000000000000", "selleble":true}' --amount 1 --gas 200000000000000
near --accountId tu.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 11", "description":"This is a token of well laugh", "media":"QmQAKrt8FDBv1R1mnfLfWqYedz2cyhoN5mBqiZzvw5V7Md", "price":"1000000000000000000000000", "selleble":true}' --amount 1 --gas 200000000000000
near --accountId tue.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 12", "description":"This is a token of well laugh", "media":"QmU5U8e2m3rQQaK5AyNoMTDkF7uZeRKfoVopBTLgQqLLfy", "price":"0", "selleble":false}' --amount 1 --gas 200000000000000
near --accountId tue.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 13", "description":"This is a token of well laugh", "media":"QmY58X7naRa5T9UB8XQHFJPgnZxfQ691iqnmB41vmg4Vrt", "price":"0", "selleble":false}' --amount 1 --gas 200000000000000
near --accountId tue.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 14", "description":"This is a token of well laugh", "media":"QmRyaCYTSehPDibU7Snt5BiDczCbyTdP9XG2EZdkke2Uq9", "price":"1000000000000000000000000", "selleble":true}' --amount 1 --gas 200000000000000
near --accountId tue.testnet call $(cat ../neardev/dev-account) nft_create '{"title":"Sound 15", "description":"This is a token of well laugh", "media":"QmXvTRNJvrGDPjNek3eHsR178uPU34pNeYLvKbDrtXBPV8", "price":"1000000000000000000000000", "selleble":true}' --amount 1 --gas 200000000000000

near --accountId chestedos.testnet call $(cat ../neardev/dev-account) nft_update_price '{"title":"Sound 2", "description":"This is a token of well laugh", "token_id":"QmRmKCMo75hzenLYKaxCRcjx3kVd5jpWjaVJScBpUDb6jK", "price":"500", "selleble":false}' --amount 1 --gas 200000000000000
near --accountId chestedos.testnet call $(cat ../neardev/dev-account) nft_buy '{"token_id":"QmRyaCYTSehPDibU7Snt5BiDczCbyTdP9XG2EZdkke2Uq9"}' --amount 1 --gas 200000000000000
