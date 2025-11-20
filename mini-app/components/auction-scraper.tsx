"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

interface Lot {
  id: number;
  title: string;
  ebayValue: number;
  myMaxBid: number;
  currentBid: number;
  shipping: number;
}

export default function AuctionScraper() {
  const [url, setUrl] = useState("");
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState<keyof Lot | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const fetchLots = async () => {
    setLoading(true);
    try {
      // Placeholder: In a real app this would call a backend endpoint
      // that scrapes the auction site and returns lot data.
      // For now we simulate with static data.
      const simulated: Lot[] = [
        {
          id: 1,
          title: "Vintage Clock",
          ebayValue: 120,
          myMaxBid: 0,
          currentBid: 80,
          shipping: 10,
        },
        {
          id: 2,
          title: "Antique Vase",
          ebayValue: 200,
          myMaxBid: 0,
          currentBid: 150,
          shipping: 15,
        },
      ];
      // Compute My Max Bid for each lot
      const computed = simulated.map((lot) => {
        const A = lot.ebayValue;
        const myMax = ((A / 1.15) / 3) / 1.15 + lot.shipping;
        return { ...lot, myMaxBid: parseFloat(myMax.toFixed(2)) };
      });
      setLots(computed);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sortBy = (key: keyof Lot) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedLots = [...lots].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Auction Scraper</h1>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Paste auction URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button onClick={fetchLots} disabled={loading || !url}>
          {loading ? "Loading…" : "Scrape"}
        </Button>
      </div>
      {lots.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => sortBy("id")} className="cursor-pointer">
                Lot #
                <ArrowUpDown className={cn("ml-1 h-4 w-4", sortKey === "id" && "text-primary")} />
              </TableHead>
              <TableHead onClick={() => sortBy("title")} className="cursor-pointer">
                Item Title
                <ArrowUpDown className={cn("ml-1 h-4 w-4", sortKey === "title" && "text-primary")} />
              </TableHead>
              <TableHead onClick={() => sortBy("ebayValue")} className="cursor-pointer">
                eBay Value
                <ArrowUpDown className={cn("ml-1 h-4 w-4", sortKey === "ebayValue" && "text-primary")} />
              </TableHead>
              <TableHead onClick={() => sortBy("myMaxBid")} className="cursor-pointer">
                My Max Bid
                <ArrowUpDown className={cn("ml-1 h-4 w-4", sortKey === "myMaxBid" && "text-primary")} />
              </TableHead>
              <TableHead onClick={() => sortBy("currentBid")} className="cursor-pointer">
                Current Bid
                <ArrowUpDown className={cn("ml-1 h-4 w-4", sortKey === "currentBid" && "text-primary")} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLots.map((lot) => {
              const profitPotential = lot.ebayValue - (lot.currentBid + lot.shipping);
              const highlight = profitPotential > 100;
              const bidFlag = lot.currentBid <= lot.myMaxBid;
              return (
                <TableRow key={lot.id} className={cn(highlight && "bg-green-50")}>
                  <TableCell>{lot.id}</TableCell>
                  <TableCell>{lot.title}</TableCell>
                  <TableCell>
                    <a
                      href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(
                        lot.title
                      )}&_sop=12`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      ${lot.ebayValue.toFixed(2)}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      ${lot.myMaxBid.toFixed(2)}
                    </a>
                  </TableCell>
                  <TableCell
                    className={cn(
                      bidFlag ? "text-green-600 font-semibold" : "text-red-600"
                    )}
                  >
                    ${lot.currentBid.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
