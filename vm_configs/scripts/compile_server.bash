cd $(dirname "$0")
cd ../../server_side

go build cmd/db_actualize/db_actualize.go
go build cmd/db_viewer/db_viewer.go
go build cmd/ipfs_actualize/ipfs_actualize.go
go build cmd/ipfs_adder/ipfs_adder.go
go build cmd/ipfs_cleaner/ipfs_cleaner.go
go build cmd/ipfs_remover/ipfs_remover.go
go build cmd/site_serving/site_serving.go

mv db_actualize cmd/db_actualize/
mv db_viewer cmd/db_viewer/
mv ipfs_actualize cmd/ipfs_actualize/
mv ipfs_adder cmd/ipfs_adder/
mv ipfs_cleaner cmd/ipfs_cleaner/
mv ipfs_remover cmd/ipfs_remover/
mv site_serving cmd/site_serving/
