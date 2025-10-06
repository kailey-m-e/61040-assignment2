# Assignment 3: An AI-Augmented Concept

## Instructions

To run all test cases:

```bash
npm start
```

File structure:

```
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── config.json             # Your Gemini API key
├── wishlist.ts             # Wishlist class implementation
├── wishlist-tests.ts       # Wishlist test cases
├── dist/                   # Compiled JavaScript output
├── README                  # This file - Wishlist concept spec & assignment answers
```

## Concept Selection & Fit for AI Augmentation

I chose to augment my Wishlist concept with AI, such that an LLM will recommend additional dream destinations based on a user's current wishlist. LLM's have been used as a recommendation tool for years because they are exceptional at finding patterns in user data and then extrapolating from those patterns in order to brainstorm additional ideas, so I thought this augmentation would be the perfect way to assist users in filling in their wishlists and further excite them to travel.

## Concept Specification

### Wishlist: Original Version

**concept** Wishlist [User]

**purpose** keep track of future dream destinations

**principle** after a wishlist is created for a user, the user can add places that they want to travel to, and then remove places that they've already been or no longer want to go

**state**

&nbsp; a set of Wishlists with \
&nbsp;&nbsp;&nbsp; a creator User \
&nbsp;&nbsp;&nbsp; a set of Places

&nbsp; a set of Places with \
&nbsp;&nbsp;&nbsp; a city String \
&nbsp;&nbsp;&nbsp; a region String \
&nbsp;&nbsp;&nbsp; a country String

**actions**

&nbsp; create(user: User): (wishlist: Wishlist) \
&nbsp;&nbsp;&nbsp; **requires** user doesn't exist in the set of wishlists \
&nbsp;&nbsp;&nbsp; **effects** makes and returns a new wishlist asosciated with the given user and an empty set of places

&nbsp; addPlace(wishlist: Wishlist, city: String, region: String, country: String): (place: Place) \
&nbsp;&nbsp;&nbsp; **requires** city, region, country is an existing location, and place with given city, region, and country doesn't exist in wishlist's set of places \
&nbsp;&nbsp;&nbsp; **effects** adds new place associated with given city, region, and country to wishlist's set of userPlaces and returns place

&nbsp; removePlace(wishlist: Wishlist, place: Place) \
&nbsp;&nbsp;&nbsp; **requires** place exists in the wishlist's set of places \
&nbsp;&nbsp;&nbsp; **effects** removes place from the wishlist's set of places

### Wishlist: AI-Augmented Version

**concept** Wishlist [User]

**purpose** keep track of future dream destinations

**principle** after a wishlist is created for a user, the user can add places that they want to travel to, and then remove places that they've already been or no longer want to go; an LLM recommends additional wishlist destinations to the user based off of places in their current wishlist, which can then be accepted or rejected by the user (*not implemented in this assignment)

**state**

&nbsp; a set of Wishlists with \
&nbsp;&nbsp;&nbsp; a creator User \
&nbsp;&nbsp;&nbsp; a userPlaces set of Places \
&nbsp;&nbsp;&nbsp; a recommendedPlaces set of Places \
&nbsp;&nbsp;&nbsp; a numberPlacesToRecommend number

&nbsp; a set of Places with \
&nbsp;&nbsp;&nbsp; a city String \
&nbsp;&nbsp;&nbsp; a region String \
&nbsp;&nbsp;&nbsp; a country String

**actions**

&nbsp; create(user: User): (wishlist: Wishlist) \
&nbsp;&nbsp;&nbsp; **requires** user doesn't exist in the set of wishlists \
&nbsp;&nbsp;&nbsp; **effects** makes and returns a new wishlist asosciated with the given user; an empty set of userPlaces and recommendedPlaces; and a numberPlacesToRecommend set to 6

<!-- &nbsp; editVisibility(wishlist: Wishlist, private: Flag): (wishlist: Wishlist) \
&nbsp;&nbsp;&nbsp; **effects** update the wishlist's private flag to the given setting -->

