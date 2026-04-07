import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const docs = `
v0.18.1b
OAS 3.1.0
Foreplay Public API
Terms of Service

Download OpenAPI Document

Download OpenAPI Document
Welcome to the Foreplay Public API documentation! This API empowers you to programmatically search, filter, and analyze a vast database of ads and brands.

This document is designed to get you up and running as quickly as possible. We'll cover everything from your first API call to advanced features.

Getting Started
Follow these four simple steps to make your first request.

Step 1: Get Your API Key
Before you can do anything, you need an API key. You can generate one from your account dashboard.

➡️ Get your API Key from the Foreplay Data API Dashboard

Step 2: Prepare Your Request
Every request to the API requires your key to be sent in the Authorization header.

Authorization: YOUR_API_KEY
Replace YOUR_API_KEY with the key you generated in Step 1.

Step 3: Make Your First Call
Let's fetch a list of brands. Open your terminal or API client and use the following cURL command:

Example: Fetching a list of brands

# This command requests the first 10 brands from the Spyder endpoint.
curl -X GET "https://public.api.foreplay.co/api/spyder/brands?offset=0&limit=10" 
  -H "Authorization: YOUR_API_KEY"
Step 4: Understand the Response
If successful, you'll receive a JSON object containing the requested data and some metadata about your request.

{
  "data": [
    {
      "id": "brand_123456",
      "name": "Example Brand Inc.",
      // ... other brand details
    }
  ],
  "metadata": {
    "success": true,
    "status_code": 200,
    "count": 1
    // ... other metadata
  }
}
Congratulations, you've successfully made your first API call!

Core Concepts
To get the most out of the API, it helps to understand these key features:

SwipeFile: Your personal collection of saved ads. Use the /api/swipefile/ads endpoint to access ads you've saved for inspiration or analysis.
Boards: Boards are collections you create to organize brands. This is perfect for tracking competitors or grouping brands by category.
Spyder: This feature allows you to access brands you are subscribed to, providing a focused view of the data that matters most to you.
Discovery: The discovery endpoints (/api/discovery/*) are for broad searches across the entire database, helping you find new ads and brands based on keywords and filters.
Common Use Cases
Here are a few ways you can use the Foreplay API:

Competitive Intelligence: Monitor the advertising strategies of competing brands.
Market Research: Analyze advertising trends across different niches and platforms.
Creative Inspiration: Discover high-performing ad creatives to inspire your own campaigns.
Building Custom Dashboards: Integrate ad data directly into your internal analytics tools.
API Reference
Base URL
All API endpoints are relative to the following base URL:

https://public.api.foreplay.co/

Authentication
Every request must include your API key in the Authorization header.

Code Examples

JavaScript (fetch)

// Fetches the first 10 brands from the Spyder endpoint.
await fetch("https://public.api.foreplay.co/api/spyder/brands?offset=0&limit=10", {
  headers: { Authorization: "YOUR_API_KEY" }
});
Python (requests)

import requests

# Fetches the first 10 brands from the Spyder endpoint.
r = requests.get(
    "https://public.api.foreplay.co/api/spyder/brands",
    params={"offset": 0, "limit": 10},
    headers={"Authorization": "YOUR_API_KEY"},
)
Security Tips

Keep your API keys secret and never commit them to public source control.
Rotate keys immediately if you suspect they have been exposed.
Credit Usage
Your usage is limited by the number of credits available in your subscription plan.

How Credits are Computed

Action	Cost	Example
Retrieving Ads	1 credit per ad returned	A request returning 25 ads costs 25 credits.
Retrieving Brands	1 credit per request	A request returning 1 or 10 brands both cost 1 credit.
How to Monitor Your Usage

Check the X-Credits-Remaining header in any API response.
Use the /usage endpoint, which does not consume any credits.
View your usage history in the API Logs Dashboard.
Response Headers
All responses include the following headers for your convenience:

X-Process-Time: The server time taken to process the request.
X-Trace-ID: A unique ID for each request, useful for support and debugging.
X-Credits-Remaining: The number of credits left on your plan.
X-Credit-Cost: The credit cost of the specific request you just made.
Error Handling
The API uses standard HTTP status codes to indicate the success or failure of a request.

Status Code	Meaning	Possible Cause
400 Bad Request	Your request was malformed.	Invalid parameters, incorrect data types.
401 Unauthorized	Authentication failed.	Missing or invalid API key.
402 Payment Required	You have run out of credits.	Your usage limit has been reached.
403 Forbidden	You don't have permission.	Your plan doesn't include access to this feature.
404 Not Found	The requested resource does not exist.	An incorrect ID was used.
429 Too Many Requests	You have exceeded the rate limit.	Sending too many requests in a short period.
500 Internal Server Error	Something went wrong on our end.	A temporary issue with our servers.
Example Error Response (401 Unauthorized)

{
  "metadata": {
    "success": false,
    "message": "Authentication failed.",
    "status_code": 401,
    "processed_at": 1756488402833
  },
  "error": {
    "message": "Invalid or missing API key"
  },
  "data": []
}
Pagination
For endpoints that return a list of items, we use two methods of pagination:

Cursor-based: Use the cursor value from a response's metadata to fetch the next page of results. Cursor will always be in the metadata.cursor field in the response if the endpoint supports cursor based pagination. Please keep the same limit for each subsequent request.

Offset-based: Use the offset and limit parameters to page through results. This method is used in some endpoints, you need to increment by the limit for each subsequent request. i.e. if you request limit=10 and get 10 results, your next request should be offset=10&limit=10.

Always check the specific endpoint's documentation to see which method is supported. The limit parameter controls the number of results per page (max is typically 250, but may vary per endpoint).

Rate Limiting
To ensure fair usage, the API enforces rate limits. If you exceed the limit, you will receive a 429 Too Many Requests error. We recommend implementing a retry mechanism with exponential backoff if you anticipate making a high volume of requests.

Understanding the Data Model
The API revolves around two main entities: Ads and Brands.

Ad
An Ad represents a single advertisement. Key fields include:

id: Unique identifier for the ad.
ad_id: Platform-specific ad identifier.
name: Name or headline of the ad.
brand_id: The brand associated with the ad.
description: Text description of the ad.
headline: Headline or main text of the ad.
cta_title: Call-to-action text (e.g., "Shop Now").
categories: List of categories the ad belongs to.
creative_targeting: Targeting information for the ad.
languages: Languages used in the ad.
market_target: Market segment (e.g., B2B, B2C).
niches: List of niches relevant to the ad.
product_category: Product category advertised.
timestamped_transcription: List of transcription segments with timestamps (for video ads).
full_transcription: Complete transcription text (for video ads).
cards: Array of cards/components (for carousel, DCO, DPA, multi-media ads).
avatar: URL to the ad's avatar image.
cta_type: Type of call-to-action.
display_format: Format of the ad (e.g., video, image, carousel).
emotional_drivers: Emotional drivers detected in the ad.
link_url: Destination URL for the ad.
live: Whether the ad is currently live.
persona: Target persona (age, gender).
publisher_platform: Platforms where the ad is published.
started_running: Timestamp when the ad started running.
thumbnail: URL to the ad's thumbnail image.
video: URL to the ad's video (if applicable).
image: URL to the ad's image (if applicable).
content_filter: Content classification scores.
video_duration: Duration of the video (if applicable).
running_duration: Calculated duration the ad has been running.
Transcription
Ad transcriptions are automatically generated for video/audio content and included in all ad objects returned by the Foreplay Public API. No additional API calls or premium access required.

Field Types:

full_transcription - Complete text of spoken content as a string
timestamped_transcription - Array of objects with startTime, endTime, and sentence fields
Transcription Locations by Ad Type:

Video Ads
Location: Main ad object
Fields: full_transcription and timestamped_transcription
Example: Single video ad has transcription data directly in the ad response

Image Ads
Location: Main ad object
Fields: full_transcription: null and timestamped_transcription: null
Note: No transcriptions since there's no audio content

Carousel Ads
Location: Within cards array
Fields: Each card has its own full_transcription and timestamped_transcription
Structure: Image cards = null/empty, video cards = actual transcription data

DCO (Dynamic Creative Optimization) Ads
Location: Within cards array
Fields: Each component has its own full_transcription and timestamped_transcription
Structure: Same as carousel - transcriptions per component based on media type

DPA (Dynamic Product Ads)
Location: Within cards array
Fields: Each product card has its own full_transcription and timestamped_transcription
Structure: Typically null/empty since DPA cards are usually product images

Multi-Video/Multi-Media Ads
Location: Within cards array (when present)
Fields: Individual transcriptions per video component
Fallback: May also appear at main ad level if single aggregated transcription

Implementation Notes:

Always available: Transcriptions are included in every ad endpoint response
No filtering needed: Check for null/empty values to determine if content has audio
Consistent structure: Same field names across all ad types and endpoints
Error handling: Empty arrays or null values indicate no transcribable content
Key Rule: If an ad has a cards array, check there first for component-level transcriptions. Main ad level transcriptions are for single-media ads.

Brand
A Brand represents a company or entity that runs ads. Key fields include:

id: Unique identifier for the brand.
name: The name of the brand.
description: Optional text description of the brand.
category: Category or vertical the brand belongs to.
niches: List of niches relevant to the brand.
verification_status: Verification status of the brand.
url: Main website URL for the brand.
websites: List of additional website URLs.
avatar: URL to the brand's avatar image.
ad_library_id: Platform-specific ad library identifier.
is_delegate_page_with_linked_primary_profile: Indicates if the brand page is a delegate with a linked primary profile.
MCP Integration
The Foreplay Public API exposes an MCP server for easy integration with LLMs and other tools.

Base URL
The MCP server is available at:

https://public.api.foreplay.co/mcp

Features
HTTP Endpoints: Access all API endpoints via MCP's HTTP interface.
SSE Endpoints: Stream data in real-time using MCP's Server-Sent Events (SSE) interface.
Automatic Documentation: Use the built-in MCP documentation for easy reference.
Authentication
MCP uses the same API key authentication as the main API. Include your key in the Authorization header for all MCP requests.

Best Practices
Timezones: Always specify time in UTC format. To get all ads for a full day, use a range like start_date=YYYY-MM-DD 00:00:00 and end_date=YYYY-MM-DD 23:59:59.
Error Checking: Don't assume every request will succeed. Check the HTTP status code and error messages to handle failures gracefully.
Efficient Pagination: Use the cursor parameter for pagination whenever possible to ensure you don't miss data.
FAQ
How do I get all ads for a specific day? Use the start_date and end_date parameters with a full 24-hour range. For example: start_date=2024-12-01 00:00:00 and end_date=2024-12-01 23:59:59.

How do I paginate through a large list of ads? Check the metadata object in the response for a cursor value. Pass this value in your next request as a query parameter to get the next page.

What is the difference between offset and cursor pagination? offset skips a specific number of records, which can be inefficient for deep pages. cursor points to a specific record, making it faster and more reliable for fetching subsequent pages. Always check the specific endpoint's documentation to see which method is supported.

Server
Server:
https://public.api.foreplay.co
Production


Authentication
Required
Selected Auth Type:BearerAuth
Bearer Token
:
Token
Show Password
Client Libraries
Shell Curl
SwipeFile ​Copy link
SwipeFileOperations
get
/api/swipefile/ads
Get user's swipefile ads, all saved ads in swipefile​Copy link
Retrieve ads from the user's personal swipefile collection.

This endpoint returns ads that the user has saved or collected for reference in their personal swipefile. The swipefile is a personal collection feature that allows users to save interesting ads for later analysis, inspiration, or competitive research.

Business Context
Use this endpoint to access your personal collection of saved ads. The swipefile feature is essential for creative professionals, marketers, and researchers who want to build personal libraries of inspiring or noteworthy ads for future reference, analysis, or competitive research purposes.

Key Features
Personal collection: Access your saved ads only
Comprehensive filtering: Filter by multiple criteria simultaneously
Advanced pagination: Efficient cursor-based pagination
Flexible sorting: Sort by newest, oldest, longest running, or relevance
Rich metadata: Returns detailed collection statistics and result counts
Filtering Options
start_date: Filter ads published after this date
end_date: Filter ads published before this date
live: Filter by ad status (active/inactive)
display_format: Filter by ad format (video, image, carousel, etc.)
publisher_platform: Filter by platform (Facebook, Instagram, etc.)
niches: Filter by industry/category
market_target: Filter by target audience (B2B, B2C)
languages: Filter by ad language
Pagination
Use offset to skip a number of results (default 0)
limit controls results per page (default 10)
Sorting
order: Sort by creation date (newest/oldest), longest running duration, or most_relevant to search query, you can also sort by saved_newest to get ads in the order they were saved to the swipefile.
Manual uploads are not returned by the API at this time.
Only unique ads are returned in the response, even if duplicates exist in the swipefile.
Example Response
{
  "data": [
    {
      "id": "ad_123456789",
      "brand_id": "brand_987654321",
      "brand_name": "Nike",
      "title": "Just Do It - New Collection",
      "description": "Discover our latest athletic wear collection",
      "live": true,
      "display_format": "video",
      "publisher_platform": "facebook",
      "niches": ["sports", "fashion"],
      "market_target": "b2c",
      "language": "en",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "media_urls": [
        "https://example.com/video1.mp4",
        "https://example.com/image1.jpg"
      ],
      "ad_library_id": "123456789",
      "ad_library_url": "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&view_all_page_id=123456789"
    }
  ],
  "metadata": {
    "cursor": 987654321,
    "filters": {
      "live": true,
      "display_format": ["video"],
      "publisher_platform": ["facebook"],
      "niches": ["sports"],
      "market_target": ["b2c"],
      "languages": ["en"]
    },
    "count": 1,
    "order": "newest"
  }
}
Query Parameters
start_dateCopy link to start_date
Type:string · Start Date
nullable
Examples
Start date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To get all ads from a specific day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

end_dateCopy link to end_date
Type:string · End Date
nullable
Examples
End date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To include all results for a given day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

liveCopy link to live
Type:string · Live
enum
nullable
Examples
Filter ads by live status. true means currently active ads, false means inactive ads. Leave empty to include both.

values
true
false
display_formatCopy link to display_format
Type:array string[] | null · Display Format
enum
nullable
Examples
Filter ads by display format. Multiple formats can be specified. Available formats: video, image, carousel, dco, story, reels.

Example: ?display_format=video&display_format=carousel

values
carousel
dco
dpa
event
image
Show all values
Type:string · DisplayFormat
enum
values
carousel
dco
dpa
event
image
Show all values
publisher_platformCopy link to publisher_platform
Type:array string[] | null · Publisher Platform
enum
nullable
Examples
Filter ads by publisher platform. Multiple platforms can be specified. Available platforms: facebook, instagram, audience_network, messenger.

Example: ?publisher_platform=facebook&publisher_platform=instagram

values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp
Type:string · PublisherPlatform
enum
values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp
nichesCopy link to niches
Type:array string[] | null · Niches
enum
nullable
Examples
Filter ads by niche/category. Multiple niches can be specified. Available niches: travel, fashion, food, technology, sports, beauty, etc.

Example: ?niches=travel&niches=fashion

values
accessories
app/software
beauty
business/professional
education
Show all values
Type:string · Niche
enum
values
accessories
app/software
beauty
business/professional
education
Show all values
market_targetCopy link to market_target
Type:array string[] | null · Market Target
enum
nullable
Examples
Filter ads by market target. Multiple targets can be specified. Available targets: b2b, b2c.

Example: ?market_target=b2b

values
b2b
b2c
Type:string · MarketTarget
enum
values
b2b
b2c
languagesCopy link to languages
Type:array string[] | null · Languages
enum
nullable
Examples
Filter ads by language. Multiple languages can be specified. Available languages: en, fr, es, de, it, pt, etc.

Example: ?languages=en&languages=fr

values
dutch, flemish
english
french
german
italian
Show all values
Type:string · Language
enum
values
dutch, flemish
english
french
german
italian
Show all values
video_duration_minCopy link to video_duration_min
Type:number · Video Duration Min
min:  
0
nullable
Examples
Filter ads by minimum video duration in seconds. Only applies to video ads.

video_duration_maxCopy link to video_duration_max
Type:number · Video Duration Max
min:  
0
nullable
Examples
Filter ads by maximum video duration in seconds. Only applies to video ads.

running_duration_min_daysCopy link to running_duration_min_days
Type:integer · Running Duration Min Days
min:  
0
nullable
Examples
Filter ads by minimum running duration in days. Must be a positive integer.

running_duration_max_daysCopy link to running_duration_max_days
Type:integer · Running Duration Max Days
min:  
0
nullable
Examples
Filter ads by maximum running duration in days. Must be a positive integer.

offsetCopy link to offset
Type:integer · Offset
min:  
0
Default
Examples
Pagination offset. Use in conjunction with limit to paginate results. Default is 0.

limitCopy link to limit
Type:integer · Limit
greater than:  
0
max:  
250
Default
Examples
Pagination limit (max 250). Controls the number of ads returned per request.

orderCopy link to order
Type:string · SwipefileSortOrder
enum
nullable
Default
Examples
Order of results: 'saved_newest' (default), 'newest', 'oldest', 'longest_running', or 'most_relevant'. Sorts ads by creation date, or by longest running duration, or by relevance to search query, or by saved date in swipefile.

values
saved_newest
newest
oldest
longest_running
most_relevant
Responses

200
Successful Response
application/json

400
Bad Request - Invalid parameters provided
application/json

401
Unauthorized - Invalid or missing API key
application/json

402
Payment Required - Insufficient credits
application/json

403
Forbidden - Access denied to SwipeFile features
application/json

404
Not Found - No ads found for user
application/json

422
Validation Error
application/json

500
Internal Server Error - Database connection issues
application/json
Request Example forget/api/swipefile/ads
Shell Curl
curl 'https://public.api.foreplay.co/api/swipefile/ads?start_date=2024-11-12%2000%3A00%3A00&end_date=2024-11-12%2023%3A59%3A59&live=true&display_format=video&publisher_platform=facebook&niches=accessories&market_target=b2c&languages=en&video_duration_min=5&video_duration_max=60&running_duration_min_days=1&running_duration_max_days=7&offset=0&limit=10&order=saved_newest' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/swipefile/ads)
Status:200
Status:400
Status:401
Status:402
Status:403
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": null,
  "error": {}
}

Successful Response

Boards ​Copy link
BoardsOperations
get
/api/boards
Get all boards for the authenticated user​Copy link
This endpoint retrieves all boards associated with the authenticated user. Pagination is supported using offset and limit query parameters.

Query Parameters
offsetCopy link to offset
Type:integer · Offset
min:  
0
Default
The offset for pagination.

limitCopy link to limit
Type:integer · Limit
greater than:  
0
max:  
10
Default
The limit for pagination.

Responses

200
Successful Response
application/json

401
Unauthorized - Invalid or missing API key.
application/json

402
Payment Required - Insufficient credits.
application/json

403
Forbidden - Access denied.
application/json

404
Not Found - No boards found for user.
application/json

422
Validation Error
application/json

500
Internal Server Error - Database connection issues.
application/json
Request Example forget/api/boards
Shell Curl
curl 'https://public.api.foreplay.co/api/boards?offset=0&limit=10' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/boards)
Status:200
Status:401
Status:402
Status:403
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": null,
  "error": {}
}

Successful Response

Board ​Copy link
BoardOperations
get
/api/board/brands
get
/api/board/ads
Get all brands for a specific board​Copy link
This endpoint retrieves all brands associated with a specific board. Pagination is supported using offset and limit query parameters.

Query Parameters
board_idCopy link to board_id
Type:string · Board Id
min length:  
1
required
The ID of the board to retrieve brands from.

offsetCopy link to offset
Type:integer · Offset
min:  
0
nullable
Default
The offset for pagination. (int)

limitCopy link to limit
Type:integer · Limit
greater than:  
0
max:  
10
Default
Pagination limit (max 10). (int)

Responses

200
Successful Response
application/json

401
Unauthorized - Invalid or missing API key.
application/json

402
Payment Required - Insufficient credits.
application/json

403
Forbidden - Access denied.
application/json

404
Not Found - No brands found for board.
application/json

422
Validation Error
application/json

500
Internal Server Error - Database connection issues.
application/json
Request Example forget/api/board/brands
Shell Curl
curl 'https://public.api.foreplay.co/api/board/brands?board_id=&offset=0&limit=10' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/board/brands)
Status:200
Status:401
Status:402
Status:403
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": null,
  "error": {}
}

Successful Response

Get Ads by board id and Filters​Copy link
This endpoint retrieves ads associated with a specific board ID and applies various filters. Pagination is supported using cursor-based navigation.

Query Parameters
board_idCopy link to board_id
Type:string · Board Id
required
Board ID to search for

start_dateCopy link to start_date
Type:string · Start Date
nullable
Examples
Start date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To get all ads from a specific day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

end_dateCopy link to end_date
Type:string · End Date
nullable
Examples
End date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To include all results for a given day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

liveCopy link to live
Type:string · Live
enum
nullable
Filter ads by live status. true means currently active, false means not live.

values
true
false
display_formatCopy link to display_format
Type:array string[] | null · Display Format
enum
nullable
Filter by one or more display formats. Example: ?display_format=video&display_format=carousel

values
carousel
dco
dpa
event
image
Show all values
Type:string · DisplayFormat
enum
values
carousel
dco
dpa
event
image
Show all values
publisher_platformCopy link to publisher_platform
Type:array string[] | null · Publisher Platform
enum
nullable
Filter by one or more publisher platforms. Example: ?publisher_platform=facebook&publisher_platform=instagram

values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp
Type:string · PublisherPlatform
enum
values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp
nichesCopy link to niches
Type:array string[] | null · Niches
enum
nullable
Examples
Filter by one or more niches. Example: ?niche=travel&niche=other

values
accessories
app/software
beauty
business/professional
education
Show all values
Type:string · Niche
enum
values
accessories
app/software
beauty
business/professional
education
Show all values
market_targetCopy link to market_target
Type:array string[] | null · Market Target
enum
nullable
Filter by market target. Example: ?market_target=b2b

values
b2b
b2c
Type:string · MarketTarget
enum
values
b2b
b2c
languagesCopy link to languages
Type:array string[] | null · Languages
enum
nullable
Filter by languages. Accepts values like 'french', 'FR', 'romanian', 'ro', etc.

values
dutch, flemish
english
french
german
italian
Show all values
Type:string · Language
enum
values
dutch, flemish
english
french
german
italian
Show all values
video_duration_minCopy link to video_duration_min
Type:number · Video Duration Min
min:  
0
nullable
Examples
Filter ads by minimum video duration in seconds. Only applies to video ads.

video_duration_maxCopy link to video_duration_max
Type:number · Video Duration Max
min:  
0
nullable
Examples
Filter ads by maximum video duration in seconds. Only applies to video ads.

running_duration_min_daysCopy link to running_duration_min_days
Type:integer · Running Duration Min Days
min:  
0
nullable
Examples
Filter ads by minimum running duration in days. Must be a positive integer.

running_duration_max_daysCopy link to running_duration_max_days
Type:integer · Running Duration Max Days
min:  
0
nullable
Examples
Filter ads by maximum running duration in days. Must be a positive integer.

cursorCopy link to cursor
Type:string · Cursor
nullable
Example
Cursor for pagination. Use the cursor value from the previous response's metadata to get the next page of results.

limitCopy link to limit
Type:integer · Limit
greater than:  
0
max:  
250
Default
Pagination limit (max 250).

orderCopy link to order
Type:string · SortOrder
enum
nullable
Default
Examples
Order of results: 'newest' (default), 'oldest', 'longest_running', or 'most_relevant'. Sorts ads by creation date, or by longest running duration.

values
newest
oldest
longest_running
most_relevant
Responses

200
Successful Response
application/json

400
Bad Request - Invalid parameters provided.
application/json

401
Unauthorized - Invalid or missing API key.
application/json

402
Payment Required - Insufficient credits.
application/json

403
Forbidden - Access denied.
application/json

404
Not Found - No ads found for board.
application/json

422
Validation Error
application/json

500
Internal Server Error - Database connection issues.
application/json
Request Example forget/api/board/ads
Shell Curl
curl 'https://public.api.foreplay.co/api/board/ads?board_id=&start_date=2024-11-12%2000%3A00%3A00&end_date=2024-11-12%2023%3A59%3A59&live=true&display_format=carousel&publisher_platform=facebook&niches=accessories&market_target=b2b&languages=dutch%2C%20flemish&video_duration_min=5&video_duration_max=60&running_duration_min_days=1&running_duration_max_days=7&cursor=eyJ0cyI6MTcwOTY1NDQwMDAwMCwiaWQiOiJhYmMxMjMifQ%3D%3D&limit=10&order=newest' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/board/ads)
Status:200
Status:400
Status:401
Status:402
Status:403
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": null,
  "error": {}
}

Successful Response

Spyder ​Copy link
SpyderOperations
get
/api/spyder/brands
get
/api/spyder/brand
get
/api/spyder/brand/ads
Get User's Spyder tracked Brands​Copy link
Retrieve all brands that the authenticated user has access to in Spyder.

This endpoint provides access to the user's subscribed brands in the Spyder system. The results are filtered based on the user's subscription and access permissions, ensuring users can only see brands they have permission to view.

Key Features
User-specific access: Only returns brands the user has subscribed to
Pagination support: Efficient pagination with offset-based navigation
Comprehensive brand data: Returns detailed brand information
Multi-database architecture: Uses Firestore for permissions and CrateDB for data
Filtering Options
No filtering options for this endpoint (returns all brands the user has access to)
Pagination
Use offset for pagination (default 0)
limit controls results per page (default 10)
Sorting
Not applicable (brands are returned in default order)
Example Response
{
  "data": [
    {
      "id": "brand_123456789",
      "name": "Nike",
      "description": {"text": "Just Do It. Leading sports brand worldwide."},
      "category": "Sports & Fitness",
      "niches": ["sports", "fashion", "lifestyle"],
      "verification_status": "verified",
      "url": "https://nike.com",
      "websites": ["https://nike.com", "https://nike.com/us"],
      "avatar": "https://nike.com/avatar.jpg",
      "ad_library_id": "123456789",
      "is_delegate_page_with_linked_primary_profile": false
    }
  ],
  "metadata": {
    "cursor": null,
    "filters": {},
    "count": 1,
    "order": "newest"
  }
}
Query Parameters
offsetCopy link to offset
Type:integer · Offset
min:  
0
nullable
Default
The offset for pagination. Use 0 for the first page, then increment by limit for subsequent pages.

limitCopy link to limit
Type:integer · Limit
greater than:  
0
max:  
10
Default
Pagination limit (max 10). Controls the number of brands returned per request.

Responses

200
Successful Response
application/json

400
Bad Request - The request could not be understood or was missing required parameters.
application/json

401
Unauthorized - Invalid or missing API key.
application/json

402
Payment Required - Insufficient credits.
application/json

403
Forbidden - Access denied to this resource.
application/json

404
Not Found - No brands found for the given query.
application/json

422
Validation Error
application/json

500
Internal Server Error - An unexpected error occurred.
application/json
Request Example forget/api/spyder/brands
Shell Curl
curl 'https://public.api.foreplay.co/api/spyder/brands?offset=0&limit=10' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/spyder/brands)
Status:200
Status:400
Status:401
Status:402
Status:403
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": null,
  "error": {}
}

Successful Response

Get Specific Spyder Brand​Copy link
Retrieve detailed information for a specific brand that the authenticated user has access to.

This endpoint provides access to detailed brand information, but only for brands that the user has subscribed to or has permission to view. The system first checks user permissions in Firestore, then retrieves detailed brand data from CrateDB.

Key Features
Access control: Only returns brands the user has subscribed to
Detailed information: Complete brand data including descriptions and metadata
Security: User permissions verified before data retrieval
Multi-database architecture: Uses Firestore for permissions and CrateDB for data
Filtering Options
brand_id: Brand ID to search for (required)
Pagination
Not applicable (returns a single brand)
Sorting
Not applicable (returns a single brand)
Example Response
{
  "data": {
    "id": "brand_123456789",
    "name": "Nike",
    "description": {"text": "Just Do It. Leading sports brand worldwide."},
    "category": "Sports & Fitness",
    "niches": ["sports", "fashion", "lifestyle"],
    "verification_status": "verified",
    "url": "https://nike.com",
    "websites": ["https://nike.com", "https://nike.com/us"],
    "avatar": "https://nike.com/avatar.jpg",
    "ad_library_id": "123456789",
    "is_delegate_page_with_linked_primary_profile": false
  },
  "metadata": {}
}
Query Parameters
brand_idCopy link to brand_id
Type:string · Brand Id
required
Examples
The ID of the brand to retrieve. User must have access to this brand.

Responses

200
Successful Response
application/json

400
Bad Request - The request could not be understood or was missing required parameters.
application/json

401
Unauthorized - Invalid or missing API key.
application/json

402
Payment Required - Insufficient credits.
application/json

403
Forbidden - User not subscribed to this brand.
application/json

404
Not Found - Brand not found.
application/json

422
Validation Error
application/json

500
Internal Server Error - An unexpected error occurred.
application/json
Request Example forget/api/spyder/brand
Shell Curl
curl 'https://public.api.foreplay.co/api/spyder/brand?brand_id=brand_123456789' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/spyder/brand)
Status:200
Status:400
Status:401
Status:402
Status:403
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": null,
  "error": {}
}

Successful Response

Get Brand Ads in Spyder​Copy link
Retrieve all ads for a specific brand that the authenticated user has access to in Spyder.

This endpoint provides access to ads for brands that the user has subscribed to or has permission to view. The system first verifies user access to the brand, then retrieves and filters the ads based on the specified criteria.

How to get the Brand ID
There are two ways to get the brand ID:

Use the GET /api/spyder/brands endpoint to retrieve a list of brands. Each brand object will contain an id field that corresponds to the brand_id.

Get the brand ID from the Foreplay brand link URL, like so: https://app.foreplay.co/library-spyder/{brand_id}

Key Features
Access control: Only returns ads for brands the user has subscribed to
Advanced filtering: Filter by live status, display format, platform, niche, market target, and language
Pagination: Efficient pagination with cursor-based navigation
Flexible sorting: Sort by newest, oldest, longest running, or most_relevant
Comprehensive metadata: Returns detailed metadata including applied filters, result counts and cursor
Filtering Options
brand_id: Brand ID to search for (required)
start_date: Filter ads published after this date
end_date: Filter ads published before this date
live: Filter by ad status (active/inactive)
display_format: Filter by ad format (video, image, carousel, etc.)
publisher_platform: Filter by platform (Facebook, Instagram, etc.)
niches: Filter by industry/category
market_target: Filter by target audience (B2B, B2C)
languages: Filter by ad language
Pagination
Use cursor for pagination (provided in response metadata)
limit controls results per page (default 10)
Sorting
order: Sort by creation date (newest/oldest), longest running duration, or most_relevant to search query.
Query Parameters
brand_id (required): Brand ID to search for
start_date (optional): Start date (inclusive). Format: 'YYYY-MM-DD', etc.
end_date (optional): End date (inclusive). Format: 'YYYY-MM-DD', etc.
live (optional): Filter by ad status (active/inactive)
display_format (optional): Filter by ad format (video, image, carousel, etc.)
publisher_platform (optional): Filter by platform (Facebook, Instagram, etc.)
niches (optional): Filter by industry/category
market_target (optional): Filter by target audience (B2B, B2C)
languages (optional): Filter by ad language
cursor (optional): Cursor for pagination
limit (optional): Results per page (default 10)
order (optional): Sort order (newest/oldest/longest_running)
Example Response
{
  "data": [
    {
      "id": "ad_123456789",
      "brand_id": "brand_987654321",
      "title": "Summer Sale Ad",
      "description": "A great summer sale ad.",
      "live": true,
      "display_format": "video",
      "publisher_platform": ["facebook"],
      "niches": ["fashion"],
      "market_target": "b2c",
      "languages": ["en"],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "metadata": {
    "cursor": 987654321,
    "filters": {
      "live": true,
      "display_format": ["video"],
      "publisher_platform": ["facebook"],
      "niches": ["fashion"],
      "market_target": ["b2c"],
      "languages": ["en"]
    },
    "count": 1,
    "order": "newest"
  }
}
Query Parameters
brand_idCopy link to brand_id
required
Brand ID to search for. User must have access to this brand.


Any of
Brand Id
Type:string · Brand Id
Examples
Brand ID to search for. User must have access to this brand.

start_dateCopy link to start_date
Type:string · Start Date
nullable
Examples
Start date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To get all ads from a specific day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

end_dateCopy link to end_date
Type:string · End Date
nullable
Examples
End date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To include all results for a given day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

liveCopy link to live
Type:string · Live
enum
nullable
Examples
Filter ads by live status. true means currently active ads, false means inactive ads. Leave empty to include both.

values
true
false
display_formatCopy link to display_format
Type:array string[] | null · Display Format
enum
nullable
Examples
Filter by one or more display formats. Available formats: video, carousel, image, dco, dpa, multi_images, multi_videos, multi_medias, event, text Example: ?display_format=video&display_format=carousel

values
carousel
dco
dpa
event
image
Show all values
Type:string · DisplayFormat
enum
values
carousel
dco
dpa
event
image
Show all values
publisher_platformCopy link to publisher_platform
Type:array string[] | null · Publisher Platform
enum
nullable
Examples
Filter by one or more publisher platforms. Available platforms: facebook, instagram, audience_network, messenger Example: ?publisher_platform=facebook&publisher_platform=instagram

values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp
Type:string · PublisherPlatform
enum
values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp
nichesCopy link to niches
Type:array string[] | null · Niches
enum
nullable
Examples
Filter by one or more niches. Available niches: travel, food, fashion, beauty, health, technology, automotive, finance, education, entertainment, sports, home, pets, business, other Example: ?niches=travel&niches=fashion

values
accessories
app/software
beauty
business/professional
education
Show all values
Type:string · Niche
enum
values
accessories
app/software
beauty
business/professional
education
Show all values
market_targetCopy link to market_target
Type:array string[] | null · Market Target
enum
nullable
Examples
Filter by market target. Available targets: b2b (business-to-business), b2c (business-to-consumer) Example: ?market_target=b2b

values
b2b
b2c
Type:string · MarketTarget
enum
values
b2b
b2c
languagesCopy link to languages
Type:array string[] | null · Languages
enum
nullable
Examples
Filter by languages. Accepts various language formats: 'french', 'FR', 'romanian', 'ro', 'english', 'en', etc. Example: ?languages=en&languages=fr

values
dutch, flemish
english
french
german
italian
Show all values
Type:string · Language
enum
values
dutch, flemish
english
french
german
italian
Show all values
video_duration_minCopy link to video_duration_min
Type:number · Video Duration Min
min:  
0
nullable
Examples
Filter ads by minimum video duration in seconds. Only applies to video ads.

video_duration_maxCopy link to video_duration_max
Type:number · Video Duration Max
min:  
0
nullable
Examples
Filter ads by maximum video duration in seconds. Only applies to video ads.

running_duration_min_daysCopy link to running_duration_min_days
Type:integer · Running Duration Min Days
min:  
0
nullable
Examples
Filter ads by minimum running duration in days. Must be a positive integer.

running_duration_max_daysCopy link to running_duration_max_days
Type:integer · Running Duration Max Days
min:  
0
nullable
Examples
Filter ads by maximum running duration in days. Must be a positive integer.

cursorCopy link to cursor
Type:string · Cursor
nullable
Example
Cursor for pagination. Use the cursor value from the previous response's metadata to get the next page of results.

limitCopy link to limit
Type:integer · Limit
greater than:  
0
max:  
250
Default
Pagination limit (max 250). Controls the number of ads returned per request.

orderCopy link to order
Type:string · SortOrder
enum
nullable
Default
Examples
Order of results: 'newest' (default), 'oldest', 'longest_running', or 'most_relevant'. Sorts ads by creation date, or by longest running duration.

values
newest
oldest
longest_running
most_relevant
Responses

200
Successful Response
application/json

400
Bad Request - Invalid parameters provided.
application/json

401
Unauthorized - Invalid or missing API key.
application/json

402
Payment Required - Insufficient credits.
application/json

403
Forbidden - User not subscribed to this brand.
application/json

404
Not Found - No ads found for brand.
application/json

422
Validation Error
application/json

500
Internal Server Error - An unexpected error occurred.
application/json
Request Example forget/api/spyder/brand/ads
Shell Curl
curl 'https://public.api.foreplay.co/api/spyder/brand/ads?brand_id=brand_123456789&start_date=2024-11-12%2000%3A00%3A00&end_date=2024-11-12%2023%3A59%3A59&live=true&display_format=video&publisher_platform=facebook&niches=accessories&market_target=b2c&languages=en&video_duration_min=5&video_duration_max=60&running_duration_min_days=1&running_duration_max_days=7&cursor=eyJ0cyI6MTcwOTY1NDQwMDAwMCwiaWQiOiJhYmMxMjMifQ%3D%3D&limit=10&order=newest' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/spyder/brand/ads)
Status:200
Status:400
Status:401
Status:402
Status:403
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": null,
  "error": {}
}

Successful Response

Ad ​Copy link
AdOperations
get
/api/ad
get
/api/ad/{ad_id}
get
/api/ad/duplicates/{ad_id}
Get ad details​Copy link
Retrieve the details of a specific ad by its unique identifier (ad_id).

This endpoint fetches all information about a single ad, such as for displaying ad details, auditing, or analytics. It is useful when you know the ad_id and want to retrieve its full metadata and content.

Filtering Options
None (requires only ad_id)
Pagination
Not paginated (returns a single ad)
Sorting
Not applicable
Query Parameters
ad_id (str, required): The unique identifier of the ad to retrieve. Example: "ad_1234567890".
Example Response
{
    "data": {
        "id": "ad_1234567890",
        "ad_id": "ad_1234567890",
        "name": "Summer Sale Ad",
        "brand_id": "brand_987654321",
        "description": "A great summer sale ad.",
        "cta_title": "Shop Now",
        "categories": ["fashion", "summer"],
        "creative_targeting": "18-35, women",
        "languages": ["en"],
        "market_arget": "b2c",
        "niches": ["fashion"],
        "product_category": "clothing",
        "timestamped_transcription": [],
        "full_transcription": null,
        "cards": [],
        "avatar": "https://cdn.example.com/avatar.jpg",
        "cta_type": "SHOP_NOW",
        "display_format": "video",
        "emotional_drivers": null,
        "link_url": "https://shop.example.com",
        "live": true,
        "persona": null,
        "publisher_platform": ["facebook"],
        "started_running": 1717200000,
        "thumbnail": "https://cdn.example.com/thumb.jpg",
        "time_product_was_mentioned": null,
        "type": "video",
        "video": "https://cdn.example.com/ad.mp4",
        "image": null,
        "content_filter": null,
        "running_duration": {"days": 10}
    },
    "metadata": {
        "success": true,
        "message": "Your request has been processed successfully.",
        "status_code": 200,
        "processed_at": 1718000000000,
        "cursor": null,
        "filters": null,
        "order": null,
        "count": 1
    }
}
Query Parameters
ad_idCopy link to ad_id
Type:string · Ad Id
required
Responses

200
Successful Response
application/json

400
Bad Request - Invalid parameters provided.
application/json

401
Unauthorized - Invalid or missing API key.
application/json

402
Payment Required - Insufficient credits.
application/json

403
Forbidden - Access denied.
application/json

404
Not Found - No ads found for board.
application/json

422
Validation Error
application/json

500
Internal Server Error - Database connection issues.
application/json
Request Example forget/api/ad
Shell Curl
curl 'https://public.api.foreplay.co/api/ad?ad_id=' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/ad)
Status:200
Status:400
Status:401
Status:402
Status:403
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": {
    "id": "string",
    "ad_id": "string",
    "name": "string",
    "brand_id": "string",
    "description": "string",
    "headline": "string",
    "cta_title": "string",
    "categories": [
      "string"
    ],
    "creative_targeting": "string",
    "languages": [
      "string"
    ],
    "market_target": "string",
    "niches": [
      "string"
    ],
    "product_category": "string",
    "timestamped_transcription": [],
    "full_transcription": "string",
    "cards": [
      {
        "cta_text": "string",
        "description": "string",
        "headline": "string",
        "image": "string",
        "video": "string",
        "link_description": "string",
        "title": "string",
        "type": "string",
        "timestamped_transcription": [],
        "full_transcription": "string",
        "video_duration": 1
      }
    ],
    "avatar": "string",
    "cta_type": "SHOP_NOW",
    "display_format": "carousel",
    "emotional_drivers": {
      "achievement": 1,
      "anger": 1,
      "authority": 1,
      "belonging": 1,
      "competence": 1,
      "curiosity": 1,
      "empowerment": 1,
      "engagement": 1,
      "esteem": 1,
      "fear": 1,
      "guilt": 1,
      "nostalgia": 1,
      "nurturance": 1,
      "security": 1,
      "urgency": 1
    },
    "link_url": "string",
    "live": true,
    "persona": {
      "age": "unknown",
      "gender": "unknown"
    },
    "publisher_platform": [
      "facebook"
    ],
    "started_running": 1,
    "thumbnail": "string",
    "time_product_was_mentioned": 1,
    "type": "string",
    "video": "string",
    "image": "string",
    "content_filter": {
      "Facts_and_Stats": 0,
      "Features_and_Benefits": 0,
      "Promotion_and_Discount": 0,
      "Testimonial_Review": 0,
      "other": 0,
      "UGC": 0,
      "Us_vs_Them": 0,
      "Before_and_After": 0,
      "Podcast": 0,
      "Reasons_why": 0,
      "Media_and_Press": 0,
      "Unboxing": 0,
      "Green_Screen": 0,
      "Holiday_Seasonal": 0
    },
    "running_duration": {},
    "video_duration": 1
  },
  "error": {}
}

Successful Response

Get ad details by ID​Copy link
Retrieve the details of a specific ad by its unique identifier (ad_id) using a path parameter.

This endpoint is functionally identical to GET /ad but uses a RESTful path parameter. It is typically used to fetch all information about a single ad, such as for displaying ad details, auditing, or analytics. It is useful when you know the ad_id and want to retrieve its full metadata and content.

Filtering Options
None (requires only ad_id)
Pagination
Not paginated (returns a single ad)
Sorting
Not applicable
Query Parameters
ad_id (str, required, path): The unique identifier of the ad to retrieve. Example: "ad_1234567890".
Example Response
{
    "data": {
        "id": "ad_1234567890",
        "ad_id": "ad_1234567890",
        "name": "Summer Sale Ad",
        "brand_id": "brand_987654321",
        "description": "A great summer sale ad.",
        "cta_title": "Shop Now",
        "categories": ["fashion", "summer"],
        "creative_targeting": "18-35, women",
        "languages": ["en"],
        "market_arget": "b2c",
        "niches": ["fashion"],
        "product_category": "clothing",
        "timestamped_transcription": [],
        "full_transcription": null,
        "cards": [],
        "avatar": "https://cdn.example.com/avatar.jpg",
        "cta_type": "SHOP_NOW",
        "display_format": "video",
        "emotional_drivers": null,
        "link_url": "https://shop.example.com",
        "live": true,
        "persona": null,
        "publisher_platform": ["facebook"],
        "started_running": 1717200000,
        "thumbnail": "https://cdn.example.com/thumb.jpg",
        "time_product_was_mentioned": null,
        "type": "video",
        "video": "https://cdn.example.com/ad.mp4",
        "image": null,
        "content_filter": null,
        "running_duration": {"days": 10}
    },
    "metadata": {
        "success": true,
        "message": "Your request has been processed successfully.",
        "status_code": 200,
        "processed_at": 1718000000000,
        "cursor": null,
        "filters": null,
        "order": null,
        "count": 1
    }
}
Path Parameters
ad_idCopy link to ad_id
Type:string · Ad Id
required
Responses

200
Successful Response
application/json

400
Bad Request - Invalid parameters provided.
application/json

401
Unauthorized - Invalid or missing API key.
application/json

402
Payment Required - Insufficient credits.
application/json

403
Forbidden - Access denied.
application/json

404
Not Found - No ad found with the given ad_id.
application/json

422
Validation Error
application/json

500
Internal Server Error - Database connection issues.
application/json
Request Example forget/api/ad/{ad_id}
Shell Curl
curl 'https://public.api.foreplay.co/api/ad/{ad_id}' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/ad/{ad_id})
Status:200
Status:400
Status:401
Status:402
Status:403
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": {
    "id": "string",
    "ad_id": "string",
    "name": "string",
    "brand_id": "string",
    "description": "string",
    "headline": "string",
    "cta_title": "string",
    "categories": [
      "string"
    ],
    "creative_targeting": "string",
    "languages": [
      "string"
    ],
    "market_target": "string",
    "niches": [
      "string"
    ],
    "product_category": "string",
    "timestamped_transcription": [],
    "full_transcription": "string",
    "cards": [
      {
        "cta_text": "string",
        "description": "string",
        "headline": "string",
        "image": "string",
        "video": "string",
        "link_description": "string",
        "title": "string",
        "type": "string",
        "timestamped_transcription": [],
        "full_transcription": "string",
        "video_duration": 1
      }
    ],
    "avatar": "string",
    "cta_type": "SHOP_NOW",
    "display_format": "carousel",
    "emotional_drivers": {
      "achievement": 1,
      "anger": 1,
      "authority": 1,
      "belonging": 1,
      "competence": 1,
      "curiosity": 1,
      "empowerment": 1,
      "engagement": 1,
      "esteem": 1,
      "fear": 1,
      "guilt": 1,
      "nostalgia": 1,
      "nurturance": 1,
      "security": 1,
      "urgency": 1
    },
    "link_url": "string",
    "live": true,
    "persona": {
      "age": "unknown",
      "gender": "unknown"
    },
    "publisher_platform": [
      "facebook"
    ],
    "started_running": 1,
    "thumbnail": "string",
    "time_product_was_mentioned": 1,
    "type": "string",
    "video": "string",
    "image": "string",
    "content_filter": {
      "Facts_and_Stats": 0,
      "Features_and_Benefits": 0,
      "Promotion_and_Discount": 0,
      "Testimonial_Review": 0,
      "other": 0,
      "UGC": 0,
      "Us_vs_Them": 0,
      "Before_and_After": 0,
      "Podcast": 0,
      "Reasons_why": 0,
      "Media_and_Press": 0,
      "Unboxing": 0,
      "Green_Screen": 0,
      "Holiday_Seasonal": 0
    },
    "running_duration": {},
    "video_duration": 1
  },
  "error": {}
}

Successful Response

Get group of ads using same image or video by ad ID​Copy link
Retrieve a group of ads using the same image or video as the ad identified by the given ad_id.

This endpoint fetches all ads that share the same creative content (image or video) as the specified ad. It is useful for identifying duplicate or similar ads across different campaigns or brands.

Filtering Options
None (requires only ad_id)
Pagination
Not paginated (returns all matching ads)
Sorting
Not applicable
Query Parameters
ad_id (str, required, path): The unique identifier of the ad to find duplicates for.
Path Parameters
ad_idCopy link to ad_id
Type:string · Ad Id
required
Responses

200
Successful Response
application/json

400
Bad Request - Invalid parameters provided.
application/json

401
Unauthorized - Invalid or missing API key.
application/json

402
Payment Required - Insufficient credits.
application/json

403
Forbidden - Access denied.
application/json

404
Not Found - No ad found with the given ad_id.
application/json

422
Validation Error
application/json

500
Internal Server Error - Database connection issues.
application/json
Request Example forget/api/ad/duplicates/{ad_id}
Shell Curl
curl 'https://public.api.foreplay.co/api/ad/duplicates/{ad_id}' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/ad/duplicates/{ad_id})
Status:200
Status:400
Status:401
Status:402
Status:403
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": {
    "id": "string",
    "ad_id": "string",
    "name": "string",
    "brand_id": "string",
    "description": "string",
    "headline": "string",
    "cta_title": "string",
    "categories": [
      "string"
    ],
    "creative_targeting": "string",
    "languages": [
      "string"
    ],
    "market_target": "string",
    "niches": [
      "string"
    ],
    "product_category": "string",
    "timestamped_transcription": [],
    "full_transcription": "string",
    "cards": [
      {
        "cta_text": "string",
        "description": "string",
        "headline": "string",
        "image": "string",
        "video": "string",
        "link_description": "string",
        "title": "string",
        "type": "string",
        "timestamped_transcription": [],
        "full_transcription": "string",
        "video_duration": 1
      }
    ],
    "avatar": "string",
    "cta_type": "SHOP_NOW",
    "display_format": "carousel",
    "emotional_drivers": {
      "achievement": 1,
      "anger": 1,
      "authority": 1,
      "belonging": 1,
      "competence": 1,
      "curiosity": 1,
      "empowerment": 1,
      "engagement": 1,
      "esteem": 1,
      "fear": 1,
      "guilt": 1,
      "nostalgia": 1,
      "nurturance": 1,
      "security": 1,
      "urgency": 1
    },
    "link_url": "string",
    "live": true,
    "persona": {
      "age": "unknown",
      "gender": "unknown"
    },
    "publisher_platform": [
      "facebook"
    ],
    "started_running": 1,
    "thumbnail": "string",
    "time_product_was_mentioned": 1,
    "type": "string",
    "video": "string",
    "image": "string",
    "content_filter": {
      "Facts_and_Stats": 0,
      "Features_and_Benefits": 0,
      "Promotion_and_Discount": 0,
      "Testimonial_Review": 0,
      "other": 0,
      "UGC": 0,
      "Us_vs_Them": 0,
      "Before_and_After": 0,
      "Podcast": 0,
      "Reasons_why": 0,
      "Media_and_Press": 0,
      "Unboxing": 0,
      "Green_Screen": 0,
      "Holiday_Seasonal": 0
    },
    "running_duration": {},
    "video_duration": 1
  },
  "error": {}
}

Successful Response

Brand ​Copy link
BrandOperations
get
/api/brand/getAdsByBrandId
get
/api/brand/getAdsByPageId
get
/api/brand/getBrandsByDomain
get
/api/brand/analytics
Get Ads by Brand IDs and Filters​Copy link
Retrieve all ads for specific brand IDs with comprehensive filtering and pagination.

This endpoint searches for ads associated with the provided brand IDs and applies various filters to narrow down results. The search supports multiple brand IDs, allowing you to fetch ads from multiple brands in a single request.

Business Context
Use this endpoint for competitive analysis, brand research, or when you need to analyze advertising strategies across multiple brands. Ideal for marketing agencies, competitive intelligence teams, or researchers studying brand advertising patterns across different industries or market segments.

Usage Examples:
Competitive analysis: Compare advertising strategies across multiple brands
Brand research: Analyze advertising patterns for specific brands
Content discovery: Find creative ads from multiple brands in your industry
Market analysis: Study advertising trends across different market segments
Filtering Options
live: Filter active vs inactive ads (true/false)
display_format: video, carousel, image, dco, dpa, multi_images, multi_videos, multi_medias, event, text
publisher_platform: facebook, instagram, audience_network, messenger
niches: travel, food, fashion, beauty, health, technology, automotive, finance, education, entertainment, sports, home, pets, business, other
market_target: b2b (business-to-business), b2c (business-to-consumer)
languages: Accepts various language formats: 'french', 'FR', 'romanian', 'ro', 'english', 'en', etc.
start_date/end_date: Filter by date range (inclusive)
Pagination
Use cursor for pagination (provided in response metadata)
limit controls results per page (default 10)
Sorting
order: Sort by creation date (newest/oldest), longest running duration, or most_relevant to search query.
Query Parameters
brand_ids (List[str], required): Brand ID(s) to search for. Can be a single ID or multiple IDs separated by commas.
live (optional): Filter ads by live status. true means currently active ads, false means inactive ads. Leave empty to include both.
display_format (optional): Filter by one or more display formats.
publisher_platform (optional): Filter by one or more publisher platforms.
niches (optional): Filter by one or more niches.
market_target (optional): Filter by market target.
languages (optional): Filter by languages.
start_date (optional): Start date (inclusive). Format: 'YYYY-MM-DD', etc.
end_date (optional): End date (inclusive). Format: 'YYYY-MM-DD', etc.
order (optional): Order of results: 'newest' (default), 'oldest', or 'longest_running'.
cursor (optional): Cursor for pagination. Use the cursor value from the previous response's metadata to get the next page of results.
limit (optional): Pagination limit (default 10). Controls the number of ads returned per request.
Example Response
{
    "data": [
        {
            "id": "ad_123456789",
            "brand_id": "brand_123456789",
            "title": "Summer Collection 2024",
            "description": "Discover our latest summer styles",
            "live": true,
            "display_format": "video",
            "publisher_platform": "facebook",
            "niche": "fashion",
            "market_target": "b2c",
            "languages": ["en"],
            ...
        }
    ],
    "metadata": {
        "cursor": 123456789,
        "filters": {"live": true, "display_format": ["video"]},
        "count": 1,
        "order": "newest"
    }
}
Query Parameters
brand_idsCopy link to brand_ids
Type:array string[] · Brand Ids
required
Brand ID(s) to search for. Can be a single ID or multiple IDs separated by commas.

liveCopy link to live
Type:string · Live
enum
nullable
Examples
Filter ads by live status. true means currently active ads, false means inactive ads. Leave empty to include both.

values
true
false
display_formatCopy link to display_format
Type:array string[] | null · Display Format
enum
nullable
Examples
Filter by one or more display formats. Available formats: video, carousel, image, dco, dpa, multi_images, multi_videos, multi_medias, event, text Example: ?display_format=video&display_format=carousel

values
carousel
dco
dpa
event
image
Show all values
Type:string · DisplayFormat
enum
values
carousel
dco
dpa
event
image
Show all values
publisher_platformCopy link to publisher_platform
Type:array string[] | null · Publisher Platform
enum
nullable
Examples
Filter by one or more publisher platforms. Available platforms: facebook, instagram, audience_network, messenger Example: ?publisher_platform=facebook&publisher_platform=instagram

values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp
Type:string · PublisherPlatform
enum
values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp
nichesCopy link to niches
Type:array string[] | null · Niches
enum
nullable
Examples
Filter by one or more niches. Available niches: travel, food, fashion, beauty, health, technology, automotive, finance, education, entertainment, sports, home, pets, business, other Example: ?niches=travel&niches=fashion

values
accessories
app/software
beauty
business/professional
education
Show all values
Type:string · Niche
enum
values
accessories
app/software
beauty
business/professional
education
Show all values
market_targetCopy link to market_target
Type:array string[] | null · Market Target
enum
nullable
Examples
Filter by market target. Available targets: b2b (business-to-business), b2c (business-to-consumer) Example: ?market_target=b2b

values
b2b
b2c
Type:string · MarketTarget
enum
values
b2b
b2c
languagesCopy link to languages
Type:array string[] | null · Languages
enum
nullable
Examples
Filter by languages. Accepts various language formats: 'french', 'FR', 'romanian', 'ro', 'english', 'en', etc. Example: ?languages=en&languages=fr

values
dutch, flemish
english
french
german
italian
Show all values
Type:string · Language
enum
values
dutch, flemish
english
french
german
italian
Show all values
video_duration_minCopy link to video_duration_min
Type:number · Video Duration Min
min:  
0
nullable
Examples
Filter ads by minimum video duration in seconds. Only applies to video ads.

video_duration_maxCopy link to video_duration_max
Type:number · Video Duration Max
min:  
0
nullable
Examples
Filter ads by maximum video duration in seconds. Only applies to video ads.

running_duration_min_daysCopy link to running_duration_min_days
Type:integer · Running Duration Min Days
min:  
0
nullable
Examples
Filter ads by minimum running duration in days. Must be a positive integer.

running_duration_max_daysCopy link to running_duration_max_days
Type:integer · Running Duration Max Days
min:  
0
nullable
Examples
Filter ads by maximum running duration in days. Must be a positive integer.

start_dateCopy link to start_date
Type:string · Start Date
nullable
Examples
Start date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To get all ads from a specific day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

end_dateCopy link to end_date
Type:string · End Date
nullable
Examples
End date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To include all results for a given day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

orderCopy link to order
Type:string · SortOrder
enum
nullable
Default
Examples
Order of results: 'newest' (default), 'oldest', 'longest_running', or 'most_relevant'. Sorts ads by creation date, or by longest running duration.

values
newest
oldest
longest_running
most_relevant
cursorCopy link to cursor
Type:string · Cursor
nullable
Example
Cursor for pagination. Use the cursor value from the previous response's metadata to get the next page of results.

limitCopy link to limit
Type:integer · Limit
greater than:  
0
max:  
250
Default
Pagination limit (max 250). Controls the number of ads returned per request.

Responses

200
Successful Response
application/json

400
Bad Request - Invalid parameters provided
application/json

401
Unauthorized - Invalid or missing API key
application/json

402
Payment Required - Insufficient credits
application/json

404
Not Found - No ads found for user
application/json

422
Validation Error
application/json

500
Internal Server Error - Database connection issues
application/json
Request Example forget/api/brand/getAdsByBrandId
Shell Curl
curl 'https://public.api.foreplay.co/api/brand/getAdsByBrandId?brand_ids=&live=true&display_format=video&publisher_platform=facebook&niches=accessories&market_target=b2c&languages=en&video_duration_min=5&video_duration_max=60&running_duration_min_days=1&running_duration_max_days=7&start_date=2024-11-12%2000%3A00%3A00&end_date=2024-11-12%2023%3A59%3A59&order=newest&cursor=eyJ0cyI6MTcwOTY1NDQwMDAwMCwiaWQiOiJhYmMxMjMifQ%3D%3D&limit=10' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/brand/getAdsByBrandId)
Status:200
Status:400
Status:401
Status:402
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": null,
  "error": {}
}

Successful Response

Get Ads by Page ID and Filters​Copy link
Retrieve all ads for a specific Facebook page ID with comprehensive filtering and pagination.

This endpoint first looks up the brand associated with the provided page ID, then retrieves all ads for that brand with the specified filters. This is useful when you have a Facebook page ID but need to find the associated ads.

Key Features
Page ID lookup: Automatically finds the brand associated with the page ID
Advanced filtering: Filter by live status, display format, platform, niche, market target, and language
Pagination: Efficient pagination with cursor-based navigation
Flexible sorting: Sort by newest, oldest, longest running, or most_relevant
Comprehensive metadata: Returns detailed metadata including applied filters and result counts
Filtering Options
live: Filter active vs inactive ads (true/false)
display_format: video, carousel, image, dco, dpa, multi_images, multi_videos, multi_medias, event, text
publisher_platform: facebook, instagram, audience_network, messenger
niches: travel, food, fashion, beauty, health, technology, automotive, finance, education, entertainment, sports, home, pets, business, other
market_target: b2b (business-to-business), b2c (business-to-consumer)
languages: Accepts various language formats: 'french', 'FR', 'romanian', 'ro', 'english', 'en', etc.
start_date/end_date: Filter by date range (inclusive)
Pagination
Use cursor for pagination (provided in response metadata)
limit controls results per page (default 10)
Sorting
order: Sort by creation date (newest/oldest), longest running duration, or most_relevant to search query.
Query Parameters
page_id (str or int, required): Facebook page ID to search for. This should be the numeric ID of the Facebook page.
start_date (optional): Start date (inclusive). Format: 'YYYY-MM-DD', etc.
end_date (optional): End date (inclusive). Format: 'YYYY-MM-DD', etc.
order (optional): Order of results: 'newest' (default), 'oldest', or 'longest_running'.
live (optional): Filter ads by live status. true means currently active ads, false means inactive ads. Leave empty to include both.
display_format (optional): Filter by one or more display formats.
publisher_platform (optional): Filter by one or more publisher platforms.
niches (optional): Filter by one or more niches.
market_target (optional): Filter by market target.
languages (optional): Filter by languages.
cursor (optional): Cursor for pagination. Use the cursor value from the previous response's metadata to get the next page of results.
limit (optional): Pagination limit (default 10). Controls the number of ads returned per request.
Example Response
{
    "data": [
        {
            "id": "ad_123456789",
            "brand_id": "brand_123456789",
            "title": "Summer Collection 2024",
            "description": "Discover our latest summer styles",
            "live": true,
            "display_format": "video",
            "publisher_platform": "facebook",
            "niche": "fashion",
            "market_target": "b2c",
            "language": "en",
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": "2024-01-15T10:30:00Z"
        }
    ],
    "metadata": {
        "cursor": 123456789,
        "filters": {"live": true, "display_format": ["video"]},
        "count": 1,
        "order": "newest"
    }
}
Query Parameters
page_idCopy link to page_id
required
Facebook page ID to search for. This should be the numeric ID of the Facebook page.


Any of
Page Id
Type:string · Page Id
Examples
Facebook page ID to search for. This should be the numeric ID of the Facebook page.

start_dateCopy link to start_date
Type:string · Start Date
nullable
Examples
Start date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To get all ads from a specific day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

end_dateCopy link to end_date
Type:string · End Date
nullable
Examples
End date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To include all results for a given day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

orderCopy link to order
Type:string · SortOrder
enum
nullable
Default
Examples
Order of results: 'newest' (default), 'oldest', 'longest_running', or 'most_relevant'. Sorts ads by creation date, or by longest running duration.

values
newest
oldest
longest_running
most_relevant
liveCopy link to live
Type:string · Live
enum
nullable
Examples
Filter ads by live status. true means currently active ads, false means inactive ads. Leave empty to include both.

values
true
false
display_formatCopy link to display_format
Type:array string[] | null · Display Format
enum
nullable
Examples
Filter by one or more display formats. Available formats: video, carousel, image, dco, dpa, multi_images, multi_videos, multi_medias, event, text Example: ?display_format=video&display_format=carousel

values
carousel
dco
dpa
event
image
Show all values
Type:string · DisplayFormat
enum
values
carousel
dco
dpa
event
image
Show all values
publisher_platformCopy link to publisher_platform
Type:array string[] | null · Publisher Platform
enum
nullable
Examples
Filter by one or more publisher platforms. Available platforms: facebook, instagram, audience_network, messenger Example: ?publisher_platform=facebook&publisher_platform=instagram

values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp
Type:string · PublisherPlatform
enum
values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp
nichesCopy link to niches
Type:array string[] | null · Niches
enum
nullable
Examples
Filter by one or more niches. Available niches: travel, food, fashion, beauty, health, technology, automotive, finance, education, entertainment, sports, home, pets, business, other Example: ?niches=travel&niches=fashion

values
accessories
app/software
beauty
business/professional
education
Show all values
Type:string · Niche
enum
values
accessories
app/software
beauty
business/professional
education
Show all values
market_targetCopy link to market_target
Type:array string[] | null · Market Target
enum
nullable
Examples
Filter by market target. Available targets: b2b (business-to-business), b2c (business-to-consumer) Example: ?market_target=b2b

values
b2b
b2c
Type:string · MarketTarget
enum
values
b2b
b2c
languagesCopy link to languages
Type:array string[] | null · Languages
enum
nullable
Examples
Filter by languages. Accepts various language formats: 'french', 'FR', 'romanian', 'ro', 'english', 'en', etc. Example: ?languages=en&languages=fr

values
dutch, flemish
english
french
german
italian
Show all values
Type:string · Language
enum
values
dutch, flemish
english
french
german
italian
Show all values
video_duration_minCopy link to video_duration_min
Type:number · Video Duration Min
min:  
0
nullable
Examples
Filter ads by minimum video duration in seconds. Only applies to video ads.

video_duration_maxCopy link to video_duration_max
Type:number · Video Duration Max
min:  
0
nullable
Examples
Filter ads by maximum video duration in seconds. Only applies to video ads.

running_duration_min_daysCopy link to running_duration_min_days
Type:integer · Running Duration Min Days
min:  
0
nullable
Examples
Filter ads by minimum running duration in days. Must be a positive integer.

running_duration_max_daysCopy link to running_duration_max_days
Type:integer · Running Duration Max Days
min:  
0
nullable
Examples
Filter ads by maximum running duration in days. Must be a positive integer.

cursorCopy link to cursor
Type:string · Cursor
nullable
Example
Cursor for pagination. Use the cursor value from the previous response's metadata to get the next page of results.

limitCopy link to limit
Type:integer · Limit
greater than:  
0
max:  
250
Default
Pagination limit (max 250). Controls the number of ads returned per request.

Responses

200
Successful Response
application/json

400
Bad Request - Invalid parameters provided
application/json

401
Unauthorized - Invalid or missing API key
application/json

402
Payment Required - Insufficient credits
application/json

404
Not Found - No ads found for user
application/json

422
Validation Error
application/json

500
Internal Server Error - Database connection issues
application/json
Request Example forget/api/brand/getAdsByPageId
Shell Curl
curl 'https://public.api.foreplay.co/api/brand/getAdsByPageId?page_id=123456789&start_date=2024-11-12%2000%3A00%3A00&end_date=2024-11-12%2023%3A59%3A59&order=newest&live=true&display_format=video&publisher_platform=facebook&niches=accessories&market_target=b2c&languages=en&video_duration_min=5&video_duration_max=60&running_duration_min_days=1&running_duration_max_days=7&cursor=eyJ0cyI6MTcwOTY1NDQwMDAwMCwiaWQiOiJhYmMxMjMifQ%3D%3D&limit=10' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/brand/getAdsByPageId)
Status:200
Status:400
Status:401
Status:402
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": null,
  "error": {}
}

Successful Response

Get Brands by Domain​Copy link
Search for brands associated with a specific domain name using multi-database architecture.

This endpoint performs a comprehensive search for brands that may be associated with the provided domain.

Key Features
Domain normalization: Automatically formats and cleans domain input
Ranking system: Results are ranked by relevance to the domain
Flexible domain input: Accepts full URLs, domains, and subdomains
Excluded domains: Automatically blocks searches for excluded domains
Filtering Options
domain: Accepts full URLs, domains, and subdomains. Excluded domains are blocked.
Pagination
limit controls results per page (default 10)
Sorting
order: 'most_ranked' (default) or 'least_ranked'
Query Parameters
domain (str, required): Domain name to search for. Can be a full URL (e.g., 'https://example.com') or just the domain (e.g., 'example.com').
limit (optional): Pagination limit (default 10). Controls the number of brands returned per request.
order (optional): Order of results: 'most_ranked' (default) or 'least_ranked'.
Example Response
{
    "data": [
        {
            "id": "brand_123456789",
            "name": "Example Brand",
            "description": {"text": "Leading brand in technology"},
            "category": "Technology",
            "niches": ["technology", "business"],
            "verification_status": "verified",
            "url": "https://example.com",
            "websites": ["https://example.com", "https://shop.example.com"],
            "avatar": "https://example.com/avatar.jpg",
            "ad_library_id": "123456789",
            "is_delegate_page_with_linked_primary_profile": false
        }
    ],
    "metadata": {
        "cursor": null,
        "filters": {},
        "count": 1,
        "order": "most_ranked"
    }
}
Query Parameters
domainCopy link to domain
Type:string · Domain
required
Examples
Domain name to search for. This can be a full URL (e.g., 'https://example.com') or just the domain (e.g., 'example.com'). The system will automatically format and clean the domain. This endpoint looks up candidate brands based on the provided domain. The returned brands are potential matches and are not guaranteed to be definitively associated with the domain.

limitCopy link to limit
Type:integer · Limit
greater than:  
0
max:  
10
Default
Pagination limit (max 10). Controls the number of brands returned per request.

orderCopy link to order
Type:string · BrandSortOrder
enum
nullable
Default
Examples
Order of results: 'most_ranked' (default) or 'least_ranked'. Sorts brands by relevance ranking.

values
most_ranked
least_ranked
Responses

200
Successful Response
application/json

400
excluded domain
application/json

401
Unauthorized - Invalid or missing API key
application/json

402
Payment Required - Insufficient credits
application/json

404
Not Found - No brands found for the given domain
application/json

422
Validation Error
application/json

500
Internal Server Error - Database connection issues
application/json
Request Example forget/api/brand/getBrandsByDomain
Shell Curl
curl 'https://public.api.foreplay.co/api/brand/getBrandsByDomain?domain=https%3A%2F%2Fexample.com&limit=10&order=most_ranked' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/brand/getBrandsByDomain)
Status:200
Status:400
Status:401
Status:402
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": null,
  "error": {}
}

Successful Response

Get Brand Analytics by Brand ID or Page ID, gives running ads distribution and creative velocity​Copy link
Retrieve comprehensive analytics data for a brand or page over a specified date range.

This endpoint provides detailed analytics data including performance metrics, engagement statistics, and trend analysis. The system automatically determines whether the provided ID is a brand ID or page ID and retrieves the appropriate analytics data from Clickhouse.

Filtering Options
id: Accepts brand ID (20-25 character alphanumeric string) or page ID (numeric Facebook page identifier)
start_date/end_date: Filter by date range (inclusive, max 30 days)
Pagination
Not paginated (returns all analytics for the date range)
Sorting
order: Sort by creation date (newest/oldest), longest running duration, or most_relevant to search query.
Query Parameters
id (str, required): Page ID or Brand ID. Brand IDs are 20-25 character alphanumeric strings with mixed case. Page IDs are numeric Facebook page identifiers.
start_date (optional): Start date (inclusive). Format: 'YYYY-MM-DD', etc.
end_date (optional): End date (inclusive). Format: 'YYYY-MM-DD', etc.
order (optional): Order of results: 'newest' (default) or 'oldest'.
Example Response
{
    "data": [
        {
            "date": "2024-01-15",
            "page_id": "123456789",
            "page_name": "Example Brand",
            "domain": "example.com",
            "brand_id": "brand_123456789",
            "active_count": 25,
            "inactive_count": 5,
            "dco": 10,
            "video": 8,
            "image": 7,
            "dpa": 3,
            "carousel": 5,
            "multi_images": 2,
            "page_like": 15000,
            "event": 1,
            "text": 3,
            "multi_videos": 1,
            "multi_medias": 1
        }
    ],
    "metadata": {
        "cursor": null,
        "filters": {},
        "count": 1,
        "order": "newest"
    }
}
Query Parameters
idCopy link to id
Type:string · Id
required
Page ID or Brand ID. Brand IDs are 20-25 character alphanumeric strings with mixed case. Page IDs are numeric Facebook page identifiers.

start_dateCopy link to start_date
Type:string · Start Date
nullable
Examples
Start date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To get all ads from a specific day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

end_dateCopy link to end_date
Type:string · End Date
nullable
Examples
End date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To include all results for a given day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

orderCopy link to order
Type:string · SortOrder
enum
nullable
Default
Examples
Order of results: 'newest' (default), 'oldest', 'longest_running', or 'relevance'. Sorts ads by creation date, or by longest running duration.

values
newest
oldest
longest_running
most_relevant
Responses

200
Successful Response
application/json

400
Bad Request - Invalid parameters provided
application/json

401
Unauthorized - Invalid or missing API key
application/json

402
Payment Required - Insufficient credits
application/json

404
Not Found - No analytics found for the given ID
application/json

422
Validation Error
application/json

500
Internal Server Error - Database connection issues
application/json
Request Example forget/api/brand/analytics
Shell Curl
curl 'https://public.api.foreplay.co/api/brand/analytics?id=&start_date=2024-11-12%2000%3A00%3A00&end_date=2024-11-12%2023%3A59%3A59&order=newest' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/brand/analytics)
Status:200
Status:400
Status:401
Status:402
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": null,
  "error": {}
}

Successful Response

Discovery ​Copy link
DiscoveryOperations
get
/api/discovery/ads
get
/api/discovery/brands
get
/api/discovery/brands/explore
Search and Filter Ads​Copy link
Search and filter ads by various criteria with comprehensive filtering and pagination.

This endpoint provides a powerful search interface for discovering ads across the entire database. You can search by text content (ad names and descriptions) and apply multiple filters to narrow down results. The search is optimized for both text-based queries and filter-only searches.

Key Features
Text search: Search by ad name or description content
Advanced filtering: Filter by live status, display format, platform, niche, market target, and language
Pagination: Efficient pagination with cursor-based navigation
Flexible sorting: Sort by newest, oldest, longest running, or most_relevant
Comprehensive metadata: Returns detailed metadata including applied filters and result counts
Filtering Options
query: Search text for ad name or description (optional)
start_date: Filter ads published after this date
end_date: Filter ads published before this date
live: Filter by ad status (active/inactive)
display_format: Filter by ad format (video, image, carousel, etc.)
publisher_platform: Filter by platform (Facebook, Instagram, etc.)
niches: Filter by industry/category
market_target: Filter by target audience (B2B, B2C)
languages: Filter by ad language
Pagination
Use cursor for pagination (provided in response metadata)
limit controls results per page (default 10, max 250)
Sorting
order: Sort by creation date (newest/oldest), longest running duration, or most_relevant to search query.
Example Response
{
  "data": [
    {
      "id": "ad_123456789",
      "brand_id": "brand_123456789",
      "title": "Summer Collection 2024",
      "description": "Discover our latest summer styles",
      "live": true,
      "display_format": "video",
      "publisher_platform": "facebook",
      "niche": "fashion",
      "market_target": "b2c",
      "language": "en",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "metadata": {
    "cursor": 123456789,
    "filters": {"live": true, "display_format": ["video"]},
    "count": 1,
    "order": "newest"
  }
}
Query Parameters
queryCopy link to query
Type:string · Query
nullable
Example
Search text for ad name or description. Leave empty to search all ads with filters only.

start_dateCopy link to start_date
Type:string · Start Date
nullable
Examples
Start date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To get all ads from a specific day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

end_dateCopy link to end_date
Type:string · End Date
nullable
Examples
End date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To include all results for a given day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

liveCopy link to live
Type:string · Live
enum
nullable
Examples
Filter ads by live status. true means currently active ads, false means inactive ads. Leave empty to include both.

values
true
false
display_formatCopy link to display_format
Type:array string[] | null · Display Format
enum
nullable
Examples
Filter by one or more display formats. Available formats: video, carousel, image, dco, dpa, multi_images, multi_videos, multi_medias, event, text Example: ?display_format=video&display_format=carousel

values
carousel
dco
dpa
event
image
Show all values
Type:string · DisplayFormat
enum
values
carousel
dco
dpa
event
image
Show all values
publisher_platformCopy link to publisher_platform
Type:array string[] | null · Publisher Platform
enum
nullable
Examples
Filter by one or more publisher platforms. Available platforms: facebook, instagram, audience_network, messenger Example: ?publisher_platform=facebook&publisher_platform=instagram

values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp
Type:string · PublisherPlatform
enum
values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp
nichesCopy link to niches
Type:array string[] | null · Niches
enum
nullable
Examples
Filter by one or more niches. Available niches: accessories, app/software, beauty, business/professional, education, entertainment, fashion, food/drink, health/wellness, home/garden, jewelry/watches, other, parenting, pets, real estate, service business, medical, charity/nfp, kids/baby Example: ?niches=travel&niches=fashion

values
accessories
app/software
beauty
business/professional
education
Show all values
Type:string · Niche
enum
values
accessories
app/software
beauty
business/professional
education
Show all values
market_targetCopy link to market_target
Type:array string[] | null · Market Target
enum
nullable
Examples
Filter by market target. Available targets: b2b (business-to-business), b2c (business-to-consumer) Example: ?market_target=b2b

values
b2b
b2c
Type:string · MarketTarget
enum
values
b2b
b2c
languagesCopy link to languages
Type:array string[] | null · Languages
enum
nullable
Examples
Filter by languages. Accepts various language formats: 'french', 'FR', 'romanian', 'ro', 'english', 'en', etc. Example: ?languages=en&languages=fr

values
dutch, flemish
english
french
german
italian
Show all values
Type:string · Language
enum
values
dutch, flemish
english
french
german
italian
Show all values
video_duration_minCopy link to video_duration_min
Type:number · Video Duration Min
min:  
0
nullable
Examples
Filter ads by minimum video duration in seconds. Only applies to video ads.

video_duration_maxCopy link to video_duration_max
Type:number · Video Duration Max
min:  
0
nullable
Examples
Filter ads by maximum video duration in seconds. Only applies to video ads.

running_duration_min_daysCopy link to running_duration_min_days
Type:integer · Running Duration Min Days
min:  
0
nullable
Examples
Filter ads by minimum running duration in days. Must be a positive integer.

running_duration_max_daysCopy link to running_duration_max_days
Type:integer · Running Duration Max Days
min:  
0
nullable
Examples
Filter ads by maximum running duration in days. Must be a positive integer.

cursorCopy link to cursor
Type:string · Cursor
nullable
Example
Cursor for pagination. Use the cursor value from the previous response's metadata to get the next page of results.

limitCopy link to limit
Type:integer · Limit
greater than:  
0
max:  
250
Default
Pagination limit (max 250). Controls the number of ads returned per request.

orderCopy link to order
Type:string · SortOrder
enum
nullable
Default
Examples
Order of results: 'newest' (default), 'oldest', 'longest_running', or 'most_relevant'. Sorts ads by creation date, or by longest running duration.

values
newest
oldest
longest_running
most_relevant
Responses

200
Successful Response
application/json

400
Bad Request - The request could not be understood or was missing required parameters.
application/json

401
Unauthorized - Invalid or missing API key.
application/json

402
Payment Required - Insufficient credits.
application/json

403
Forbidden - Access denied to this resource.
application/json

404
Not Found - No ads found for the given query/filters.
application/json

422
Validation Error
application/json

500
Internal Server Error - An unexpected error occurred.
application/json
Request Example forget/api/discovery/ads
Shell Curl
curl 'https://public.api.foreplay.co/api/discovery/ads?query=foreplay.co&start_date=2024-11-01%2000%3A00%3A00&end_date=2024-12-12%2023%3A59%3A59&live=true&display_format=video&publisher_platform=facebook&niches=accessories&market_target=b2c&languages=en&video_duration_min=5&video_duration_max=60&running_duration_min_days=1&running_duration_max_days=7&cursor=eyJ0cyI6MTcwOTY1NDQwMDAwMCwiaWQiOiJhYmMxMjMifQ%3D%3D&limit=10&order=newest' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/discovery/ads)
Status:200
Status:400
Status:401
Status:402
Status:403
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": null,
  "error": {}
}

Successful Response

Search Brands by Name​Copy link
Search for brands by name with comprehensive brand discovery capabilities.

This endpoint provides a powerful search interface for discovering brands across the entire database. The search is optimized for brand names and provides detailed brand information including descriptions, categories, niches, and associated websites.

Key Features
Text-based search: Search by brand name with fuzzy matching
Comprehensive results: Returns detailed brand information
Pagination support: Efficient pagination for large result sets
Rich metadata: Includes search statistics and result counts
Filtering Options
query: Search input for brand name (required)
Pagination
limit controls results per page (max 10)
Sorting
Not applicable (brands are returned in default order)
Example Response
{
  "data": [
    {
      "id": "brand_123456789",
      "name": "Nike",
      "description": {"text": "Just Do It. Leading sports brand worldwide."},
      "category": "Sports & Fitness",
      "niches": ["sports", "fashion", "lifestyle"],
      "verification_status": "verified",
      "url": "https://nike.com",
      "websites": ["https://nike.com", "https://nike.com/us"],
      "avatar": "https://nike.com/avatar.jpg",
      "ad_library_id": "123456789",
      "is_delegate_page_with_linked_primary_profile": false
    }
  ],
  "metadata": {
    "cursor": null,
    "filters": {},
    "count": 1,
    "order": "newest"
  }
}
Query Parameters
queryCopy link to query
Type:string · Query
required
Examples
Search input for brand name. This will search across brand names using fuzzy matching.

limitCopy link to limit
Type:integer · Limit
greater than:  
0
max:  
10
Default
Pagination limit (max 10). Controls the number of brands returned per request.

Responses

200
application/json
Successful Response

Type:object · BaseResponse
data
nullable
required

Any of
Data
metadata
required

Any of
Metadata
count
Type:integer · Count
nullable
Integer numbers.

cursor
nullable

Any of
Cursor
Type:integer · Cursor
Integer numbers.

filters
Type:object · Filters
nullable
message
Type:string · Message
Default
order
Type:string · Order
nullable
processed_at
Type:integer · Processed At
Integer numbers.

status_code
Type:integer · Status Code
Default
Integer numbers.

success
Type:boolean · Success
Default
error
Type:object · Error
nullable

400
application/json
Bad Request - The request could not be understood or was missing required parameters.

Type:object · ErrorResponse
error
Type:object · Error
required
metadata
required

Any of
Metadata
count
Type:integer · Count
nullable
Integer numbers.

cursor
nullable

Any of
Cursor
Type:integer · Cursor
Integer numbers.

filters
Type:object · Filters
nullable
message
Type:string · Message
Default
order
Type:string · Order
nullable
processed_at
Type:integer · Processed At
Integer numbers.

status_code
Type:integer · Status Code
Default
Integer numbers.

success
Type:boolean · Success
Default
data
nullable
Default

401
application/json
Unauthorized - Invalid or missing API key.

Type:object · ErrorResponse
error
Type:object · Error
required
metadata
required

Any of
Metadata
count
Type:integer · Count
nullable
Integer numbers.

cursor
nullable

Any of
Cursor
Type:integer · Cursor
Integer numbers.

filters
Type:object · Filters
nullable
message
Type:string · Message
Default
order
Type:string · Order
nullable
processed_at
Type:integer · Processed At
Integer numbers.

status_code
Type:integer · Status Code
Default
Integer numbers.

success
Type:boolean · Success
Default
data
nullable
Default

402
application/json
Payment Required - Insufficient credits.

Type:object · ErrorResponse
error
Type:object · Error
required
metadata
required

Any of
Metadata
count
Type:integer · Count
nullable
Integer numbers.

cursor
nullable

Any of
Cursor
Type:integer · Cursor
Integer numbers.

filters
Type:object · Filters
nullable
message
Type:string · Message
Default
order
Type:string · Order
nullable
processed_at
Type:integer · Processed At
Integer numbers.

status_code
Type:integer · Status Code
Default
Integer numbers.

success
Type:boolean · Success
Default
data
nullable
Default

403
application/json
Forbidden - Access denied to this resource.

Type:object · ErrorResponse
error
Type:object · Error
required
metadata
required

Any of
Metadata
count
Type:integer · Count
nullable
Integer numbers.

cursor
nullable

Any of
Cursor
Type:integer · Cursor
Integer numbers.

filters
Type:object · Filters
nullable
message
Type:string · Message
Default
order
Type:string · Order
nullable
processed_at
Type:integer · Processed At
Integer numbers.

status_code
Type:integer · Status Code
Default
Integer numbers.

success
Type:boolean · Success
Default
data
nullable
Default

404
application/json
Not Found - No brands found for the given query.

Type:object · ErrorResponse
error
Type:object · Error
required
metadata
required

Any of
Metadata
count
Type:integer · Count
nullable
Integer numbers.

cursor
nullable

Any of
Cursor
Type:integer · Cursor
Integer numbers.

filters
Type:object · Filters
nullable
message
Type:string · Message
Default
order
Type:string · Order
nullable
processed_at
Type:integer · Processed At
Integer numbers.

status_code
Type:integer · Status Code
Default
Integer numbers.

success
Type:boolean · Success
Default
data
nullable
Default

422
application/json
Validation Error

Type:object · HTTPValidationError
detail
Type:array object[] · Detail
Hide ValidationErrorfor detail
loc
Type:array · Location
required
Show Child Attributesfor loc
msg
Type:string · Message
required
type
Type:string · Error Type
required

500
application/json
Internal Server Error - An unexpected error occurred.

Type:object · ErrorResponse
error
Type:object · Error
required
metadata
required

Any of
Metadata
count
Type:integer · Count
nullable
Integer numbers.

cursor
nullable

Any of
Cursor
Type:integer · Cursor
Integer numbers.

filters
Type:object · Filters
nullable
message
Type:string · Message
Default
order
Type:string · Order
nullable
processed_at
Type:integer · Processed At
Integer numbers.

status_code
Type:integer · Status Code
Default
Integer numbers.

success
Type:boolean · Success
Default
data
nullable
Default
Request Example forget/api/discovery/brands
Shell Curl
curl 'https://public.api.foreplay.co/api/discovery/brands?query=nike&limit=10' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/discovery/brands)
Status:200
Status:400
Status:401
Status:402
Status:403
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": null,
  "error": {}
}

Successful Response

Discover Brands by Ads​Copy link
Discover brands based on ads that match specific criteria.

This endpoint allows users to find brands by searching for ads that match various filters. It returns distinct brands associated with the ads that meet the specified criteria, enabling users to discover new brands based on their advertising content.

Key Features
Ad-based brand discovery: Find brands based on the ads they are running
Comprehensive filtering: Apply the same filters as the discovery ads endpoint to narrow down results
Distinct brand results: Returns unique brands associated with matching ads
Detailed brand information: Provides rich details about each brand in the results
Filtering Options
start_date: Filter ads published after this date
end_date: Filter ads published before this date
live: Filter by ad status (active/inactive)
display_format: Filter by ad format (video, image, carousel, etc.)
publisher_platform: Filter by platform (Facebook, Instagram, etc.)
niches: Filter by industry/category
market_target: Filter by target audience (B2B, B2C)
languages: Filter by ad language
video_duration_min: Filter by minimum video duration (seconds)
video_duration_max: Filter by maximum video duration (seconds)
Pagination
limit controls results per page (max 1000)
Query Parameters
start_dateCopy link to start_date
Type:string · Start Date
nullable
Examples
Start date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To get all ads from a specific day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

end_dateCopy link to end_date
Type:string · End Date
nullable
Examples
End date (inclusive). Format: 'YYYY-MM-DD', 'YYYY-MM-DDTHH:MM:SS', or 'YYYY-MM-DD HH:MM:SS'. If you provide only the date (e.g. '2024-11-12'), it will be interpreted as '2024-11-12 00:00:00'. To include all results for a given day, set end_date to 'YYYY-MM-DD 23:59:59' or to the next day at '00:00:00'. Examples: start_date=2024-11-12 00:00:00, end_date=2024-11-12 23:59:59.

liveCopy link to live
Type:string · Live
enum
nullable
Examples
Filter ads by live status. true means currently active ads, false means inactive ads. Leave empty to include both.

values
true
false
display_formatCopy link to display_format
Type:array string[] | null · Display Format
enum
nullable
Examples
Filter by one or more display formats. Available formats: video, carousel, image, dco, dpa, multi_images, multi_videos, multi_medias, event, text Example: ?display_format=video&display_format=carousel

values
carousel
dco
dpa
event
image
multi_images
multi_medias
multi_videos
page_like
text
video
Hide values
Type:string · DisplayFormat
enum
values
carousel
dco
dpa
event
image
multi_images
multi_medias
multi_videos
page_like
text
video
Hide values
publisher_platformCopy link to publisher_platform
Type:array string[] | null · Publisher Platform
enum
nullable
Examples
Filter by one or more publisher platforms. Available platforms: facebook, instagram, audience_network, messenger Example: ?publisher_platform=facebook&publisher_platform=instagram

values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp
Type:string · PublisherPlatform
enum
values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp
nichesCopy link to niches
Type:array string[] | null · Niches
enum
nullable
Examples
Filter by one or more niches. Available niches: accessories, app/software, beauty, business/professional, education, entertainment, fashion, food/drink, health/wellness, home/garden, jewelry/watches, other, parenting, pets, real estate, service business, medical, charity/nfp, kids/baby Example: ?niches=travel&niches=fashion

values
accessories
app/software
beauty
business/professional
education
entertainment
fashion
food/drink
health/wellness
home/garden
jewelry/watches
other
parenting
pets
real estate
service business
medical
charity/nfp
kids/baby
Hide values
Type:string · Niche
enum
values
accessories
app/software
beauty
business/professional
education
entertainment
fashion
food/drink
health/wellness
home/garden
jewelry/watches
other
parenting
pets
real estate
service business
medical
charity/nfp
kids/baby
Hide values
market_targetCopy link to market_target
Type:array string[] | null · Market Target
enum
nullable
Examples
Filter by market target. Available targets: b2b (business-to-business), b2c (business-to-consumer) Example: ?market_target=b2b

values
b2b
b2c
Type:string · MarketTarget
enum
values
b2b
b2c
languagesCopy link to languages
Type:array string[] | null · Languages
enum
nullable
Examples
Filter by languages. Accepts various language formats: 'french', 'FR', 'romanian', 'ro', 'english', 'en', etc. Example: ?languages=en&languages=fr

values
dutch, flemish
english
french
german
italian
japanese
latvian
lithuanian
polish
portuguese
romanian, moldavian, moldovan
serbian
slovene
spanish, castilian
swedish
Hide values
Type:string · Language
enum
values
dutch, flemish
english
french
german
italian
japanese
latvian
lithuanian
polish
portuguese
romanian, moldavian, moldovan
serbian
slovene
spanish, castilian
swedish
Hide values
video_duration_minCopy link to video_duration_min
Type:number · Video Duration Min
min:  
0
nullable
Examples
Filter ads by minimum video duration in seconds. Only applies to video ads.

video_duration_maxCopy link to video_duration_max
Type:number · Video Duration Max
min:  
0
nullable
Examples
Filter ads by maximum video duration in seconds. Only applies to video ads.

limitCopy link to limit
Type:integer · Limit
greater than:  
0
max:  
10000
Default
Pagination limit (max 10000). Controls the number of brands returned per request.

Responses

200
Successful Response
application/json

400
Bad Request - The request could not be understood or was missing required parameters.
application/json

401
Unauthorized - Invalid or missing API key.
application/json

402
Payment Required - Insufficient credits.
application/json

403
Forbidden - Access denied to this resource.
application/json

404
Not Found - No brands found for the given query.
application/json

422
Validation Error
application/json

500
Internal Server Error - An unexpected error occurred.
application/json
Request Example forget/api/discovery/brands/explore
Shell Curl
curl 'https://public.api.foreplay.co/api/discovery/brands/explore?start_date=2024-11-01%2000%3A00%3A00&end_date=2024-12-12%2023%3A59%3A59&live=true&display_format=video&publisher_platform=facebook&niches=accessories&market_target=b2c&languages=en&video_duration_min=5&video_duration_max=60&limit=10' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/discovery/brands/explore)
Status:200
Status:400
Status:401
Status:402
Status:403
Status:404
Status:422
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": null,
  "error": {}
}

Successful Response

Usage ​Copy link
UsageOperations
get
/api/usage
Get user usage information​Copy link
This endpoint retrieves usage information for the authenticated user, including remaining credits and usage statistics.

Responses

200
Successful Response
application/json

400
Bad Request - The request could not be understood or was missing required parameters.
application/json

401
Unauthorized - API key is missing or invalid.
application/json

500
Internal Server Error - An unexpected error occurred.
application/json
Request Example forget/api/usage
Shell Curl
curl https://public.api.foreplay.co/api/usage \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'


Test Request
(get /api/usage)
Status:200
Status:400
Status:401
Status:500
{
  "metadata": {
    "success": true,
    "message": "Your request has been processed successfully.",
    "status_code": 200,
    "processed_at": 1,
    "cursor": 1,
    "filters": {},
    "order": "string",
    "count": 1
  },
  "data": {
    "start_date": "2026-04-05T19:29:58.188Z",
    "end_date": "2026-04-05T19:29:58.188Z",
    "total_credits": 1,
    "remaining_credits": 1,
    "user": {
      "id": "string",
      "email": "string"
    }
  },
  "error": {}
}

Successful Response

Models

AdResponse​Copy link
ad_id
Type:string
required
id
Type:string
required
name
Type:string
required
avatar
Type:string
nullable
brand_id
Type:string
nullable
cards
Type:array object[] | null
nullable

CardModel
categories
Type:array string[] | null
nullable
content_filter
nullable

Any of
ContentFilterModel
Before_and_After
Type:number · Before And After
Default
Facts_and_Stats
Type:number · Facts And Stats
Default
Features_and_Benefits
Type:number · Features And Benefits
Default
Green_Screen
Type:number · Green Screen
Default
Holiday_Seasonal
Type:number · Holiday Seasonal
Default
Media_and_Press
Type:number · Media And Press
Default
other
Type:number · Other
Default
Podcast
Type:number · Podcast
Default
Promotion_and_Discount
Type:number · Promotion And Discount
Default
Reasons_why
Type:number · Reasons Why
Default
Testimonial_Review
Type:number · Testimonial Review
Default
UGC
Type:number · Ugc
Default
Unboxing
Type:number · Unboxing
Default
Us_vs_Them
Type:number · Us Vs Them
Default
creative_targeting
Type:string
nullable
cta_title
Type:string
nullable
cta_type
nullable

Any of
CTAType
Type:string · CTAType
enum
values
SHOP_NOW
SUBSCRIBE
description
Type:string
nullable
display_format
nullable

Any of
DisplayFormat
Type:string · DisplayFormat
enum
values
carousel
dco
dpa
event
image
Show all values
emotional_drivers
Type:object
nullable

EmotionalDrivers
full_transcription
Type:string
nullable
headline
Type:string
nullable
image
Type:string
nullable
languages
Type:array string[] | null
nullable
link_url
Type:string
nullable
live
Type:boolean
nullable
market_target
Type:string
nullable
niches
Type:array string[] | null
nullable
persona
Type:object
nullable

PersonaModel
product_category
Type:string
nullable
publisher_platform
Type:array string[] | null
enum
nullable
values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp

PublisherPlatform
running_duration
Type:object
nullable
started_running
Type:integer
nullable
Integer numbers.

thumbnail
Type:string
nullable
time_product_was_mentioned
Type:number
nullable
timestamped_transcription
Type:array | null
nullable
Default

timestamped_transcription
type
Type:string
nullable
video
Type:string
nullable
video_duration
Type:number
nullable

BaseResponse​Copy link
data
nullable
required

Any of
Data
metadata
required

Any of
Metadata
count
Type:integer · Count
nullable
Integer numbers.

cursor
nullable

Any of
Cursor
Show Schema Details
filters
Type:object · Filters
nullable
message
Type:string · Message
Default
order
Type:string · Order
nullable
processed_at
Type:integer · Processed At
Integer numbers.

status_code
Type:integer · Status Code
Default
Integer numbers.

success
Type:boolean · Success
Default
error
Type:object
nullable

BaseResponse[AdResponse]​Copy link
data
nullable
required

Any of
AdResponse
ad_id
Type:string · Ad Id
required
id
Type:string · Id
required
name
Type:string · Name
required
avatar
Type:string · Avatar
nullable
brand_id
Type:string · Brand Id
nullable
cards
Type:array object[] | null · Cards
nullable

CardModel
categories
Type:array string[] | null · Categories
nullable
content_filter
nullable

Any of
ContentFilterModel
Before_and_After
Type:number · Before And After
Default
Facts_and_Stats
Type:number · Facts And Stats
Default
Features_and_Benefits
Type:number · Features And Benefits
Default
Green_Screen
Type:number · Green Screen
Default
Holiday_Seasonal
Type:number · Holiday Seasonal
Default
Media_and_Press
Type:number · Media And Press
Default
other
Type:number · Other
Default
Podcast
Type:number · Podcast
Default
Promotion_and_Discount
Type:number · Promotion And Discount
Default
Reasons_why
Type:number · Reasons Why
Default
Testimonial_Review
Type:number · Testimonial Review
Default
UGC
Type:number · Ugc
Default
Unboxing
Type:number · Unboxing
Default
Us_vs_Them
Type:number · Us Vs Them
Default
creative_targeting
Type:string · Creative Targeting
nullable
cta_title
Type:string · Cta Title
nullable
cta_type
nullable

Any of
CTAType
Type:string · CTAType
enum
values
SHOP_NOW
SUBSCRIBE
description
Type:string · Description
nullable
display_format
nullable

Any of
DisplayFormat
Type:string · DisplayFormat
enum
values
carousel
dco
dpa
event
image
Show all values
emotional_drivers
Type:object · EmotionalDrivers
nullable

EmotionalDrivers
full_transcription
Type:string · Full Transcription
nullable
headline
Type:string · Headline
nullable
image
Type:string · Image
nullable
languages
Type:array string[] | null · Languages
nullable
link_url
Type:string · Link Url
nullable
live
Type:boolean · Live
nullable
market_target
Type:string · Market Target
nullable
niches
Type:array string[] | null · Niches
nullable
persona
Type:object · PersonaModel
nullable

PersonaModel
product_category
Type:string · Product Category
nullable
publisher_platform
Type:array string[] | null · Publisher Platform
enum
nullable
values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp

PublisherPlatform
running_duration
Type:object · Running Duration
nullable
started_running
Type:integer · Started Running
nullable
Integer numbers.

thumbnail
Type:string · Thumbnail
nullable
time_product_was_mentioned
Type:number · Time Product Was Mentioned
nullable
timestamped_transcription
Type:array | null · Timestamped Transcription
nullable
Default

timestamped_transcription
type
Type:string · Type
nullable
video
Type:string · Video
nullable
video_duration
Type:number · Video Duration
nullable
metadata
required

Any of
Metadata
count
Type:integer · Count
nullable
Integer numbers.

cursor
nullable

Any of
Cursor
Type:integer · Cursor
Integer numbers.

filters
Type:object · Filters
nullable
message
Type:string · Message
Default
order
Type:string · Order
nullable
processed_at
Type:integer · Processed At
Integer numbers.

status_code
Type:integer · Status Code
Default
Integer numbers.

success
Type:boolean · Success
Default
error
Type:object
nullable

BaseResponse[UsagesResponse]​Copy link
data
nullable
required

Any of
UsagesResponse
end_date
Type:string · End Date
Format:date-time
required
the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z

remaining_credits
Type:integer · Remaining Credits
required
Integer numbers.

start_date
Type:string · Start Date
Format:date-time
required
the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z

total_credits
Type:integer · Total Credits
required
Integer numbers.

user
Type:object · LimitedUserResponse
required

LimitedUserResponse
metadata
required

Any of
Metadata
count
Type:integer · Count
nullable
Integer numbers.

cursor
nullable

Any of
Cursor
Type:integer · Cursor
Integer numbers.

filters
Type:object · Filters
nullable
message
Type:string · Message
Default
order
Type:string · Order
nullable
processed_at
Type:integer · Processed At
Integer numbers.

status_code
Type:integer · Status Code
Default
Integer numbers.

success
Type:boolean · Success
Default
error
Type:object
nullable

BrandSortOrder​Copy link
Type:string
enum
values
most_ranked
least_ranked

CTAType​Copy link
Type:string
enum
values
SHOP_NOW
SUBSCRIBE

CardModel​Copy link
cta_text
Type:string
nullable
description
Type:string
nullable
full_transcription
Type:string
nullable
headline
Type:string
nullable
image
Type:string
nullable
link_description
Type:string
nullable
timestamped_transcription
Type:array | null
nullable
Default

timestamped_transcription
title
Type:string
nullable
type
Type:string
nullable
video
Type:string
nullable
video_duration
Type:number
nullable

ContentFilterModel​Copy link
Before_and_After
Type:number
Default
Facts_and_Stats
Type:number
Default
Features_and_Benefits
Type:number
Default
Green_Screen
Type:number
Default
Holiday_Seasonal
Type:number
Default
Media_and_Press
Type:number
Default
other
Type:number
Default
Podcast
Type:number
Default
Promotion_and_Discount
Type:number
Default
Reasons_why
Type:number
Default
Testimonial_Review
Type:number
Default
UGC
Type:number
Default
Unboxing
Type:number
Default
Us_vs_Them
Type:number
Default

DateAggregation​Copy link
Type:string
enum
values
day
month
year

DisplayFormat​Copy link
Type:string
enum
values
carousel
dco
dpa
event
image
Show all values

EmotionalDrivers​Copy link
achievement
Type:integer
Default
Integer numbers.

anger
Type:integer
Default
Integer numbers.

authority
Type:integer
Default
Integer numbers.

belonging
Type:integer
Default
Integer numbers.

competence
Type:integer
Default
Integer numbers.

curiosity
Type:integer
Default
Integer numbers.

empowerment
Type:integer
Default
Integer numbers.

engagement
Type:integer
Default
Integer numbers.

esteem
Type:integer
Default
Integer numbers.

fear
Type:integer
Default
Integer numbers.

guilt
Type:integer
Default
Integer numbers.

nostalgia
Type:integer
Default
Integer numbers.

nurturance
Type:integer
Default
Integer numbers.

security
Type:integer
Default
Integer numbers.

urgency
Type:integer
Default
Integer numbers.


ErrorCode​Copy link
Type:integer
enum
Integer numbers.

values
200
400
401
402
403
Show all values

ErrorResponse​Copy link
error
Type:object
required
metadata
required

Any of
Metadata
count
Type:integer · Count
nullable
Integer numbers.

cursor
nullable

Any of
Cursor
Show Schema Details
filters
Type:object · Filters
nullable
message
Type:string · Message
Default
order
Type:string · Order
nullable
processed_at
Type:integer · Processed At
Integer numbers.

status_code
Type:integer · Status Code
Default
Integer numbers.

success
Type:boolean · Success
Default
data
nullable
Default

HTTPValidationError​Copy link
detail
Type:array object[]

ValidationError

Language​Copy link
Type:string
enum
values
dutch, flemish
english
french
german
italian
Show all values

LimitedUserResponse​Copy link
email
Type:string
required
id
Type:string
required

Live​Copy link
Type:string
enum
values
true
false

MarketTarget​Copy link
Type:string
enum
values
b2b
b2c

Metadata​Copy link
count
Type:integer
nullable
Integer numbers.

cursor
nullable

Any of
Cursor
Type:integer · Cursor
Integer numbers.

filters
Type:object
nullable
message
Type:string
Default
order
Type:string
nullable
processed_at
Type:integer
Integer numbers.

status_code
Type:integer
Default
Integer numbers.

success
Type:boolean
Default

Niche​Copy link
Type:string
enum
values
accessories
app/software
beauty
business/professional
education
Show all values

OrderBy​Copy link
Type:string
enum
values
Timestamp
LatencyMs
ResponseStatus
CreditsUsed

PaginatedMetadata​Copy link
count
Type:integer
nullable
Integer numbers.

cursor
nullable

Any of
Cursor
Type:integer · Cursor
Integer numbers.

filters
Type:object
nullable
message
Type:string
Default
order
Type:string
nullable
processed_at
Type:integer
Integer numbers.

status_code
Type:integer
Default
Integer numbers.

success
Type:boolean
Default

PersonaModel​Copy link
age
Type:string
Default
gender
Type:string
Default

PublisherPlatform​Copy link
Type:string
enum
values
facebook
instagram
audience_network
messenger
tiktok
youtube
linkedin
threads
whatsapp

SimpleMetadata​Copy link
message
Type:string
Default
processed_at
Type:integer
Integer numbers.

status_code
Type:integer
Default
Integer numbers.

success
Type:boolean
Default

SortOrder​Copy link
Type:string
enum
values
newest
oldest
longest_running
most_relevant

SwipefileSortOrder​Copy link
Type:string
enum
values
saved_newest
newest
oldest
longest_running
most_relevant

TimestampedTranscriptionModel​Copy link
endTime
Type:number
required
sentence
Type:string
required
startTime
Type:number
required

UsagesResponse​Copy link
end_date
Type:string
Format:date-time
required
the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z

remaining_credits
Type:integer
required
Integer numbers.

start_date
Type:string
Format:date-time
required
the date-time notation as defined by RFC 3339, section 5.6, for example, 2017-07-21T17:32:28Z

total_credits
Type:integer
required
Integer numbers.

user
Type:object
required

LimitedUserResponse

ValidationError​Copy link
loc
Type:array
required

loc
msg
Type:string
required
type
Type:string
required
* 		Home
* 		
* 		Getting Started
* 		
* 		WTF is Foreplay??
WTF is Foreplay??
The TLDR on how Foreplay can help you scale your ad creative workflow and performance.

Written By Zach Murray
Last updated 10 months ago
TLDR
Foreplay is the worlds best platform to produce more winning ads.
When brands and agencies like The Ridge, Vayner Media and Hello Fresh start using Foreplay, they can’t stop.
These companies have achieved success through top tier creative velocity in 3 ways...
1. Automated Research to stop testing concepts that fall flat.
2. Lightning fast Analysis into whats working for them.
3. A clean Production process to iterate and launch new ads.
Foreplay gives you 5 simple apps so you can achieve these outcomes on repeat.
Foreplay’s Apps & Products Overview

1. Research Products
Swipe File - Save ads from anywhere 
Say goodbye to screenshotting ad ideas only to be lost. Join 30,000 marketers using our 

Chrome Extension
 to save, organize & share ads from anywhere. (Even save ads from your phone using our Mobile App.

Learn more → 

Saving & Sharing Ads

Discovery - Over 70m winning ads
This is your new ad search engine - With over 70m ads (and growing every day). Find new competitors and discovery trending concepts to add to your Swipe File.
Learn more → 

Getting Started with Discovery

Spyder - Track competitor advertising
Track every ad your competon autopilot. Analyze creative test, find their top performing hooks and landing pages. Spyder even has over 2 years of historical data across 50,000 brands on beta.
Learn more → 

Getting Started with Spyder

2. Analysis Products
Lens - Creative analytics & reports
Connect to your own ad account to analyze creative with AI, build reports and securely share with anyone so you know where to double down and where to pull back. Gamify performance for your team and enjoy flat-rate pricing unlike other analytics platforms.
Learn more → 

Getting Started with Lens

3. Production Products
Briefs - Transform inspiration into action
Build creative briefs in 10x faster with AI and seamlessly share with anyone. Collect assets from external sources and finally say goodbye to endless revisions.
Learn more → 

Getting started with Briefs

Thats the summary of Foreplay, if you have any specific questions or special requirements feel free to Book a Demo.
* 		Home
* 		
* 		Getting Started
* 		
* 		Chrome Extension
Chrome Extension
Learn how to get the most out of the Foreplay Chrome Extension to save ads and analyze your competitors.

Written By Zach Murray
Last updated 10 months ago




📱The chrome extension is for desktop saving. Learn how to save ads from your mobile device using this guide.
Downloading the Chrome Extension
1. Ensure you have an active Foreplay Subscription or Free Trial.
2. Download the Extension
3. Pin it to your Chrome Tab
4. Ensure you have all ad blockers turned off on the sites you want to save from.
Using the Chrome Extension
The chrome extension will inject a save button directly in your web browser on multiple platforms allowing you to save ads to 

Folders & Boards
 .


1. Click the Dropdown Arrow
2. Search & Select a Board (If you click save without selecting a board it will still save to your Swipe File uncategorized)
3. Exit the Dropdown
4. Click Save



 ℹ️ When a board is selected it is NOT saved. Ensure that after selecting a board you click the button. Once the button turns green it is saved to your dashboard forever.
Create Boards & Folders
You can create a new board or folder directly from the save button without returning to your Foreplay Dashboard. To do this;

1. Click the Dropdown Arrow
2. Click “New”
3. Click “New Board” or “New Folder”
4. Type board or folder name
5. Click the checkmark
Now you can save ads to the new destination. Learn more using boards and folders here.
Bulk Saving to a Default Board
When you are doing creative research you are often saving in bulk to a single board. You can automatically apply a board to all save buttons for faster saving.

1. Open the Chrome Extension modal by clicking the floating Foreplay icon
2. Click “Board Settings”
3. Select a Default Folder
4. Click “Apply”


ℹ️ This does NOT save every ad on the page. You still need to click the button on ads you want to save to your Swipe File.
 If you want to bulk-save every ad from a brand take a look at our Spyder product → 

Getting Started with Spyder

Supported Platforms
The Foreplay Chrome Extension allows you to save ads on desktop from the following platforms:
Meta Platforms
* Facebook Ad Library
* Instagram (Organic Feed)
TikTok Platforms
* TikTok Ad Library (EU Only)
* TikTok Top Ads
* TikTok (Organic Feed)
* TikTok Spotlight
LinkedIn Platforms
* LinkedIn Ad Library
Google Platforms
* YouTube Shorts
* Google Transparency Center (Coming Soon)
Troubleshooting Checklist
If you are having issues with ads saving with the Chrome Extension try the following before reaching out to support
1. Ensure you are logged into Foreplay
2. Ensure Ad blocker is turned off
3. Press Cmd+Shift+R to reset the extension
* Saving & Sharing Ads
* Learn how you can save and share inspiration from anywhere while doing creative research or simply scrolling on social.

* Written By Zach Murray
* Last updated 10 months ago
* How to save ads to Swipe File
* Swipe File is where you collect and organize all of your advertising inspiration. You can save ads to 
* 
* Folders & Boards
*  from endless places.
* 
* The Foreplay   Chrome Extension  to save ads from Facebook Ad Library, TikTok etc.
* From your mobile by   Connect your Instagram Account  account or through our mobile app.
* Using the Discovery Library
* From a brand you are tracking with Spyder
* How Share an Ad
* We are all saving ads to share with colleagues, creators or designers. Here’s how to share an ad from your swipe file with anyone:
* 
* Open the “Ad Details Drawer”
* Click the blue “Share” button (This will copy the link to your clipboard)
* Send the link to anyone
* To share a collection of ads checkout how to share a board.
* 
* 
* ℹ️ If you want to customize the way you’re shared links show up checkout the 
* 
* White Label Settings
* 
* Team Ads vs My Ads
* Once you 
* 
* Invite your team
*  to your Foreplay account you will be able to see all the ads and boards that you save together, here’s how to toggle your view between the ads you saved and your team as a whole.
* 
* 
* 
* Ad Saving FAQ
* Will ads I save from Facebook Ad Library last forever?
* 
* What types of ads can I save?
Folders & Boards
Folders and boards is the main organizational structure for everything in your Foreplay account. Learn how to keep your team organized.

Written By Zach Murray
Last updated 10 months ago
Organize Ads using Boards
When you save ads to your Swipe File they can be organized into Boards. Ads can exist in multiple boards and boards exist within folders.

To create a board:
1. Click the “Plus” icon in your sidebar
2. Click “Create Board”
3. Add a name
4. Click “Create Board”
How to Share a Board
Boards are a collection ads - think of it like Pinterest for ads. You can share a board via a public link with anyone, even if they don’t have a Foreplay account.
How to share a board:

1. Open a board from the side bar
2. Click the “Share” button in the top right corner (this copies a link to your clipboard)
3. Send the link to anyone


ℹ️ If you want to customize how your public share links look checkout 

White Label Settings
 to match your share links with your brand.

Tips Organize your Swipe File
Organizing your Swipe File is a breeze. The main board dropdown under each add card allows you to select 1 or multiple boards for the ad to live in, create boards or folders and remove ads from Boards.

How to use Folders
📂 Folders can be used to organize everything within your Foreplay account including:
* Boards
* Tracked Spyder Brands
* Briefs
The only product or feature that will not be available from your main sidebar is Lens brands and lens reports. When you open Lens there is a new sidebar where each brand has it’s own folder structure to organize reports.
Create & Manage Folders

To create folders:
1. Click the “Plus” icon in your sidebar
2. Click “Create Folder”
3. Add a name
4. Click “Create Folder”
Create & Manage Boards

To create boards:
1. Click the “Plus” icon in your sidebar
2. Click “New Board”
3. Add a name
4. Click “Create Board”
FAQ
Can a single ad exist in multiple boards?
* 		Home
* 		
* 		Swipe File
* 		
* 		Tags & Ratings
Tags & Ratings
Custom tags and ratings in your Swipe File allow you to filter and organize ads more broadly beyond boards and folders.

Written By Zach Murray
Last updated 10 months ago

1. Open the ad details drawer
2. Click the stars to edit a rating
3. Ad, or remove tags from the ad details drawer


ℹ️ All edits made to ratings and tags will be automatically saved once the action has been done. There is no way to reverse these actions other then re-adding the tags.
* 		Home
* 		
* 		Lens
* 		
* 		Getting Started with Lens
Getting Started with Lens
Leverage your performance data into creative insights so you can produce more winning ads.

Written By Zach Murray
Last updated 10 months ago
What is Lens?
Lens is performance reporting through a creative lens, allowing you to build, segment and share beautiful reports to clients or colleagues.

Learn more here 👉 www.foreplay.co/lens
1. How to set up Lens
Your connected ad accounts live within brands you create in Lens, here’s how to get started.

1. Go to app.foreplay.co/lens
2. Click “Connect Ad Account”
3. Name your Lens (Use the brand name eg. “Nike”)
4. Select Currency - Recommended to use the same currency as the ad account you are connecting.
5. Reporting Timezone - Recommend to use the same timezone as the ad account you are connecting.
2. How to connect a new Ad Account


🚨 You need to have admin-level permissions for the Meta ad accounts you want to connect.
1. Click on the ad platform you would like to connect to Lens. This will launch a pop-up to connect your data with Orcabase from Triple Whale (You do not need a Triple Whale account)
2. Click on your desired platform in the pop-up
3. Login to the selected platform and grant permissions.
4. Click Next

How to connect to new ad accounts

3. How to set ad account settings
After you have selected the ad account you would like to connect to Lens there are a few crucial settings to ensure you have the best experience.
1. Setting a Goal Metric
Choose a default metric to enable relevant insights throughout Lens. Whatever metric you choose here will be automatically displayed in multiple views and dashboards. We recommend choosing ROAS.
2. Default Attribution Window
Choose the default attribution window for your account. You will be able to change and compare attribution windows within any Lens Report, your default will be used on any new report you create or in any dashboard views.
3. Choosing a Benchmark Segment (eCommerce Only)
Lens benchmarks allow you to compare your creative metrics across 20,000 other ad accounts. To ensure you are seeing relevant data choose the settings that most closely match the business you are advertising.
* Industry / Niche: Aligns with the product or service you sell
* Average Order Value: Specify the AOV of your brand to be compared to similar companies. Recommended to use your store AOV and not your ad channel AOV.
* GMV / Revenue: Specify the yearly revenue range of your store to be compared to brands of a similar size.
4. Complete the Data Sync


Once you have successfully created your Lens brand, and connected an ad account it will take some some to sync all your historical data from Meta.  Depending on your account size and age, this can take multiple hours or even days. The good news is you can start using Lens once 7 Days of historical data is imported.
After that point, all your performance and data will be available as almost instantly, no more “waiting for Facebook” or clicking edit in Facebook Ads Manager to preview Ad Creative.
If you have any issues with your data sync please reach out to support in the bottom corner of your screen.
5. Start using Lens
It’s time to start learning how learn how to use Lens, here are the top 3 features you should understand.


Creative Tests


Top Performing Reports


Comparison Reports


Share a Report

Dashboard
The Dashboard is your mission control in Lens. It gives you a real-time snapshot of how your ad account is performing — no digging, no guesswork.

Written By Zach Murray
Last updated 10 months ago
Lens Dashboard Overview

Each brand you connect to Lens will have their own dashboard page. Here you will find:
* Spend and your Goal Metric
*   Creative Tests  - A overview of your creative tests based on targets. Click in to go deeper.
*   Benchmarking  - your core KPIs against your segments benchmark.
* Recent Reports - Reports you have recently created or opened.
* Creative Leaderboard - The top ads in your account by spend and goal metric.

Top Performing Reports
Learn how to create and leverage the Top performing report type using lens.

Written By Zach Murray
Last updated 10 months ago
Top Performing reports allows you to analyze individual ads based on a singular common element like Ad Name, Headline, Copy etc. Different from 

Comparison Reports
 which is a higher level view allowing you to analyze how different groups of ads are performing against each-other.

Creating a Report
Once you have created a Lens Brand and connected your ad account you can start creating reports. From the Overview Screen:
* Click “New” → Create Report
* Select “Top Performing Report”
* Enter a name and description
* Click “Create Report”

Choosing a Group Setting
By default all new reports created in Lens will group ads by “Ad Name”. This means all ads with the same name will be bundled together in the report giving you a holistic view of that ads performance across multiple campaigns or ad sets.
Here are all the grouping options available to you:
* Ad Name - Group together ads with identical names or Post IDs
* Creative - Group together ads with currently identical images or videos
* Copy - Group together ads with currently identical copy
* Headline - Group together ads with currently identical headlines
* Landing Page - Group together ads that lead to identical URLs
Selecting Date Range & Filters
In the top-bar you can begin filtering down to the ads you want included in your report. Some filters include Active Status, Campaign Name, Spend etc.
Check out the complete guide on 

Filters
 in Lens for more details.

You can also specify your date range in the top right corner to only display ads that spent during a specific time period.
Editing Your Top Performing Report
Reports are grouped into two main sections, the Graph Block and Table View. These two sections work together allowing you to select which metrics and ads you want to display, and in what format.

Visualization Block
The Visualization block allows you to visualize your advertising data and cherrypick metrics from your performance data to displayed in:
* Bar Graph (Up to 5 Metrics)
* Line Graph (Up to 2 Metrics)
* Card View (Up to 10 Metrics)
You can add and remove metrics from this view by clicking “Add Metric” in the header of the graph.
Table View
The table view allows you view all your performance metrics while editing which ads or groups are included in the Visualization Block above.


* Add/Remove ads and groups using the checkbox on the far left side of a row
* Pin Columns using the column header “Pin” icon
* Include the column in your visualization by selecting the checkmark icon in column header.
Checkout 

Customizing Columns
 to learn how to get the most out of the table view.

Saving Your Report


As you edit a report you will see a floating modal at the bottom of your screen allowing you to:
* Save your edits
* Cancel your edits
How to Change Attribution Windows in Reports

Lens allows you to easily toggle your conversion data based on multiple attribution windows. Currently we support:
Click Windows	View Windows
None	None
1 Day	1 Day
7 Day	7 Day
28 Day	28 Day
Now that you know everything about creating Top Performing Reports learn how to 

Share a Report
 or move onto creating a 

Comparison Reports
 .
Comparison Reports
Comparison Reports help you uncover high-level trends across your account—whether you're analyzing funnel stages, product lines, promotional angles, messaging, talent, or more. If it's reflected in your Ad, AdSet or Campaign name - you can compare it. Use this feature to spot what’s working, what’s not, and where to optimize.

Written By Zach Murray
Last updated 10 months ago

Create a Comparison Report
1. Select your Lens brand from app.foreplay.co/lens
2. Click “Create Report”
3. Select “Comparison Report”
4. Name your report and add an optional description
Creating and Comparing Groups
Unlike 

Top Performing Reports
 which group results by a single dimension, Comparison reports allow you to create multiple groups for you to compare.


1. Click Ad Group
2. Name Your Group
3. Add 1 or Multiple Filters
When creating groups you can add one or multiple filters to define that group. You can create groups based on.
More Details about Comparison Reports
All report features beyond the way ads are being grouped are the exact same as 

Top Performing Reports
 ← check out this article to see how you can:

* Manage your report visualizations
* Edit your table view
or, checkout these articles for more.
*   Share a Report 
*   Customizing Columns 
Creative Tests
The creative test's dashboard allows you to define targets and easily see whats working among your new creatives.

Written By Zach Murray
Last updated 10 months ago
How to use Creative Tests in Lens
Use Creative Tests to see all of your ad creative performance from a birds eye view, plotted on a scatter chart and divided into performance quadrants.
1. Set targets
2. Update timeframe
3. Identify losing, scaling and winning ads
4. View ad creative launches by date
5. Analyze and iterate on winners

Setting Targets
The Creative Tests tab in Lens helps you turn creative experimentation into a repeatable system. Setting the right targets is critical to identifying winners, scaling efficiently, and minimizing waste.

1. Launch Window
Why: Focus on recent launches to evaluate fresh performance signals.
* Recommended setting: Last 14 days
* This keeps your data current and ensures you’re evaluating ads that are still in their early test phase.
2. Define a Scaling Metric
Why: Determines which ads have been given enough budget to be considered for scale.
* Recommended metric: Spend > $100
* You can adjust this threshold depending on your budget.
3. Define a Winning Metric
Why: Establishes clear criteria for what qualifies as a "winner" among scaled ads.
* Recommended metrics: ROAS, CPL, CPC etc.
* Example:
    * Scaling metric: Spend > $100
    * Winning metric: ROAS ≥ 1.5
4. Define Losers
Why: Easily identify concepts or styles that should be avoided in the future. You can learn as much from your losers as your winners.


ℹ️ For your “Targets” in Creative Tests to persist ensure you click “Save” after making changes to your targets.

Customizing Columns
Not all metrics matter equally to every team. That’s why Lens lets you fully customize your column view—so you can focus only on the data that matters most and create presets to be used across your entire account.

Written By Zach Murray
Last updated 10 months ago


How to customize columns
Column customization and presets are available on Top Performing and Comparative reports. To edit your columns;
1. Click the “Customize Columns” button above the table view
2. Select your metrics
3. Click “Apply”
Remove & Re-Order Metrics
You can remove or re-order metrics using the panel on the right-hand side which displays your currently active columns or preset.


Create & Manage Column Presets
With Lens you can create column presets that live across all the accounts you have connected.
Create a new preset: 

1. Open the “Customize Columns” drawer
2. Select your desired metrics
3. Click “Save new preset”
4. Name your preset
5. Click Save
Update a Preset:

1. Open the “Customize Columns” drawer
2. Select the preset you want to update
3. Make your desired edits or re-order
4. Click “Update Preset”
Custom Conversions & Metric Presets


Custom Conversions
 used in column presets will only work inside the Lens brand where it was created. If you create a column preset on Brand 1 using a custom conversion, and try to use it in in “Brand 2” values will return “Null” or “0”.

* 		Home
* 		
* 		Lens
* 		
* 		Share a Report
Share a Report
Learn how to create a external link to share reports with users inside your Foreplay team or as a guest - perfect for agencies looking to share reports with clients.

Written By Zach Murray
Last updated 10 months ago
Creating a Share Link
To share a report via a link first, save your report and then click the “Share” button in the top right corner. A modal will appear.

Option 1: Live Updating Links
Live updating share links should be used when you expect the link to be used now, and into the future. This share link allows you to set a specified date range that will be updated into the future.


Example: If you want a report of the Top Performing ads to share with your clients. Create a share link that will always display data from the last 7 days.  Your client will be able to look at this link and see updated data from today, into the future.
Option 2: Static Snapshot Links
Static snapshot share links should be used when you want to share data from a defined date range. This share link allows you to set a specific start and end date that will never be updated no matter when someone views the link.


Example: If you want to share a Influencer Comparison report with your performance manager for the month of June, create a share link from June 1st → June 31st.  Your manager will be able to look at this link and see the historical data from this time period.
Report Security
Keeping your advertising data safe is important there are 2 ways to keep your creative data secure when sharing links externally.


1. Enable Password Toggle on a password for your share link. This means whoever you share the link with will need a password to access.
2. Tracking Open & IPs If you enable this toggle you will be able to keep track of every time a report is opened and from what location.
Managing & Deleting Share Links
You can create an unlimited number of share links for a report. They will simply be named by the date they were created.

If you ever want to un-publish or delete a link;
1. Click on “Share” from the report
2. Click on the desired share link from the left side of the modal
3. Clicking the three dots in the top right will give you two options a. Un-publish Link: This will disable the live link but allow you to re-publish in the future. b. Delete Link: This will permanently delete the links.


* 		Home
* 		
* 		Lens
* 		
* 		Filters
Filters
Learn how to filter your reports to narrow down the segment you want to analyze, creating contextual creative reports.

Written By Zach Murray
Last updated 9 months ago




ℹ️ You can stack and combine fields using using ‘And’ + ‘Or’ conditions to create specific and segmented reports to share with anyone.

Filters on the top-level are joined with ‘And’, within these top-level filters you can add sub-level ‘Or’ conditions. Take the following example:


With these filters, we require that all ads have either spend > 1,000 or ROAS > 1.5, and we require that all ads are all active.
If you are looking to compare filter groups, checkout 

Comparison Reports
.

Metadata Filters
Campaign Structure
Filter based on the structure and name in your Campaign, Ad Set or Ad.
Setup & Status
Filter by how and if your creative is being delivered.
Ad Contents
Filter based on fields within the ad unit, such as ad type, landing page, copy, etc.
Metrics
Foreplay Scores
See 

Foreplay Scores

Performance Metrics
Standard paid media and distribution metrics such as Spend, Impressions, CPA etc.
Engagement Metrics
Data associated with how users are interacting with your ad such as Likes, comments, shares etc.
Media Metrics
Data associated with the retention of the ad asset itself such as hook rate, thumb stop ratio, thruplay etc.
Conversion Metrics
Data associated with ad platform native conversions such as Website Purchases and Shop purchases.
Custom Conversions
If applicable, you can also filter by custom conversions imported from your Meta Ad account.

* 		Home
* 		
* 		Lens
* 		
* 		Lens Account Settings
Lens Account Settings
Learn how to edit and manage your account settings for each ad account in Lens.

Written By Zach Murray
Last updated 7 months ago
How to edit Connection Settings
1. Open your account settings 👈


Select “Lens” under your account settings. You can edit your connection for multiple accounts here.
2. Select “Manage” next to your Facebook account


After you select “Manage” you’ll be taken to the Meta Ads connector settings. You can edit your connection for multiple accounts at once.
3. Select “Reconnect” in the connector window


4. Choose the businesses you want to connect to Lens


We recommend selecting “Opt in to all current and future businesses” to automatically update your access. However, you can select a specific businesses if you prefer. Note that you will have to manage your connection here to add new businesses every time you want to create a new Lens.  When you’re finished, select “Continue”.
5. Confirm Connection


Review and accept the access request to enable Lens to retrieve data from the selected pages and ad accounts.
6. Connection Complete


Your connection is complete. Select “Got it” to close the connector.
How to edit Lens Report Settings
Settings you can edit anytime:
✅ Benchmark segments: Niche, AOV, GMV ✅ Default Attribution Window (The attribution window used when creating a new report, however you can always edit this at the report level.)
Settings you can NOT edit:
⛔ Currency ⛔ Reporting Timezone


⛔ If you need to make changes to currency or reporting timezone you must delete the Lens brand and make the correct selections while creating the brand.
How to Delete a Lens Brand
1. Open your account settings 👈
Select your profile picture from the bottom left corner to open your settings. You can also click this link: https://app.foreplay.co/library?settings=lens-overview


2. Select the Lens account that you want to delete
From the left navigation, select the Lens account you want to delete. This is also where you would go to reconnect a Lens account.


Note: This is in your Lens settings. Click this link to open your settings: https://app.foreplay.co/library?settings=lens-overview
3. Delete the brand
Select the red “Delete Lens” button to delete the Lens account. You can replace it with another Lens after deleting.
Benchmarking
Wondering if your performance is actually good? With Benchmarks in Lens, you can compare your key metrics against real-time data from over 20,000+ advertisers—so you know exactly where you stand.

Written By Zach Murray
Last updated 10 months ago


Benchmarks are displayed on the main Lens page and on your 

Dashboard
 screen.

How Benchmarks are Calculated & Visualized
Benchmarks in Lens are based on real-time median performance from over 20,000+ advertisers.
* The benchmark is represented by the black dot in the center of the visual scale.
* This value reflects the median for each KPI — meaning 50% of advertisers are performing above it, and 50% below.
* Your own metric is plotted to the left (worse) or right (better) of the benchmark so you can quickly see how you're performing relative to the market.
Benchmarks are updated daily, ensuring you’re always comparing your results against the freshest data available.
This allows you to spot outliers, track progress, and understand what “good” actually looks like in your industry.


🚨 Currently benchmarks are only supported for physical product advertisers - think eCommerce stores. Benchmarks for lead generation and media are coming soon.
GMV & AOV Segments
To ensure benchmark accuracy, Lens segments data by GMV (Gross Merchandise Volume) and AOV (Average Order Value).
GMV Segments:
* <$1M
* $1M–$10M
* $10M
AOV Segments:
* <$100
* $100
Physical Product Niches
* Art
* Baby
* Books
* Clothing
* Electronics
* Fashion & Accessories
* Food & Beverages
* Health & Beauty
* Home & Garden
* Pet Supplies
* Sporting Goods
* Toys & Hobbies
* Other

Foreplay Scores
Foreplay Scores offer a convenient way to see how your ad stacks up against all the other ads you've launched under your Lens brand.

Written By Nathan Raymant
Last updated 10 months ago


Measuring Creative Potential with Spend-Agnostic Percentiles
Foreplay Scores are designed to help you identify winning creatives, before investing in scale. Performance is evaluated on a per-dollar-spent basis, and weighed in comparison to the ads you have launched previously.  For example, if an ad has a Click Score of 65, that means it has netted more clicks per dollar spent than 65% of the ads you’ve ran.  By using spend-agnostic measures, ads with $200 spend can be compared to ads with $20k spend on an equal playing-field, helping you identify winners with potential for greater returns on investment before spending big.
What Metrics are used for Computing Foreplay Scores?
With the assumption that all scores are computed on a per-dollar-spent basis, here are the metrics we use to determine where your ad falls relative to all other ads in your Lens brand:
Hook Score (Video Only)
Depends on the ‘Hook Rate’ metric, defined as the percentage of user impressions that viewed at least the first 3 seconds of the video.
Watch Score (Video Only) 
Depends on the ‘Thruplay’ metric, defined as the number of times a video was entirely played (if shorter than 15 seconds), or the number of times more than 15 seconds of a video was played.
Click Score
Based on the number of times the ad was clicked.
Convert Score
Depends on the number of conversions attributed to this ad (using a fixed 7-day-click/1-day-view attribution window).
Viral Engagement Score
Depends on the amount of social media engagements on the ad, summing together likes, comments, and shares.
Identify Creative Opportunities
Foreplay Scores offer an intuitive way to identify creative potential at a glance, without having to worry about understanding the specifics of the account. Easily spot winners in your campaigns that outperform the rest.
* 		Home
* 		
* 		Lens
* 		
* 		Custom Conversions
Custom Conversions
Custom conversions let you create rules for events, allowing you to measure more specific customer actions and the value they generate. Learn how you can utilize your custom conversions in Lens.

Written By Nathan Raymant
Last updated 10 months ago
Learn about creating custom conversions in Meta:
https://www.facebook.com/business/help/780705975381000?id=1205376682832142
Importing Custom Conversion Events
Lens will automatically import custom conversions defined in your Meta Ad account for use in all areas of the product, including 

Top Performing Reports
 , 

Comparison Reports
 , 

Filters
 , etc. When custom conversions are successfully imported, they will appear under the ‘Conversions’ section in the customize columns drawer:



Every time Lens pulls the latest data from your ad accounts, we will check for any new custom conversions. This means there may be a delay (up to 24 hours) between when you create the conversion event and when it gets added to Lens.
Three Selectable Metrics for one Conversion Event
For each custom conversion imported, we generate three metrics for use within Lens:
* Total — The total number of times this event occurred.
* Value — The total value generated by occurrences of the event (depending on its user-defined value)
* Cost — The average cost per conversion event (total conversions / spend)
Notes
Custom conversions are specific to ad accounts, and therefore specific to the Lenses that use said ad accounts. If you save a custom conversion metric to a column preset, those metrics will not appear when using that preset in other Lenses.
* 		Lens
* 		
* 		Table Net Results
Table Net Results
Summary Net Statistics in Lens tables help you see the overall performance of your filtered view at a glance. Let's discuss how we compute these statistics.

Written By Nathan Raymant
Last updated 10 months ago


Holistic Aggregation
Using the correct aggregation techniques is important for producing meaningful statistical overviews over large sets of data. Lens intelligently aggregates metric data so you always have meaningful net results.  In the ‘Net Results’ row, which appears at the bottom of tables containing metric data, we display the net results for each column in the following format: <Net> Avg. <Weighted Average>
Computing Net Values
For net values (on the left), we display the aggregated value across all groups in the filtered view. Meaning if, for example, you were filtering your report to only include active ads, then we would only be aggregating across active ads.  For base metrics (i.e., simple counts that we get directly from Meta, such as spend, impressions, etc.) we sum the values of all the rows in the table.  For computed metrics (i.e., any metric that depends on a formula, such as rates, ratios, percentages, etc.), we apply the formula again on the highest level, using the summed base metrics.
For example, when computing Net CPM (Cost per Mille), we take the sum totals for spend and impressions, and use those values to compute the overall Net CPM: Net CPM = (Total Spend / Total Impressions) * 1000
Computing Weighted Averages
For averages (on the right), we compute the values using a system of weights depending on spend. This means that ads/groups with a higher proportion of the total spend will contribute more to the average value compared to ads/groups with relatively less spend.  This strategy ensures average values are more reflective of performance over greater user exposure.
Why is this useful?
Say you have an ad that has $20 spend, and that ad makes a conversion for a value of $200 (lucky!) — This would result in the ROAS for this ad being computed at 10. Of course this is an anomalously high ROAS, and is not generally reflective of how the ad would perform at scale.  Weighting by spend helps to reduce the impact of low-spend outliers, resulting in a more accurate overview of how these ads are performing under typical conditions.
* 		Home
* 		
* 		Lens
* 		
* 		Inspiration in Lens
Inspiration in Lens
The "Inspiration" tab in Lens gives you fresh, curated inspiration from Foreplay's Discovery library meaning you have fresh ad inspiration based on any account you have connected to Lens.

Written By Jack Kavanagh
Last updated 10 months ago

* Use the Lens Inspiration tab for automated ad creative inspiration based on top-performing ads.
* This tab contains a curated collection of ads that you can use for your marketing campaigns.
Tips for Efficiency
* Set a routine to check the Inspiration tab weekly for new ideas.
* Share findings with your marketing team to foster collaboration and creativity.
* 		Home
* 		
* 		Lens
* 		
* 		Export a Report
Export a Report
Learn how to export a Lens report as a CSV to be used further in Excel or Google Sheets.

Written By Zach Murray
Last updated 10 months ago

1. Open a   Top Performing Reports  or  Comparison Reports 
2. Click the three dots in the top right corner
3. Click “Export as CSV”
A .CSV file will be sent to your downloads folder to be used wherever CSVs are supported.
Getting Started with Discovery
Discovery is the worlds largest community ad search engine. With over 70 million ads you can see a live feed of every ad saved by other Foreplay users and use advanced search to find new trends, products and ad strategies.

Written By Zach Murray
Last updated 10 months ago

Ads you find in Discovery can easily be saved to your Swipe File for safe keeping or shared with anyone. Learn more in this article → 

Saving & Sharing Ads

Most Loved Discovery Features
*   Search Discovery  Keyword, Brand, Creative Target or Product Category
*   Foreplay Experts  - See ads saved by the best minds in advertising today.
* Filter Ads based on Format, Platform, Active Status, Target Market etc.
* Sort by Newest, Longest Running etc.
* Refresh your search using the   Shuffle Button 
Search Discovery
More then a standard search bar, Discovery search allows you to query based on Keyword, Product Category, or creative target. Here's how to get the most from search:

Written By Zach Murray
Last updated 10 months ago

1. Go to Discovery
2. Click the search bar and start typing
3. Review the suggested Creative Targets, Product Categories or Brands.
4. To make a keyword search simply hit “Return” on your keyboard  

1.     
As you work through searching the extensive Discovery Library you can always use the 

Shuffle Button
 to refresh any search.

Brands Tab in Discovery
The brands tab in discovery allows you to see the most popular brands in Foreplay, filter and search to dive into each brand and see all ads that have been saved by the Foreplay community.

Written By Jack Kavanagh
Last updated 10 months ago

1. Inside Discovery click the “Brands” tab
2. Ad filters or search
3. Open the brand


ℹ️ For more detailed competitor or brand analysis add them to Spyder to see every ad they have ever published along with more rich details like top performing hooks and landing pages.
Foreplay Experts
Experts are a collection of Swipe Files built by the Foreplay community. It allows you to see and track the ads that top experts are saving to their own Swipe File. You can apply to be listed as an expert here.

Written By Jack Kavanagh
Last updated 10 months ago

View Foreplay Experts
1. Go to Discovery
2. Click the “Experts” Tab
3. Open the expert profile
4. Save ads to your own Swipe File
Become a Foreplay Expert
To be featured as a Foreplay expert please fill out this form and we will be in contact with next steps
* 		Discovery
* 		
* 		Shuffle Button
Shuffle Button
With over 70 million ads in the Discovery library, keyword searches and filters don’t always surface the juiciest bits of inspiration to the top. Here's how to use the shuffle button to get endless inspiration.

Written By Zach Murray
Last updated 10 months ago

1. Perform a search in Discovery
2. Locate the “Shuffle” button in the bottom left corner
3. Click “Shuffle”
Once you’ve clicked Shuffle, watch as a new set of relevant ads appears based on your filters or keyword search. If you need more ideas, keep clicking! There’s no limit to how many ads Shuffle will pull for you.
Getting Started with Spyder
Track every ad your competitors launch and extract insights and inspiration from their creative strategy.

Written By Zach Murray
Last updated 10 months ago

How to use Spyder
Spyder does the heavy lifting of competitor ad tracking on autopilot. It will automatically save and store all ads for a brand, along with allow you to inherit historical data for brands that have been tracked by users in the past.

To dive deep, here are some other articles on specific Spyder features.
*   Track Competitor with Spyder 
*   Competitor Creative Tests 
*   Competitor Hooks 
*   Competitor Landing Pages 
*   Timeline View 
*   Spyder Credits & Usage 
Spyder FAQ
How long can I access the tracked ads?

Will I get historical ads with Spyder?

Track Competitor with Spyder
Adding a brand to Spyder will track every ad they launch on all Meta advertising platforms 24/7 while keeping a complete historical record of their advertising.

Written By Zach Murray
Last updated 10 months ago

Adding a Brand to Spyder
Option 1: Searching for the Brand


1. Go to app.foreplay.co/spyder
2. Click the “+” icon in the top right corner
3. Search for the brand(s) you want to track
    * If you don’t see the brand you want to track you can the Add Manually option
4. Select a Folder
5. Click “Add Spyder Brand”
Just like that you have lifetime access to every ad your competitors launch on Meta. For over 20,000 brands you will also have historical data from as early as August 2023.
Option 2: Manually Adding a Spyder Brand


If you are trying to track a brand that has never been added to Spyder, or has never had a single ad saved from it to Foreplay your best option is to add this brand manually.
1. Go to app.foreplay.co/spyder
2. Click the “+” icon in the top right corner
3. Click the “Add Manually” toggle
4. Copy the Facebook Ad Library URL of the brand you want to track
5. Paste it in the “Facebook Ad Library” URL field
6. Select a Folder
7. Click “Add Spyder Brand”


ℹ️ Manually tracked brands will start collecting data immediately. It may take 5-10 minutes for all currently active ads to be loaded in.
Opening a Brand in Spyder from Discovery
While browsing Discovery you can quickly open and add a brand to track in Spyder. Here’s how”

1. Click on the brand avatar
2. Click “Track Brand in Spyder”
3. Choose a Folder
4. Click “Ad Brand Manually”
Competitor Creative Tests
This tab on a Spyder brand page allows you to view all of your competitors creative testing and track which ads they are keeping on vs which ads they are turning off.

Written By Zach Murray
Last updated 10 months ago

Creative Testing Thesis


The creative tests tab bundles ads launched by your competitors by date and tracks their active status over time so you can compare what messaging and formats are working for them.
Click on any ad to open the ad details drawer.
Winning Ads Badge
The “Winner Identified” badge will be applied to a group when 1 ad of the cohort is the only active ad still running.
Competitor Hooks
All video ads in Spyder are automatically transcribed allowing you to easily view all the hooks they are testing in one place.

Written By Zach Murray
Last updated 10 months ago

Pin & Export Hooks
From the hooks tab you can pin specific hooks to easily export the hooks as a CSV or copy them all to your clipboard.

Competitor Landing Pages
Spyder also tracks all the landing pages your competitors are running on paid social. Here's how to get the most out of the Landing Pages tab in Spyder.

Written By Zach Murray
Last updated 10 months ago

Mobile & Desktop Screenshots
Each landing page has a screenshot of both Desktop and Mobile versions. Here is how to download the landing pages:

Timeline View
Similar to competitor creative tests in Spyder, the timeline view is a complete historical timeline of your competitors creative launches that you can filter by date range. Here's how to use it:

Written By Zach Murray
Last updated 10 months ago

Timeline View Features
* View specific date ranges (Historical data up to 3 years old)
* Filter by Format, Platform, Language, Status or Niche
* Sort ads by Newest, Oldest & Longest running
Billing & Plans
Foreplay has flexible plans for brands and agencies of all sizes. Learn more about the feature and usage options.

Written By Zach Murray
Last updated 10 months ago


The best way to compare Foreplay plans is on our Pricing page.
Custom Plans
For users who need custom or extensive usage requirements we offer custom plans. Please Book a Demo so we can find a solution for you.
Benefits of Paying Annually
✅ Save ~15% on all plan types ✅ Get UNLIMITED Spyder credits for the entire year (only available to annual subscribers).
Foreplay Legacy Plans
On May 28th, 2025 Foreplay announced the current pricing. Users on legacy plans named “Inspiration” or “Workflow” can keep their old subscription.
For most accounts with multiple users upgrading to a non-legacy plan will decrease their per-user price and offer more usage in Spyder and with the addition to Lens.
Primary changes to legacy users
* Briefs is no longer gated to the “Workflow” plan and is available across all account types.
* The 2 free promotional Spyder credits are no longer available on the legacy plans.
Custom Plans
Learn about Foreplay's enterprise features and how to sign up for the Enterprise plan and save up to 80% on your subscription.

Written By Zach Murray
Last updated 10 months ago


For extensive usage or custom requirements Foreplay offers custom plans on our enterprise tier where users can save up to 80% of the self-serve cost.
Book a Demo so we can help find the right solution for you.
Trial Cancelation

Written By Zach Murray
Last updated 8 months ago
When you sign up for a trial of Foreplay you will select a plan to trial for 7 days and enter a credit card. After your 7-day free trial you will be automatically subscribed to the plan you are trialing and your credit card will be charged.
During your 7-day trial you can cancel your trial to opt-out of auto-billing from the Account Settings page.
Refunds for Subscriptions
We understand some people might forget cancel their trial - If Foreplay isn't for you, we offer a 14-day money back guarantee after your first charge.
Edit Your Profile
Learn how to change your Foreplay account name and profile photo.

Written By Zach Murray
Last updated 10 months ago


ℹ️ Your display name and photo are used when commenting inside Foreplay and on the links of Shared Boards and Shared Ads.
Change Display Name

1. Go to “My Account” on the Account Settings Page
2. Click on “First Name” or “Last Name”
3. Enter your desired name
4. Click “Save Changes”
Change Avatar / Photo


1. Go to “My Account” on the Account Settings Page
2. Click the “Upload” button
3. Choose an image from your computer
4. Click “Save Changes”
To edit the way your company is displayed on share pages checkout the 

White Label Settings
 article.

Update Password
Learn how to update the password to your Foreplay account.

Written By Zach Murray
Last updated 10 months ago
To update the password of your Foreplay account;
1. Go to “My Account” on the Account Settings Page
2. Click the “Reset Password” button
3. We will send an email to reset your password From email: noreply@notifications.foreplay.co Subject: “🔒 Reset Foreplay Password”
4. Click the link in the email
5. Enter a new password
6. Click Save
Change from Google Login to Password
If you created your account using the “Signup with Google” login and you want to update it to traditional email and password, go through the normal “Reset Password” flow.
1. Go to “My Account” on the Account Settings Page
2. Click the “Reset Password” button
3. We will send an email to reset your password From email: noreply@notifications.foreplay.co Subject: “🔒 Reset Foreplay Password”
4. Click the link in the email
5. Enter a new password
6. Click Save
Transfer Admin Rights
Change account admin or transfer your Foreplay account ownership to a new email.

Written By Zach Murray
Last updated 10 months ago


🚨 You MUST be the current admin on the account to request this transfer. If your current admin can not access the account, please reach out to support hello@foreplay.co


To safely transfer the admin rights of an account to a new email the Foreplay team will do this on the backend within 48 hours. To request this transfer:
1. Go to “Team” on the Account Setting Screen
2. Click “Transfer Admin”
3. Fill-out the form and include a. The current admin email on your account. b. The email you would like to make as admin


ℹ️ The email you are requesting to transfer to must be a currently active team member on the Foreplay account.
Teams & Members
Foreplay is better with friends. Learn how to create teams and manage permissions for rockstar creative collaboration.

Written By Zach Murray
Last updated 10 months ago
Create a Team
To invite users to your Foreplay account and unlock 

White Label Settings
 you must create a team.


1. Go to “Team” on the Account Settings page
2. Click “Create a Team”
3. Enter a team name
4. Upload your logo (Choose a square logo with background for the best appearance)
5. Click “Create Team”
Invite Team Member

Additional team members in addition to what is included in your subscription will cost $20 per month. You can learn more about Foreplay pricing here.
1. Go to “Team” on the Account Settings page
2. Click “Invite New Team Member”
3. Enter your team member’s email
4. Click “Invite”


ℹ️ Your team member will receive an invite email. If they already have a Foreplay account or trial under this email, their data will be transferred to the team account.
 For any special data migration requests reach out to hello@foreplay.co
Additional team members in addition to what is included in your subscription will cost $20 per month. You can learn more about Foreplay pricing here.
Remove Team Member

1. Go to “Team” on the Account Settings page
2. Click “Remove” on the team member you want to remove.


ℹ️ When you remove a team member, This will revoke their access to team resources. You can invite them back anytime if needed.

✅ The user will retain a copy of the ads they've saved, as well as their created boards, folders, briefs, comments, and tags.

✅ Your team will still have all of their contributions.

⛔ The user will not retain access to manually uploaded content or spyders, as these are owned by the team.
 For any special data migration requests reach out to hello@foreplay.co
Delete a Team
1. Go to “Team” on the Account Settings page
2. Click “Delete Team” (You cannot delete a team with active members)


ℹ️ When you delete a team you will lose access to data contributed by other users. This action is permanent and cannot be undone.

White Label Settings
Learn how to white label your share links for reports, ads and boards.

Written By Zach Murray
Last updated 10 months ago



ℹ️ You need to Create a Team before setting up your white label settings.
White labeling your share links is a great way for agencies to convey brand consistency when sharing reports or inspiration boards with a client. To set-up your white label experience:
1. Go to “White Label Settings” on the “Account Settings” Screen
2. Upload your logo (Use a square logo with background colour for best results)
3. Enter your Company Name
4. Enter your Company URL for a backlink to your website
5. Add your primary brand colour to adjust the gradient on the page
As you set-up your white label settings there is a preview on the right-hand side to make adjustments to colour.
Once these settings are saved, all share links from your team will have the white label design.
Connect your Instagram Account
Save ads natively while scrolling Instagram by connecting it with your Foreplay account. No account access required.

Written By Zach Murray
Last updated 9 months ago

1. Open your Foreplay settings 👈


Select integrations from the left navigation bar under “Account & Team”
2. Select “Connect” to connect Instagram to Foreplay


You can find the connect button on the right side of the Instagram integration
3. Enter your Instagram handle (username)


The first field is where you enter your instagram username. This tells the Foreplay Instagram account what your Instagram handle is, so that when you send posts to the Foreplay Instagram account, Foreplay saves these to your Foreplay account. This is how we achieve a connection without account access.
4. Select the board you want to save ads from Instagram to 


The location field is where the posts you send from Instagram to the Foreplay instagram account will be saved. This tells Foreplay to save your ads in a specific location. Then click the blue “Connect” button.
5. Send ads from Instagram to @foreplay_co 


Save ads to your Foreplay swipe file by sending them to @foreplay_co on instagram

Guest Users in Lens
Collaborate on Lens accounts with clients or external collaborators.

Written By Zach Murray
Last updated 8 months ago
You can now collaborate on a Lens brand with users who are not part of your core team. This is especially useful for agencies working with clients—now you can share a Lens account directly with them, even if they don’t already have a Foreplay account.
How to Invite a Guest User

1. Go to Account Settings
2. Select the Lens account you want to invite a guest to
3. Scroll down to Guest Users
4. Click Invite Guest
5. Enter their email and send the guest invite.
What Happens Next?
1. If the guest already has a Foreplay account: They’ll receive an email invitation and can start collaborating on the Lens immediately.
2. If the guest does not have a Foreplay account: They’ll receive an email prompting them to create a Guest Account.
    * Guest Accounts are free.
    * All other Foreplay features will remain locked for Guest Accounts.
    * They’ll only have access to the Lens you shared with them.

Getting started with the Foreplay API
The Foreplay API allows you to access any Foreplay data to build on-top of our advertising database of over 100m ads or build custom agentic workflows in platforms like N8N, Gumloop or Zapier.

Written By Jack Kavanagh
Last updated 7 months ago


ℹ️ You are currently on the platform knowledge base.For full technical documentation go here 👉 API Technical Docs 🔗  To chat with the the API technical docs 👉 Foreplay API GPT 🔗
How to get your API key
The Foreplay API is available across all plan types (excluding legacy plans). If you are having trouble accessing your API key or have questions about credits, check out Credits & Pricing
⚠️ Treat your API key like a password, don’t share it publicly or paste it into forums.

To create your access key.
1. Go to your API settings: https://app.foreplay.co/api-overview
2. Click the copy icon
Logs & Troubleshooting
As you are working with our API you can access logs directly from the API dashboard.
Access Logs Here: https://app.foreplay.co/api-logs


You can filter your logs by:
* IP Address
* Country
* Endpoint
* Response Status
Credits & Pricing
The Foreplay API works on a credit system. Learn how to use and reload credits for the API.

Written By Zach Murray
Last updated 7 months ago


What is a Credit?
1 ad = 1 credit including all metadata associated with that single ad.
Example 1: A query that pulls 100 ad transcripts, uses 100 credits.
Example 2: A query that pulls 100 ad transcripts including video, copy, landing page etc. also uses 100 credits.
Free/Included Credits
All current (Non-legacy) Foreplay plans come with 10,000 monthly credits included. Annual plans get a bonus of 20,000 total credits per month. Annual plans get their annual credit allowance upfront.
Additional Credit Pricing
Additional credits can be purchased in tiers of 100,000, 250,000 and 500,000 credits per month. Learn more here.
Custom pricing or pay-as-you-go API credits are available on larger accounts. To get more details please book in a call with our team here
How to use the Foreplay API Endpoints with N8N
This article is to highlight the most commonly used endpoints in the Foreplay API for full endpoint documentation go here: https://public.api.foreplay.co/docs

Written By Zach Murray
Last updated 6 months ago


ℹ️ You are currently on the platform knowledge base. For full technical documentation go here 👉 API Technical Docs 🔗  To chat with the the API technical docs 👉 Docs GPT 🔗
How to search Foreplay with the API

1. Set up your environment
    * Start with any automation platform of your choice.
    * Prepare to make HTTP requests.
 2. Add the Server URL
* Refer to the documentation to find the server URL.
* Add the server URL into your automation platform.
3. Add the Endpoint
* Scroll down to find the 'search and filter ads' endpoint in the documentation.
* Insert this endpoint into your request.
4. Add Authentication
* Set up authentication by adding a header.
* Copy the authorization key from Full Play and paste it into the header value.
5. Add Query Parameters
* Add query parameters for your search.
6. Test the request
* Send the request to the API
7. Review the Results
* Check the response for the ads returned.
* Confirm the details required for your automation
How to get boards

Step 1: Access the API
* Identify the need to retrieve board names and ideas for ads.
* Understand that this process is for boards related to different products, brands, or niches.
Step 2: Set up the API Request
* Add the endpoint: /API/boards.
Step 3: Configure Authentication
* Send headers for authorization. 
Step 4: Add API Key
* Copy your API key from Foreplay.
* Paste the API key into the appropriate field for authorization. 
Step 5: Test the Request
* Test the request to see if it works.
* Confirm that the response is successful and displays the desired information
How to get ads from a board

Step 1: Set up the API call
* Use the endpoint: board/ads
Step 2: Add parameters to filter ads
* Board ID (Required)
* Platform (e.g., platform=Facebook)
* Status (e.g., live=true for active ads)
* Language (e.g., languages=English)
Step 2: Test the API Call
* Execute the API call to retrieve ads.
* Check the response for required details
How to get brands from a board

Step 1: Request the Board ID
* Don’t have a board ID? Watch how to get boards
Step 2: Set up the API request
* Change the limit parameter to 1 to retrieve only one brand.
* Ensure to include the required query parameter for the board ID in your API request. 
Step 3: Test the API Request
* Test the API request to see if it retrieves the brands correctly.
Step 4: Review Retrieved Brands
* Check the response to see the brands returned from the board.
How to get brands from Spyder

Step 1: Set Up Your Automation Platform
* Open n8n or your preferred AI automation platform.
Step 2: Configure the API Endpoint
* Change the API endpoint to: /api/spider/brands 
Step 3: Authentication Setup
* Ensure you have the header authentication in place:
    * Include your authorization value with the API key.
Step 4: Test the API Call
* Test the API call to test if it works correctly.
Step 6: Review Retrieved Data
* Check the response to see the brands being tracked.
How to get specific brands from Spyder

Step 1: Access Your AI Automation Platform
* Open your AI automation platform.
* Prepare to input the brand ID you want to track. 
Step 2: Modify the Brand ID
* Add the specific brand ID you want to track
Step 3: Test the automation step
* Execute the step to test if it works correctly.
Step 4: Verify the Output
* Check the output to confirm it shows the expected brand
* Review additional data returned, such as text and niches.
How to get ads from Spyder

Step 1: Access Your AI Automation Platform
* Open your AI automation platform.
* Prepare to specify the brand you want to track.
Step 2: Specify the Brand and Ad Type
* Enter the brand name you want to track.
* Specify that you want to track ads.
 Step 3: Set Filters for Your Search
* Add a limit to the number of ads (e.g., limit to 1).
* Apply additional filters, such as:
    * Name: display_format
    * Value: video
    * This will return video ads
Step 4: Test your request
* Execute the test to see if the step 
Step 5: Review the data
* Examine the details of the ad retrieved:
    * Description
    * Brand ID
    * Categories
    * Creative targeting
    * Languages
    * Market
    * Niche
    * Avatar
    * Call to Action (CTA)
    * AI emotional analysis of emotions provoked
    * Media file URL (Image or video asset)
How to get a specific ad

Step 1: Access Your Automation Platform
* Open your automation platform.
* Prepare to modify the endpoint for retrieving ads.
Step 2: Change the Endpoint
* Locate the endpoint in the docs
* Add to URL
Step 3: Add the Ad ID as a Query Parameter
* Obtain the specific ad ID you want to retrieve.
* Add the ad ID as a query parameter in the request. 
Step 4: Test the step
* Execute the request to test if the specific ad is retrieved successfully.
* Confirm that the ad data is coming through in the output
Step 5: Review the Retrieved Ad Data
* Check the details of the retrieved ad, including:
    * Description
    * Categories
    * Creative target
    * Languages
    * Market (e.g., D2C)
    * Accessories
    * Avatar
    * Call to Action (CTA)
    * Display format (e.g., video, images)
    * Emotions driven by the ad
    * Link URL for the landing page
    * Active status (e.g., live)
    * Persona information
    * Platforms the ad was launched on
    * Start date of the ad
    * Thumbnail for the video
    * Video file
    * Run duration and video duration.
Step 6: Utilize the Retrieved Ad Data
* Use the retrieved ad data in your automation as needed.
* Ensure you have access to all relevant information for future steps.
How to get ads from a specific brand

1. Add the API Endpoint
* Add the endpoint to get brands by domain:
    * URL: https://public.api.foreplay.co/api/brand/getBrandsByDomain
    * Input the domain to retrieve brand information. 
2. Send Query Parameters
* Check the documentation for required parameters:
    * Use the field domain to input the brand's domain (e.g., nike.com).
    * Test the endpoint to retrieve the brand ID. 
3. Getting Ads by Brand ID
* Change the endpoint to get ads by brand ID:
    * Use the retrieved brand ID from the previous step.
    * Set a limit for the number of ads to retrieve (e.g., limit to 1 ad). 
4. Verify output
* Review the data returned from the API:
    * Ad ID, name, brand ID, description
    * Categories, creative targeting, languages, target market
    * Product category, call to action (CTA), display format (e.g., video)
    * Emotional analysis of the ad
    * Link URL, active status, persona, publisher platform
    * Ad launch date, thumbnail, video format, video URL, running duration, video duration.
How to get brand analytics

1. Retrieve the Server URL and Endpoint
* Copy the server URL from the documentation.
* Find the appropriate endpoint for brand analytics.
2. Get the Brand ID
* Input the endpoint into the platform.
* Set authentication to 'none'.
* Enter the domain (e.g., Nike.com).
3. Add Authorization Header
* Locate your API key from Full Play.
* Add the API key in the headers for authorization.
4. Execute the Step to Retrieve Brand ID
* Execute the step to obtain the brand ID. 
6. Access Brand Analytics
* Add the brand analytics endpoint
* Add ID query parameter and brand ID
7. Input Required Parameters
* Ensure you have the correct brand ID and any necessary IDs.
* Execute the step.
8. Troubleshoot Invalid IDs
* If you encounter an error, check the brand ID or page ID.
* Go back to the previous step to verify the ID.
10. Confirm Successful Retrieval of Brand ID
* Ensure the correct brand ID is displayed.
11. Review Brand Analytics Data
* Analyze the returned data, including active/inactive ad counts and formats.

n8n Integration
Learn how to connect the Foreplay API to be used in an N8N workflow.

Written By Zach Murray
Last updated 7 months ago
Creating a Node & Connecting Foreplay
n8n offers infinite possibilities for creating, managing and sharing workflows. Here’s how you can start using Foreplay data in n8n.

1. Create a HTTP request node
2. Set “METHOD” to “GET”
3. Set “URL” to your Endpoint URL (Learn how to build an endpoint url below)

Quick-start N8N template (JSON)

 Want to get started quickly and easily? Open this JSON in N8N and update the Authorization header with your API key.  🚨 Important: This workflow will not work without your API key.
Customize this N8N automation 👇
1. Update auth headers with your API key to make this functional (Required)
2. Update brand_ids to change which brands are being tracked (Optional)
3. Update the Slack node to connect to your Slack channel (Required)

Clay Integration
Connect the Foreplay API to Clay to enrich lead lists with advertising data.

Written By Zach Murray
Last updated 7 months ago
The different API endpoints allow you to access real-time or historical advertising a company has run through a platform eg. Facebook, TikTok etc.
Example: Get ads using Brand Domain
For use with Clay, finding brand ID or Ad Library ID from a domain name is the most common.


ℹ️ Company domain can be passed in any format including ‘company.com’ ‘www.company.com’ or ‘https://company.com’
Use HTTP API Connector

To connect Foreplay API to Clay, you'll need to use the 'HTTP API' connector in Clay. This connector allows you to leverage the Foreplay API workflows directly in Clay.
1. Click “Add Column” or “Add Enrichment”
2. Select HTTP API
3. Click “Configure”


A. Selecting an Endpoint
For example, to find brands in our database by domain use the following endpoint https://public.api.foreplay.co/api/brand/getBrandsByDomain to browse other endpoints available, check out the technical docs.
B. Query Parameters 
This is where we can query the Foreplay API based on content from our Clay table. In this example, we will use the “domain” column.
C. Authorization
To use your Foreplay API Key, click the “Headers” dropdown and;
1. “Add a new Key and Value Pair”
2. Label as authorization
3. Value = YOUR API KEY
Gumloop Integration
Learn how to connect the Foreplay API to be used in a Gumloop workflow.

Written By Zach Murray
Last updated 7 months ago
Gumloop is the AI automation platform built for everyone. Everything you need from data, apps, and AI in an intuitive drag and drop interface to automate your workflows.
How to create a node with Foreplay in Gumloop

To connect Foreplay API to Gumloop, you'll need to use the “API” node in Gumloop. This node allows you to leverage the Foreplay API directly in Gumloop workflows.
A. How to setup the Foreplay API node in Gumloop
1. Select “Add a node”
2. Add the “Call API” node under “Advanced”
3. Add the authorization header
    1. Add “Authorization” in the “Key” field
    2. Copy your API key from foreplay: https://app.foreplay.co/api-overview
    3. Add your API key to the “Value” field
4. Add the base URL to the “URL” field: https://public.api.foreplay.co  You can find the base URL in the public API docs: https://public.api.foreplay.co/doc 

1.     
B. How to add a Foreplay API endpoint in Gumloop
1. Go to the Foreplay API docs: https://public.api.foreplay.co/doc
2. Copy the endpoint you want to use
3. Add the endpoint to end of the base URL
    1. For example: https://public.api.foreplay.co/doc/api/brand/getBrandsByDomain


C. How to add a query parameters in Gumloop
1. Go to the Foreplay API docs: https://public.api.foreplay.co/doc
2. Copy the query parameter you want to add
3. Add the query parameter to the end of your URL
    1. For example: https://public.api.foreplay.co/doc/api/brand/getBrandsByDomain?brand_ids=12345678
4. OR drag and drop the dynamic variable from a previous output in your workflow
`

const chunks = docs.split(/\n{1,2}/).filter(c => c.trim().length > 100)

for (const chunk of chunks) {
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: chunk,
  })

  await supabase.from('documents').insert({
    content: chunk,
    embedding: embedding.data[0].embedding,
    metadata: { source: 'foreplay-api-docs' }
  })

  console.log('Embedded:', chunk.slice(0, 60))
}

console.log('Done — all chunks embedded')