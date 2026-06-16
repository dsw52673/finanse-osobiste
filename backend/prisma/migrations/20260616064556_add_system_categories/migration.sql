-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("createdAt", "id", "name", "updatedAt", "userId") SELECT "createdAt", "id", "name", "updatedAt", "userId" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_name_userId_key" ON "Category"("name", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
INSERT INTO "Category" ("name", "userId", "isSystem", "createdAt", "updatedAt")
VALUES
    ('Zakupy spożywcze', NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Jedzenie na mieście', NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Transport',           NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Mieszkanie',          NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Zdrowie',             NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Rozrywka',            NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Odzież',              NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Wynagrodzenie',       NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
