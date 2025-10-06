/**
 * Wishlist Concept - AI Augmented Version
 */

import { GeminiLLM } from './gemini-llm';

// A place
export interface Place {
    city: string,
    region: string,
    country: string
}

export class Wishlist {
    private userPlaces: Place[] = [];
    private recommendedPlaces: Place[] = [];
    private numberPlacesToRecommend: number = 6;

    /**
     * Add place to wishlist.
     */
    addPlace(city: string, region: string, country: string): Place {
        // Create new place
        const place: Place = {
            city,
            region,
            country
        }

        this.userPlaces.push(place);
        return place;
    }

    /**
     * Remove place from wishlist.
     */
    removePlace(place: Place): void {
        this.userPlaces = this.userPlaces.filter(currPlace => (currPlace !== place));
    }

    /**
     * Recommend destinations based on wishlist locations.
     */
    async recommendPlaces(llm: GeminiLLM): Promise<void> {
        if (this.userPlaces.length === 0) {
            console.log('Cannot recommend places from empty wishlist.');
            return;
        }

        try {
            // Call LLM to get recommended places
            console.log('\nRequesting recommendations from Gemini AI...');

            const prompt = this.createAssignmentPrompt();
            const responseText = await llm.executeLLM(prompt);

            console.log('Received response from Gemini AI!');
            console.log('Raw Gemini Response:');
            console.log(responseText);

            // Parse and add the recommended places
            this.parseAndAddPlaces(responseText);

            console.log(this.toString("Recommended"));

        } catch (error) {
            console.error('Error calling Gemini API:', (error as Error).message);
            throw error;
        }

    }

    /**
     * Helper functions and queries:
     */

    /**
     * Create string representation of wishlist or recommended list.
     */
    toString(list: string): string {
        let listToDisplay: Place[] = [];
        if (list === "User") {
            listToDisplay = this.userPlaces;
        }
        if (list === "Recommended") {
            listToDisplay = this.recommendedPlaces;
        }

        let displayString = `${list} Wishlist:`
        for (const place of listToDisplay) {
            displayString += "\n- " + place.city + ", " + place.region + ", " + place.country;
        }

        return displayString;
    }

    /**
     * Create Gemini's prompt.
     */
    private createAssignmentPrompt(): string {
        return `You are a helpful AI travel assistant whose task is to recommend ${this.numberPlacesToRecommend} new (not currently in the wishlist) trip locations for a user based on the current dream destinations on their wishlist:

        ${this.toString("User")}.

        When creating recommendations for the user, be sure to consider cities/places
        across the entire globe that the user would enjoy visiting: don't make all
        recommendations based ONLY on proximity, culture, or language, without also
        considering the alignment of potential new locations' many travel factors
        (scenery/nature, feel/vibes, attractions/activities, cuisine, and more)
        with the current wishlist destinations.

        For instance, if the majority of the wishlist locations are in the
        United States, do not only recommend cities/places in primarily white,
        English-speaking countries.

        However, recommended destinations should still reflect the commonalities
        of the current wishlist locations.

        Return your recommendations as a JSON object with this exact structure;
        ensure that all names are in their unabbreviated, most commonly used forms,
        and that a location is specified with the most accurate city, region,
        and country possible:
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
    }

    /**
     * Parse Gemini's JSON response and update recommended list.
     */
    private parseAndAddPlaces(responseText: string): void {
        try {
            // Extract JSON from response (in case there's extra text)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response.');
            }

            const response = JSON.parse(jsonMatch[0]);

            if (!response.places || !Array.isArray(response.places)) {
                throw new Error('Invalid response format.');
            }

            // Validator #3: correct number of places recommended
            if (response.places.length !== this.numberPlacesToRecommend) {
                throw new Error('Incorrect number of places recommended.');
            }

            this.recommendedPlaces = [];

            for (const i in response.places) {

                const place = response.places[i];

                if (typeof place !== 'object' || place === null) {
                    throw new Error('Recommended a place entry that is not an object.');
                }

                const {city, region, country} = place as {city?: unknown; region?: unknown; country?: unknown};

                if (typeof city !== 'string' || city.trim().length === 0) {
                    throw new Error("Recommended a place that's missing a valid city.");
                }

                if (typeof region !== 'string' || region.trim().length === 0) {
                    throw new Error("Recommended a place that's missing a valid region.");
                }

                if (typeof country !== 'string' || country.trim().length === 0) {
                    throw new Error("Recommended a place that's missing a valid country.");
                }

                // Validator #1: no recommended location already exists in wishlist
                for (const otherPlace of this.userPlaces) {
                    if (place === otherPlace) {
                        throw new Error('Recommended a place already in the wishlist.');
                    }
                }

                // Validator #2: no location is recommended twice
                for (const j in response.places) {
                    if ((i !== j) && (place === response.places[j])) {
                        throw new Error('Recommended the same place twice.');
                    }
                }

                this.recommendedPlaces.push(place);
            }
        }
        catch(error) {
            console.error('Error parsing LLM response:', (error as Error).message);
            console.log('Reponse was:', responseText);
            throw error;
        }
    }
}
