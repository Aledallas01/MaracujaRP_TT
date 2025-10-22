import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

/**
 * API per verificare se l'utente ha il ruolo admin Discord
 * Controlla se l'utente ha il ruolo specificato in DISCORD_ADMIN_ROLE_ID
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json(
        { success: false, hasAdminRole: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const discordAdminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;

    if (!discordAdminRoleId) {
      console.warn("DISCORD_ADMIN_ROLE_ID non configurato nel .env");
      return NextResponse.json({
        success: true,
        hasAdminRole: false,
        message: "Admin role not configured",
      });
    }

    // Ottieni l'ID del server Discord (guild ID) dalle query params
    const guildId = req.nextUrl.searchParams.get("guildId");

    if (!guildId) {
      return NextResponse.json(
        { success: false, error: "Guild ID is required" },
        { status: 400 }
      );
    }

    // Chiamata API Discord per ottenere i ruoli dell'utente nel server
    const response = await fetch(
      `https://discord.com/api/v10/users/@me/guilds/${guildId}/member`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error(
        "Errore Discord API:",
        response.status,
        response.statusText
      );
      return NextResponse.json({
        success: true,
        hasAdminRole: false,
        error: "Cannot fetch Discord roles",
      });
    }

    const memberData = await response.json();
    const userRoles: string[] = memberData.roles || [];

    // Verifica se l'utente ha il ruolo admin
    const hasAdminRole = userRoles.includes(discordAdminRoleId);

    return NextResponse.json({
      success: true,
      hasAdminRole,
      userId: session.user.discordId,
    });
  } catch (error: any) {
    console.error("Error checking role:", error);
    return NextResponse.json(
      { success: false, hasAdminRole: false, error: error.message },
      { status: 500 }
    );
  }
}
