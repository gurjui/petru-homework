6) Creează o VM și instalează automat PM2
-----------------------------------------

**Scop:** să ai o mașină virtuală în care **PM2 este instalat automat** la pornirea VM-ului.

**Cerințe:**

-   creezi o VM cu Vagrant (poți folosi tot Ubuntu)

-   folosești **provisioning-ul din Vagrant** (shell script)

-   instalezi:

    -   Node.js

    -   npm

    -   PM2 (global)

**Rezultat așteptat:**

-   după `vagrant up`, PM2 este deja instalat

-   comanda `pm2 --version` funcționează în VM

* * * * *

7) Rulează aplicația cu PM2 și conecteaz-o la MySQL
---------------------------------------------------

**Scop:** rulezi o aplicație Node.js cu PM2 și o conectezi la baza de date MySQL.

**Ce trebuie făcut:**

-   pornești aplicația folosind PM2

-   creezi un **fișier de configurare PM2** (ex: `ecosystem.config.js`)

-   în acest fișier adaugi:

    -   adresa bazei de date MySQL

    -   userul MySQL

    -   parola

    -   numele bazei de date

-   aplicația trebuie să folosească aceste date pentru conexiunea la DB

**Testare:**

-   expui portul aplicației din VM către host

-   deschizi aplicația în browser

-   aplicația trebuie:

    -   să **scrie date în MySQL**

    -   să **citească date din MySQL**

**Rezultat așteptat:**

-   aplicația pornește prin PM2

-   aplicația este accesibilă în browser

-   datele sunt salvate și citite corect din baza de date MySQL