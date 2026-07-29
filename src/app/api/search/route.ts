import { NextRequest, NextResponse } from "next/server";
import { searchBySeatingNo, searchByName } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q")?.trim();
  const type = searchParams.get("type") || "auto";

  if (!query) {
    return NextResponse.json(
      { error: "يرجى إدخال رقم الجلوس أو الاسم للبحث", results: [] },
      { status: 400 }
    );
  }

  try {
    let results;
    const isNumber = /^\d+$/.test(query);

    if (type === "seating" || (type === "auto" && isNumber)) {
      const student = searchBySeatingNo(parseInt(query, 10));
      results = student ? [student] : [];
    } else {
      results = searchByName(query, 20);
    }

    const response = NextResponse.json({
      results,
      count: results.length,
      query,
      type: isNumber ? "seating" : "name",
    });

    // Cache for 1 hour on edge, stale-while-revalidate for 24 hours
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );

    return response;
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.", results: [] },
      { status: 500 }
    );
  }
}
