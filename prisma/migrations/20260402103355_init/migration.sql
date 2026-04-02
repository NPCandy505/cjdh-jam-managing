-- CreateTable
CREATE TABLE "JamEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "songTitle" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "desiredSession" TEXT NOT NULL,
    "noteUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AdditionalParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "session" TEXT NOT NULL,
    "instrumentName" TEXT,
    "jamEntryId" TEXT NOT NULL,
    CONSTRAINT "AdditionalParticipant_jamEntryId_fkey" FOREIGN KEY ("jamEntryId") REFERENCES "JamEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OneClickRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requesterName" TEXT NOT NULL,
    "preferredSession" TEXT NOT NULL,
    "instrumentName" TEXT,
    "memo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
