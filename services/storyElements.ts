import { exampleDefaultCharacters } from "@/static-examples/exampleDefaultCharacters";
import { exampleDefaultLocations } from "@/static-examples/exampleDefaultLocations";

export async function getAllDefaultCharacters() {
    return exampleDefaultCharacters;
}

export async function getAllDefaultLocations() {
    return exampleDefaultLocations;
}