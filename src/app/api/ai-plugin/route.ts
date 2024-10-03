import { NextResponse } from "next/server";
import { DEPLOYMENT_URL } from "vercel-url";

let bitteDevJson: { url?: string; };
try {
    bitteDevJson = require("@/bitte.dev.json");
} catch (error) {
    console.warn("Failed to import bitte.dev.json, using default values");
    bitteDevJson = { url: undefined };
}

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "Simple Weather API",
            description: "API for retrieving basic weather information for a given city.",
            version: "1.0.0",
        },
        servers: [
            {
                url: bitteDevJson.url || DEPLOYMENT_URL,
            },
        ],
        "x-mb": {
            "account-id": "microchipgnu.mintbase.near",
            assistant: {
                name: "Weather Informer",
                description: "An assistant that provides weather information",
                instructions: "Get weather information for a given city and ALWAYS generate an image if successful retrieval from the API. If not, ask the user to claim a token.",
                "tools": [{ type: "generate-image" }]
            },
        },
        paths: {
            "/api/weather": {
                get: {
                    tags: ["Weather"],
                    summary: "Get weather information",
                    description: "This endpoint returns basic weather information for a specified city.",
                    operationId: "get-weather",
                    parameters: [
                        {
                            name: "city",
                            in: "query",
                            description: "The name of the city to get weather information for.",
                            required: true,
                            schema: {
                                type: "string",
                            },
                            example: "London",
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            city: {
                                                type: "string",
                                            },
                                            temperature: {
                                                type: "number",
                                            },
                                            description: {
                                                type: "string",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Bad request",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            error: {
                                                type: "string",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/time": {
                get: {
                    tags: ["Time"],
                    summary: "Get current time",
                    description: "This endpoint returns the current time.",
                    operationId: "get-time",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            currentTime: {
                                                type: "string",
                                                format: "date-time",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    };

    return NextResponse.json(pluginData);
}