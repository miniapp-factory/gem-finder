import { NextResponse } from "next/server";
import cheerio from "cheerio";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const target = url.searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    const res = await fetch(target);
    if (!res.ok) {
      throw new Error(`Failed to fetch target: ${res.statusText}`);
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    const domain = new URL(target).hostname;

    const lots: any[] = [];

    // Basic scraping logic for supported domains
    if (domain.includes("gsaauctions.gov")) {
      $(".lot").each((i, el) => {
        const title = $(el).find(".lot-title").text().trim();
        const currentBidText = $(el).find(".current-bid").text();
        const currentBid = parseFloat(
          currentBidText.replace(/[^\d.]/g, "")
        );
        lots.push({
          id: i + 1,
          title,
          currentBid: isNaN(currentBid) ? 0 : currentBid,
          shipping: 0,
          ebayValue: 0,
        });
      });
    } else if (domain.includes("kansasonlineauctions.com")) {
      // Add selectors for Kansas Online Auctions
      $(".lot").each((i, el) => {
        const title = $(el).find(".lot-title").text().trim();
        const currentBidText = $(el).find(".current-bid").text();
        const currentBid = parseFloat(
          currentBidText.replace(/[^\d.]/g, "")
        );
        lots.push({
          id: i + 1,
          title,
          currentBid: isNaN(currentBid) ? 0 : currentBid,
          shipping: 0,
          ebayValue: 0,
        });
      });
    } else if (domain.includes("proxybid.com")) {
      // Add selectors for ProxyBid
      $(".lot").each((i, el) => {
        const title = $(el).find(".lot-title").text().trim();
        const currentBidText = $(el).find(".current-bid").text();
        const currentBid = parseFloat(
          currentBidText.replace(/[^\d.]/g, "")
        );
        lots.push({
          id: i + 1,
          title,
          currentBid: isNaN(currentBid) ? 0 : currentBid,
          shipping: 0,
          ebayValue: 0,
        });
      });
    } else if (domain.includes("facebook.com/marketplace")) {
      // Add selectors for Facebook Marketplace
      $(".marketplace-item").each((i, el) => {
        const title = $(el).find(".item-title").text().trim();
        const currentBidText = $(el).find(".price").text();
        const currentBid = parseFloat(
          currentBidText.replace(/[^\d.]/g, "")
        );
        lots.push({
          id: i + 1,
          title,
          currentBid: isNaN(currentBid) ? 0 : currentBid,
          shipping: 0,
          ebayValue: 0,
        });
      });
    } else if (domain.includes("ebth.com")) {
      // Add selectors for EBTH
      $(".lot").each((i, el) => {
        const title = $(el).find(".lot-title").text().trim();
        const currentBidText = $(el).find(".current-bid").text();
        const currentBid = parseFloat(
          currentBidText.replace(/[^\d.]/g, "")
        );
        lots.push({
          id: i + 1,
          title,
          currentBid: isNaN(currentBid) ? 0 : currentBid,
          shipping: 0,
          ebayValue: 0,
        });
      });
    } else if (domain.includes("invaluable.com")) {
      // Add selectors for Invaluable
      $(".lot").each((i, el) => {
        const title = $(el).find(".lot-title").text().trim();
        const currentBidText = $(el).find(".current-bid").text();
        const currentBid = parseFloat(
          currentBidText.replace(/[^\d.]/g, "")
        );
        lots.push({
          id: i + 1,
          title,
          currentBid: isNaN(currentBid) ? 0 : currentBid,
          shipping: 0,
          ebayValue: 0,
        });
      });
    } else {
      return NextResponse.json(
        { error: "Unsupported domain" },
        { status: 400 }
      );
    }

    // Fetch eBay sold price for each lot
    for (const lot of lots) {
      const ebaySearchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(
        lot.title
      )}&_sop=12`;
      const ebayRes = await fetch(ebaySearchUrl);
      const ebayHtml = await ebayRes.text();
      const $$ = cheerio.load(ebayHtml);
      const priceText = $$(".s-item__price").first().text();
      const price = parseFloat(priceText.replace(/[^\d.]/g, ""));
      lot.ebayValue = isNaN(price) ? 0 : price;
    }

    return NextResponse.json(lots);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
