## Inspiration
While looking for idea for the new project with my teammate, we thought about what people need nowadays. Some time there was no answer, but once my teammate told me a joke, and we laughed a lot. At that moment, we realized that **laughter is what people need**!


## What it does
Haher provides opportunity to share your laugh to the world. As it is a marketplace, you can earn money just laughing!

### So, there are such options for users:
- **Listen laugh** records (by one or all together)
- **Create, buy, sell and burn** haha tokens
- **Report** if voice-spam or abusive content is found

### There are well implemented moderation options:
- There are two types of blocking: **locking to transferring** or **locking to listening** (includes first one)
- **Any user can send report** and moderators lock tokens on contract level
- **Banning users** from minting if they publish abusive content
- **Users can be "rated"** by number of locked tokens


## How we built it
There are three main parts of the dapp

### Contract: 
- Implements **business logic**
- Implements **moderating logic**
- Corresponds **NEP-171**
- Implements **view valuable state** opportunity

### Server:
- Repeats contract state in **postgresql**
- Pins tokens to **IPFS**
- **Serve site**

### Frontend: 
- Gives possibility to **interact with the dapp**
- Provides **funny design**


## Challenges we ran into
### Contract
- **Wallet challenge:** to appear NFT to the wallet, it should be transferred by using "nft_transfer" method
- **View methods contract challenge:** some view methods are not optimized and can exceed gas in future (find alternative)

### Server
- **Running IPFS in docker challenge:** IPFS appears deep strange thing for me even now (loss of memory appeared, stable versions aren't so stable as wanted, etc.)

### Frontend
- **Making routing on frontend by hands:** as you are redirected to the wallet page and back, you should be user-friendly and appear with predictable page after back redirection


## Accomplishments that we're proud of
- Implementing **"contract indexer"**, through which you can get all needed information and repeat current contract state on server
- Getting **Certificate of Excellence** "NEAR Certified Developer Program Level 1"


## What we learned
### We've learned:
- How to write in **Rust**
- How to write **smart contract for NEAR**
- How to write **Rest API in Go**
- What is **IPFS** and how to use it
- Designing in **transparent way**
- How to **run the project on VPS** quickly
- How to set up **Cloudflare** and what is **DNS records**


## What's next for Haher
- Launch in **mainnet**
- Add **liked NFTs**
- Add **NFT collections** (like playlists)
- Think about **coloring NFT cards**
- Add ability to **record haha token as answer** on token of another user
- Add **laugh chains** that will inform author how reaction on his laugh goes through the world
- Make soft design patterns to **change background video on holidays**
- Renew design and write **mobile app** on flutter
- Think about **extending sounds** from laugh to **audiobooks or something else**
