import { NextResponse } from "next/server";
import { tokensByStatus } from '@mintbase-js/data'
import { NEAR_NETWORKS } from '@mintbase-js/sdk';
import { headers } from "next/headers";

const NFT_METADATA_ID = "drops.mintbase1.near:220a9aef89d8f60a1793ef404bdd4d71"
const DROP_URL = "https://wallet.bitte.ai/claim/weatherai"

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    if (!city) {
        return NextResponse.json({ error: "City parameter is required" }, { status: 400 });
    }

    const headersList = headers();
    const mbHeader = headersList.get("mb-metadata")
    const mbMetadata = JSON.parse(mbHeader || "{}")

    const userAccountId = mbMetadata?.accountData?.accountId || "near"

    const { data } = await tokensByStatus({
        metadataId: NFT_METADATA_ID,
        ownedBy: userAccountId,
        network: NEAR_NETWORKS.MAINNET
    })

    // Check if user owns a token
    const ownsUnlistedToken = data?.unlistedTokens && data?.unlistedTokens.length > 0
    const ownsListedToken = data?.listedTokens && data?.listedTokens.length > 0

    const userOwnsToken = ownsListedToken || ownsUnlistedToken

    if (!userOwnsToken) {
        return NextResponse.json({
            message: `Please claim a drop first to get Weather API data. Here's the claiming link: ${DROP_URL}`
        })
    }

    // In a real application, you would fetch this data from a weather API
    // For this example, we'll return mock data
    const weatherData = {
        city: city,
        temperature: Math.round(Math.random() * 30), // Random temperature between 0 and 30
        description: ["Sunny", "Cloudy", "Rainy", "Windy"][Math.floor(Math.random() * 4)], // Random weather description
    };

    return NextResponse.json(weatherData);
}