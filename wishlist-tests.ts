/**
 * Wishlist Test Cases
 *
 */

import {Wishlist} from './wishlist';
import {GeminiLLM, Config} from './gemini-llm';

/**
 * Load configuration from config.hson
 */
function loadConfig(): Config {
    try {
        const config = require('../config.json');
        return config;
    } catch (error) {
        console.error('Error loading config.json. Please ensure it exists with your API key.');
        console.error('Error details:', (error as Error).message);
        process.exit(1);
    }
}

/**
 * Test Case 1
 * Demonstrates recommendations after adding and removing popular tourist cities.
 */
export async function testCase1(): Promise<void> {
    console.log('--------------------------------------');
    console.log('Test Case 1');
    console.log('--------------------------------------');

    const wishlist = new Wishlist();
    const config = loadConfig();
    const llm = new GeminiLLM(config);

    // Recommend places
    await wishlist.recommendPlaces(llm);

    // Add places
    console.log('\nAdding places... \n');
    const athens = wishlist.addPlace("Athens", "Attica", "Greece");
    const tokyo = wishlist.addPlace("Tokyo", "Kanto", "Japan");
    const nyc = wishlist.addPlace("New York City", "New York", "United States");
    const paris = wishlist.addPlace("Paris", "Ile-de-France", "France");
    console.log(wishlist.toString("User"));

    // Recommend places
    await wishlist.recommendPlaces(llm);

    // Remove places
    console.log('\nRemoving places... \n');
    wishlist.removePlace(nyc);
    wishlist.removePlace(paris);
    console.log(wishlist.toString("User"));

    // Recommend places
    await wishlist.recommendPlaces(llm);
}

/**
 * Test Case 2
 * Demonstrates recommendations after adding localized cities.
 */
export async function testCase2(): Promise<void> {
    console.log('\n--------------------------------------');
    console.log('Test Case 2');
    console.log('--------------------------------------');

    const wishlist = new Wishlist();
    const config = loadConfig();
    const llm = new GeminiLLM(config);

    // Add places
    console.log('Adding places... \n');
    const boston = wishlist.addPlace("Boston", "Massachusetts", "United States");
    const nyc = wishlist.addPlace("New York City", "New York", "United States");
    const dc = wishlist.addPlace("Washington, D.C.", "District of Columbia", "United States");
    console.log(wishlist.toString("User"));

    // Recommend places
    await wishlist.recommendPlaces(llm);
}

/**
 * Test Case 3
 * Demonstrates recommendations after adding specifically-themed locations.
 */
export async function testCase3(): Promise<void> {
    console.log('\n--------------------------------------');
    console.log('Test Case 3');
    console.log('--------------------------------------');

    const wishlist = new Wishlist();
    const config = loadConfig();
    const llm = new GeminiLLM(config);

    // Add places
    console.log('Adding places... \n');
    const niagara = wishlist.addPlace("Niagara Falls", "Ontario", "Canada");
    const gulfoss = wishlist.addPlace("Gulfoss", "Blaskogabyggd", "Iceland");
    const angel = wishlist.addPlace("Angel Falls", "Bolivar State", "Venezuela");
    console.log(wishlist.toString("User"));

    // Recommend places
    await wishlist.recommendPlaces(llm);

    // Remove places
    console.log('\nRemoving places... \n');
    wishlist.removePlace(gulfoss);
    wishlist.removePlace(angel);
    console.log(wishlist.toString("User"));

    // Add places
    console.log('\nAdding places... \n');
    const grandCanyon = wishlist.addPlace("Grand Canyon", "Arizona", "United States");

    // Recommend places
    await wishlist.recommendPlaces(llm);
}


/**
 * Main function to run all test cases
 */
async function main(): Promise<void> {
    console.log('Wishlist Test Suite');

    try {
        await testCase1();
        await testCase2();
        await testCase3();
    } catch (error) {
        console.error('Test error:', (error as Error).message);
        process.exit(1);
    }
}

// Run the tests if this file is executed directly
if (require.main === module) {
    main();
}
