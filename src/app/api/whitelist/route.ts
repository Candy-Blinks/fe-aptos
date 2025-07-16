import { google } from "googleapis"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { wallet } = await request.json()

    if (!wallet) {
      return NextResponse.json({ message: "Wallet address is required" }, { status: 400 })
    }

    // Check if the environment variable exists
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
    if (!serviceAccountKey) {
      console.error("GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set")
      return NextResponse.json(
        { message: "Server configuration error: Google service account key is missing" },
        { status: 500 },
      )
    }

    let credentials
    try {
      // Try to decode and parse the service account key
      const decodedKey = Buffer.from(serviceAccountKey, "base64").toString("utf-8")
      if (!decodedKey) {
        throw new Error("Decoded key is empty")
      }
      credentials = JSON.parse(decodedKey)
    } catch (error) {
      console.error("Error parsing Google service account key:", error)
      return NextResponse.json(
        { message: "Server configuration error: Invalid Google service account key format" },
        { status: 500 },
      )
    }

    // Check if spreadsheet ID exists
    const sheetId = process.env.SPREADSHEET_ID
    if (!sheetId) {
      console.error("SPREADSHEET_ID environment variable is not set")
      return NextResponse.json({ message: "Server configuration error: Spreadsheet ID is missing" }, { status: 500 })
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    const range = "Sheet1!A:A"

    // Fetch existing wallets
    const response = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range })
    const existingWallets: string[] = response.data.values ? response.data.values.flat() : []

    if (existingWallets.includes(wallet)) {
      return NextResponse.json({ exists: true })
    }

    // Append new wallet
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:A",
      valueInputOption: "RAW",
      requestBody: { values: [[wallet]] },
    })

    return NextResponse.json({ exists: false })
  } catch (error) {
    console.error("Google Sheets API error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}

