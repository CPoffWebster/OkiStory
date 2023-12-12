
Overall
- [x] background color
- [x] On/Off buttons
- [x] Black background color on home page
- [x] Squarespace login w/ okistory.com

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
- [x] spam clicking "next" causes issues

Creating Books
- [x] text creations not being updated in the database
      - created the bucket, needs to be tested
- [x] estimated pricings not working
- [better] queue for creating books -> rate limits applied https://platform.openai.com/account/limits
- [x] **ERROR HANDLING**: how to deal with issues with creating images
    - ex: image_generations id 64 has no image

Go Live
- [x] Create UAT vs prod
- [] reset the database
- [] create a set of pre-generated books


Post-POC
- [ILikeThis] height scaling vs width scaling - min and max size
- [] migrations
- [] analytics
- [x] image loading speed
- [] Text generation prompts
- [] Image generation prompts





POST MVP IDEAS
1. Easy
   1. Themes, Styles, etc for book creation
   2. Rating books
   3. User Experience redesign, custom skins?
2. Medium
   1. Custom Character / Location creation
   2. programatic sharing books (if it's rated high make available to others)
   3. Reading / Learning w/ Phonics: https://www.readingrockets.org/reading-101/reading-and-writing-basics/phonics-and-decoding
   4. Differentiating AI tools + self hosting
   5. Reading out loud
3. Hard
   1. Choose your own adventure books