# Finanse Osobiste

Aplikacja webowa do zarządzania budżetem domowym, rejestrowania przychodów i wydatków, analizowania nawyków finansowych oraz planowania oszczędności.

---

## Opis Techniczny & Architektura

Projekt został zbudowany w architekturze klient-serwer z całkowitym rozdzieleniem frontendu oraz backendu. Komunikacja odbywa się za pomocą bezstanowego API REST (protokół HTTP).

### 1. Frontend
* **Framework:** React / Next.js (v. 16.2.9) z wykorzystaniem App Routera.
* **Język:** TypeScript.
* **Stylizowanie:** Tailwind CSS v4.
* **Wizualizacja Danych:** Recharts (v. 3.9.0) – interaktywne wykresy (kołowe, liniowe, słupkowe, obszarowe z gradientem).
* **Obsługa Plików:** `xlsx` (import/eksport CSV i Excel) oraz `jspdf` / `jspdf-autotable` (eksport do PDF bezpośrednio w przeglądarce).
* **Autoryzacja:** Biblioteka `jose` do weryfikacji tokenów JWT.

### 2. Backend
* **Środowisko:** Node.js z Express (v. 5.2.1).
* **Język:** TypeScript (uruchamiany przez `ts-node` w trybie deweloperskim).
* **Baza Danych:** PostgreSQL + Prisma ORM (v. 7.8.0) i adapter `@prisma/adapter-pg`.
* **Bezpieczeństwo:** Haszowanie haseł przy użyciu `bcrypt` (10 salt rounds), autoryzacja za pomocą tokenów JWT przesyłanych w ciasteczku HTTP-only.
* **Walidacja danych:** Biblioteka `Zod` do walidacji ciał zapytań (request body) oraz parametrów URL.

---

## Główne Funkcjonalności

1. **Uwierzytelnianie i Profil:** Rejestracja, logowanie (JWT) oraz edycja profilu (zmiana e-maila i hasła).
2. **Dashboard (Panel Główny):**
   * Kalendarz finansowy z kolorowaniem dni na podstawie bilansu.
   * Postęp wykorzystania budżetu miesięcznego (globalnego oraz na kategorie).
   * Podsumowanie wydatków w formie wykresu kołowego oraz lista ostatnich transakcji.
3. **Transakcje:** Tabela z pełną historią, dynamicznym filtrowaniem (typ, kategoria, zakres dat, wyszukiwanie tekstowe), edycją inline, usuwaniem oraz paginacją.
4. **Kategorie:** Zarządzanie kategoriami systemowymi i własnymi (zabezpieczenie przed edycją/usunięciem systemowych).
5. **Budżetowanie:** Ustala limity globalne i limity na poszczególne kategorie.
6. **Analizy:** 5 zaawansowanych interaktywnych wykresów pokazujących m.in. trendy salda, strukturę wydatków oraz skumulowane oszczędności.
7. **Import i Eksport:** Generowanie raportów PDF, eksport do Excel/CSV oraz import z plików CSV/XLSX z walidacją danych w przeglądarce.
8. **Alerty Budżetowe:** Automatyczne ostrzeżenia o przekroczeniu 80% i 95% limitów budżetowych.

---

## Instrukcja Uruchomienia

Projekt jest przystosowany do uruchomienia zarówno w kontenerach Docker, jak i lokalnie w środowisku deweloperskim.

### Sposób 1: Uruchomienie za pomocą Docker Compose

Upewnij się, że masz zainstalowany program **Docker** oraz **Docker Compose**.

1. Skonfiguruj pliki `.env` dla obu części projektu.
2. W głównym katalogu projektu uruchom komendę:
   ```bash
   docker-compose up --build
   ```
3. Aplikacja będzie dostępna pod adresem:
   * **Frontend:** [http://localhost:3000](http://localhost:3000)
   * **Backend API:** [http://localhost:3001](http://localhost:3001)

---

### Sposób 2: Uruchomienie lokalne (Development)

Wymagane jest środowisko **Node.js** (rekomendowane v22+) oraz działająca baza danych **PostgreSQL**.

#### 1. Uruchomienie Bazy Danych
Możesz uruchomić samą bazę danych w Dockerze za pomocą przygotowanego pliku konfiguracyjnego docker-compose.dev.yml:
```bash
docker compose -f docker-compose.dev.yml up -d
```
Spowoduje to uruchomienie PostgreSQL na porcie `5432` z domyślnym użytkownikiem `postgres` i hasłem `postgres`.

#### 2. Uruchomienie Backend
1. Przejdź do katalogu backendu:
   ```bash
   cd backend
   ```
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Upewnij się, że plik `.env` zawiera prawidłowe dane .
4. Uruchom migracje bazy danych Prisma:
   ```bash
   npx prisma migrate dev
   ```
5. Uruchom serwer w trybie deweloperskim:
   ```bash
   npm run dev
   ```
   Serwer API uruchomi się domyślnie na porcie `3001`.

#### 3. Uruchomienie Frontend
1. Przejdź do katalogu frontendu:
   ```bash
   cd ../frontend
   ```
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Upewnij się, że plik `.env` zawiera poprawne dane.
4. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```
   Aplikacja będzie dostępna pod adresem [http://localhost:3000](http://localhost:3000).

---

## Konfiguracja Środowiska

Do poprawnego działania wymagane jest zdefiniowanie zmiennych środowiskowych w plikach `.env`.

### Backend:
```env
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finanse_osobiste"
JWT_SECRET="twoj-losowy-sekretny-klucz-jwt"
FRONTEND_URL=http://localhost:3000
```
*(Uwaga: W przypadku uruchomienia w Docker Compose, host bazy danych w `DATABASE_URL` powinien wskazywać na nazwę usługi bazy danych, czyli `db`, np. `postgresql://postgres:postgres@db:5432/finanse_osobiste`).*

### Frontend:
```env
API_URL="http://localhost:3001/"
JWT_SECRET="twoj-losowy-sekretny-klucz-jwt"
```
*(Ważne: Wartość `JWT_SECRET` musi być taka sama na frontendzie oraz backendzie ze względu na dekodowanie sesji JWT).*
