# Haher
### NFT-laugh marketplace, which makes people smiling

### [Demo site](https://haher.live)

### [Demo on YouTube](https://www.youtube.com/watch?v=uCjiySCFxKk)

### [Project story](https://github.com/SteMak/be_positive_public/blob/master/PROJECT_STORY.md)

### Acknowledgements
I wish to acknowledge the help provided by my designer. Developing of the design made me crazy at first, but now comparing initial and current view I bow in respect to her experience and skills

I am particularly grateful for the assistance given by my girlfriend with making animations, icons and video processing

I would like to offer my special thanks to NEAR, its community and writers of guide books. NEAR Protocol is really the most developer-friendly blockchain


## General idea
### "10 minutes of laughing replaces a glass of sour cream" (folk wisdom)
In our mad world, people often forget about smiling and laughing. In such way this project aims to **bring to the blockchain NFTs, which make people laughing**

It is not essential for users to be an active part of blockchain community. You can open the website and listen just recorded laugh.
On the other side, you can just turn on your microphone, record funny situations of your life and share them to the world

Of course, there is the possibility to collect and exchange NFT tokens, but **the main aim** of our project **is making laughing popular all over the world!**

### "Laughter is as contagious as yawning is" (Heinrich Heine)
Listening haha tokens makes you laugh too. That's way the project bring a drop of goodness into gray everyday life


## Plans for future
- Launch in **mainnet**
- Add **liked NFTs**
- Add **NFT collections** (like playlists)
- Think about **coloring NFT cards**
- Add ability to **record haha token as answer** on token of another user
- Add **laugh chains** that will inform author how reaction on his laugh goes through the world
- Make soft design patterns to **change background video on holidays**
- Renew design and write **mobile app** on flutter
- Think about **extending sounds** from laugh to **audiobooks or something else**


## For users
### There are 3 pages on the site:
- [Gallery](https://haher.live): here you can see all haha tokens published in the blockchain. Press "More" button to see a popup window with some info and "Buy" button (if this token is on sale)
- [Create](https://haher.live/new): here you can select file and upload it into the blockchain
- [Account](https://haher.live/account): here you can see list of your created and owned haha tokens. Clicking on it opens an info popup window, in it, you can put for sale owned ones

Also, you can look at another's account by link https://haher.live/account_ACCOUNT_ADDRESS

**On any page with haha tokens, you can press "Play All" button to play all laugh records parallelly (the button is located on the top of the page)**


## For developers
This repository contains folders with 
- `contract` written on [Rust](https://docs.rs/near-sdk)
- `frontend` written on vanilla-js using [parcel](https://parceljs.org) to import npm modules
- `server_side` written on Golang

The main goal of `server_side` is to absorb data from `contract` and process it to `frontend` in order to make site quicker, don't take fee from users and pin images to IPFS

### Requirements:
- Rust
- Golang
- NodeJS
- yarn
- git
- nginx
- docker and docker-compose
- golang-migrate
- base-devel or build-essential

```sh
git clone https://github.com/SteMak/be_positive_public.git
cd be_positive_public
```

### Starting contract
```sh
rm neardev/dev-account
rm neardev/dev-account.env

cd contract
rustup target add wasm32-unknown-unknown
yarn
yarn deploy:debug
```

Edit `package.json` line of `scripts/deploy` to deploy contract to defined name
```sh
yarn deploy
```

### Starting server
Edit nginx `server_name` line config and copy it:
```sh
cp vm_configs/nginx/host /etc/nginx/sites-enabled/
nano /etc/nginx/sites-enabled/host
```

Prepare IPFS and database:
```sh
./vm_configs/scripts/compile_server.bash
export $(grep -v '^#' .env | xargs)
export $(grep -v '^#' neardev/dev-account.env | xargs)
docker-compose up -d
./database/scripts/up.sh
```

Run server entries:
```sh
cd server_side/cmd
./ipfs_actualize/ipfs_actualize
./db_actualize/db_actualize &
./db_viewer/db_viewer &
./ipfs_adder/ipfs_adder &
./ipfs_remover/ipfs_remover &
./site_serving/site_serving &
```

In `vm_configs/system_units` there are some systemd unit files that you can use

### Developing frontend
```sh
cd frontend
yarn

curl -o src/img/cat_ugr.mp4 https://media.istockphoto.com/videos/scottish-fold-cat-video-id687156136

yarn dev
```

In order to connect to custom contract change following strings in `frontend/src/js/wallet_connection.js`
```js
const near_config = {
  networkId: NETWORK,
  nodeUrl: RPC_ADDR,
  contractName: CONTRACT_ADDR,
  ...
}
```

If you want to build site for serving by server run
```sh
yarn build
```