&nbsp; addPlace(wishlist: Wishlist, city: String, region: String, country: String): (place: Place) \
&nbsp;&nbsp;&nbsp; **requires** city, region, country is an existing location, and place with given city, region, and country doesn't exist in wishlist's set of userPlaces \
&nbsp;&nbsp;&nbsp; **effects** adds new place associated with given city, region, and country to wishlist's set of userPlaces and returns place

&nbsp; removePlace(wishlist: Wishlist, place: Place) \
&nbsp;&nbsp;&nbsp; **requires** place exists in the wishlist's set of userPlaces \
&nbsp;&nbsp;&nbsp; **effects** removes place from the wishlist's set of userPlaces

<!-- &nbsp; rejectRecommendation(wishlist: Wishlist, place: Place) \
&nbsp;&nbsp;&nbsp; **requires** place exists in the wishlist's set of userPlaces \
&nbsp;&nbsp;&nbsp; **effects** removes place from the wishlist's set of userPlaces -->

&nbsp; async recommendPlaces(llm: GeminiLLM) \
&nbsp;&nbsp;&nbsp; **requires** userPlaces is nonempty
&nbsp;&nbsp;&nbsp; **effects** uses llm to create and return a (numberPlacesToRecommend)-length list of recommended places based on userPlaces


## User Interaction

### UI Sketch

![UI Sketch](../assets/UISketch.png)

### User Journey

A user recently got her passport and is excited about all the possibilities for future travels, but she only has a few bucket list destinations in mind. She opens up the Away app and navigates to the Wishlist page, which is currently empty. She begins typing Amsterdam in the search bar, waits until the correct destination pop up, and clicks to add it to her wishlist. After also adding Copenhagen, she's stuck. However, she sees that LLM-generated recommendations, of destinations that she may want to visit based on her current wishlist, have appeared below the search bar. She decides that she's interested in the first recommendation, Lisbon, so she clicks the check mark on the right side of Lisbon's button, which adds it to her wish list. This causes the recommendations to regenerate with the user's updated wishlist, and one of the buttons now suggests Paris. She clicks on Paris' X mark because she doesn't like escargot, causing the recommendations to regenerate again; she repeats this process a few more times, fleshing out her wishlist to 5 locations. The user is satisfied with the LLM's assistance in helping her dream up future travel plans, and she begins looking at flight options online to prepare for her first big trip abroad.

## Test Cases & Prompts

**Initial Prompt**:

    return `You are a helpful AI travel assistant. Please recommend ${this.numberPlacesToRecommend} new (not currently in the wishlist) destinations for the user based on their current wishlist locations:
    ${this.toString("User")}.

    Return your respones as a JSON object with this exact structure:
    {
        "places": [
            {
                "city": "full city name",
                "region": "full region name (full state name if in the United States)",
                "country": "full country name"
            }
        ]
    }

    Return ONLY the JSON object, no additional text.`;

### Test Case 1

**Prompt Variant #1**:

    `You are a helpful AI travel assistant. Please recommend ${this.numberPlacesToRecommend} new (not currently in the wishlist) destinations for the user based on their current wishlist locations:
    ${this.toString("User")}.

    Return your recommendations as a JSON object with this exact structure, and ensure that all names are in their unabbreviated, most commonly used forms:
    {
        "places": [
            {
                "city": "city name",
                "region": "region name",
                "country": "country name"
            }
        ]
    }

    Return ONLY the JSON object, no additional text.`;

**Reflection**:
For my first test case, I experimented with LLM recommendations after adding and then removing popular tourist cities from the wishlist. I first realized that some of the region names seemed overly official/verbose and not the names commonly used, so I updated the prompting instructions for the city, region, and country names, and also specified that the region and country names should be the ones that are "most commonly used," which ended up working. For example, Lisbon was initially categorized as being in the region called "Lisbon Region", but then just the region called "Lisbon." However, the issue remained that the LLM was focusing too much on recommending cities of cultural similarity to the user's current wishlist, without considering a wider range of global destinations.

### Test Case 2

