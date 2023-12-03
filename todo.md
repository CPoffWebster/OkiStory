
Overall
- [x] background color
- [x] On/Off buttons
- [x] Black background color on home page
- [] Squarespace login w/ okistory.com

Credits
- [x] loggedin vs loggedout experience - logged in still has all "example" books, when out of credits can't click "Create Story", remove "buy credits" for now
- [x] loggedIn header consistency - keep only on first page
- [x] Credits, purchasing, and/or user setup during MVP testing - 3 starter for now

Home
- [x] number of books you can create
- [x] default images

Bookshelf
- [x] background image
- [x] selection as books not boxes
- [x] default books as a database column

Reading
- [x] left side representation
- [x] loading images on left happens after the book is loaded
- [better] don't allow going to the next page until it actually exists - disabled (PLUS - show an indication that it's being created/generated)

Creating Books
- [x] text creations not being updated in the database
      - created the bucket, needs to be tested
- [?] estimated pricings not working
- [better] queue for creating books -> rate limits applied https://platform.openai.com/account/limits
- [] ERROR HANDLING: how to deal with issues with creating images
    - ex: image_generations id 64 has no image

Go Live
- [] Create UAT vs prod
- [] reset the database
- [] create a set of pre-generated books


Post-POC
- [] height scaling vs width scaling - min and max size
- [] migrations
- [] analytics
- [] image loading speed
- [] Text generation prompts
- [] Image generation prompts


Bug Fixes
- [] spam clicking "next" causes issues