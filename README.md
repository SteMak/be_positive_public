# Haher
### NFT-laugh marketplace, which makes people smiling


### [Demo site](https://haher.live)

<!-- ### [Demo on YouTube](https://www.youtube.com/watch?v=) -->


## General idea
### "10 minutes of laughing replaces a glass of sour cream" (folk wisdom)
In our mad world, people often forget about smiling and laughing. In such way this project aims to bring to the blockchain NFTs, which makes people laugh

It is not essential for users to be an active part of blockchain community. You can open the website and listen just recorded laugh.
On the other side, you can just turn on your microphone, record funny situations of your life and share them to the world

Of course, there is the possibility to collect and exchange NFT tokens, but **the main aim** of our project **is making laughing popular all over the world!**

### "Laughter is as contagious as yawning is" (Heinrich Heine)
Listening haha tokens makes you laugh too. That's way the project bring a drop of goodness into gray everyday life

### "Audio NFT are a new way of looking at blockchain artworks"
In most of the projects NFTs are pictures, but if there are a lot of bright artworks in one place, users' attention is going, people don't see interesting details and became exhausted rapidly

On the other side, listening short laughing records uplift users and don't exhaust them. In such way it can be drawn a parallel with memes


## For users
### There are 3 pages on the site:
- [Gallery](https://haher.live): here you can see all haha tokens published in the blockchain. Press "More" button to see a popup window with some info and "Buy" button (if this token is on sale)
- [Create](https://haher.live/new): here you can select file and upload it into the blockchain
- [Account](https://haher.live/account): here you can see list of your created and owned haha tokens. Clicking on it opens an info popup window, in it, you can put for sale owned ones

Also, you can look at another's account by link https://haher.live/account_ACCOUNT_ADDRESS


## Plans for future
- Add liked NFTs
- Launch in mainnet
- Add NFT collections (like playlists)
- Think about coloring NFT cards
- Make soft design patterns to change background video on holidays
- Renew design and write mobile app on flutter
- Think about extending sounds from laugh to audio books or something else


## For developers
This repository contains folders with 
- `contract` written on [Rust](https://docs.rs/near-sdk)
- `frontend` written on vanilla-js using [parcel](https://parceljs.org) to import npm modules
- `server_side` written on Go

The main goal of `server_side` is to absorb data from `contract` and process it to `frontend` in order to make site quicker, don't take fee from users and pin images to ipfs

### Developing contract
Download dependencies
```sh
yarn
```
Change `contract/lib.rs` as you need and then call
```sh
yarn deploy:debug
```

### Developing server_side
In `server_side/cmd` there are several entries

You can build them all by
```sh
./vm_configs/scripts/compile_server.bash
```

In `vm_configs/system_units` there are some system unit files that you can use

Don't forget about `database` folder that will help you to run database on your server

### Developing frontend
Download dependencies
```sh
yarn
```
All sources are in `frontend/src/`. In order to connect to custom contract change following strings in `frontend/src/js/wallet_connection.js`
```js
const near_config = {
  networkId: NETWORK,
  nodeUrl: RPC_ADDR,
  contractName: CONTRACT_ADDR,
  ...
}
```

In order to run site locally run
```sh
yarn dev
```
If you want to build site run
```sh
yarn build
```