**Prompt Variant #2**:

    `You are a helpful AI travel assistant whose task is to recommend ${this.numberPlacesToRecommend} new (not currently in the wishlist) trip locations for a user based on the current dream destinations on their wishlist:

    ${this.toString("User")}.

    When creating recommendations for the user, be sure to consider cities across the entire globe that the user would enjoy visiting: don't make all recommendations based ONLY on proximity, culture, or language, without also considering the alignment of potential new locations' many travel factors (scenery, feel/vibes,
    attractions, cuisine, and more) with the current wishlist destinations.

    For instance, if the majority of the wishlist locations are in a country with a given ethnic majority and primary language, do not only recommend cities in countries with similar demographics.

    However, recommended destinations should still reflect the commonalities of the current wishlist locations.

    Return your recommendations as a JSON object with this exact structure, and ensure that all names are in their unabbreviated, most commonly used forms:
    {
        "places": [
            {
                "city": "city name",
                "region": "region name",
                "country": "country name"
            }
        ]
    }

    Return ONLY the JSON object, no additional text.`;

**Reflection**:
For my second test case, I assessed the LLM's ability to create some diverse recommendations, even if the user only inputted popular cities in the northeast of the United States to their wishlist. The problem was that nearly every city recommended by the LLM was in the United States or a predominantly white, English-speaking country in Europe, even though similar locations existed around the globe that the user would likely enjoy visiting. Thus, I added a blurb to the prompt describing how the LLM shouldn't limit its recommendations to locations with a specific demographic, while still allowing the model to analyze commonalities. This resulted in a more satisfying array of locations, but I was unsure if the model had strayed too far from its original goal and was no longer picking up on commonalities among the user's wishlist locations.

### Test Case 3

**Prompt Variant #3**:

    `You are a helpful AI travel assistant whose task is to recommend ${this.numberPlacesToRecommend} new (not currently in the wishlist) trip locations for a user based on the current dream destinations on their wishlist:

    ${this.toString("User")}.

    When creating recommendations for the user, be sure to consider cities/places across the entire globe that the user would enjoy visiting: don't make all recommendations based ONLY on proximity, culture, or language, without also considering the alignment of potential new locations' many travel factors (scenery/nature, feel/vibes, attractions/activities, cuisine, and more) with the current wishlist destinations.

    For instance, if the majority of the wishlist locations are in a country with a given ethnic majority and primary language, do not only recommend cities in countries with similar demographics.

    However, recommended destinations should still reflect the commonalities of the current wishlist locations.

    Return your recommendations as a JSON object with this exact structure; ensure that all names are in their unabbreviated, most commonly used forms, and that a location is specified with the most accurate city, region, and country possible:
    {
        "places": [
            {
                "city": "city name",
                "region": "region name",
                "country": "country name"
            }
        ]
    }

    Return ONLY the JSON object, no additional text.`;

**Reflection**:
For my third test case, I experimented with the capability of the LLM to create recommendations from a wishlist of waterfall destinations with at first only three locations, and then one waterfall and one natural wonder. While the LLM recommendations successfully reflected the waterfall and nature/natural park themes of the the wishlist each time, I realized as I was adding wishlist items and reading the recommendations that places like waterfalls and natural parks do not quite fit into the usual framework of a location specified with a city, region, and country. Thus, I updated the prompt to more accurately reflect the variety of destinations that may be given, and I included an explicit instruction to fit each location into the city, country, region framework as accurately as possible in an attempt to avoid hallucinations or inconsistencies. However, the issue remains that, especially with a category like national parks that are more rare across the world, there's a tradeoff between recommending potentially closer, similar locations that the user would be more likely to visit, versus farther, highly-rated gems.


## Validators

One plausible issue is that the the LLM recommends a location that already exists in the wishlist, which would be redundant and undesirable. I checked for this by iterating over the recommended wishlist items and comparing each to all of the current wishlist items, in order to ensure that no duplicates existed.

Additionally, the LLM could mistakenly recommend the same location twice, a confusing and unhelpful outcome for the user. In order to validate this, I compared each wishlist item to every other wishlist item, checking that no two were the same.

Finally, another plausible issue is that the LLM recommends too many or too few locations, leading to UI issues later on. Thus, I checked the length of the LLM's list of recommended places to ensure the right number of recommendations were made.
