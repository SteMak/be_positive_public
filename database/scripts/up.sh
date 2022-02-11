cd $(dirname "$0")
export $(grep -v '^#' ../../.env | xargs)
DIR=../migrations/

migrate -database $DATABASE -path $DIR up
