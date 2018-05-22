/* eslint-disable */

import React, { Component } from 'react';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Footer from 'grommet/components/Footer';
import Section from 'grommet/components/Section';
import Label from 'grommet/components/Label';

export const userAdmin = (
  <Article className='help-article' size='large' pad='large'>
    <Header>
      <Heading>Pomoč pri administraciji uporabnikov</Heading>
    </Header>
    <Section>
      <Heading tag="h3" margin="none" strong>Dodajanje novega uporabnika</Heading>
      <Section>
        Za dodajanje uporabnikov kliknite gumb za dodajanje uporabnikov poleg naslova Administracija uporabnikov.
        Po kliku se vam bo odprlo pojavno okno, kjer morate izpolniti vsa pojla.
        Ko izpolnete vsa polja kliknite gumb "Dodaj" za dodajanje uporabnika in gumb "Prekliči", če ne želite dodati uporabnika.
        V primeru napačnega vnosa vam bo aplikacija izpisala napako ob klinu na gumb "Dodaj".
        Po kliku na gumb dodaj bo aplikacija sama zaprla pojavno okno, če ni prišlo do napake.
      </Section>

      <Heading tag="h3" margin="none" strong>Urejanje uporabnika</Heading>
      <Section>
        Za urejanje uporabnika poiščite uporabnika v tabeli in kliknite na ikono za urejanje (svničnik).
        Prikazalo se vam bo pojavno okno, kjer lahko urejate podatke o uporabniku.
        Če ne želite spremeniti gesla pustite to polje prazno.
        Ko uredite podatke v spletnem obrazcu kliknite gumb "Shrani" in aplikacija bo shranila vaš vnos ter posodobila podatke v tabeli.
      </Section>

      <Heading tag="h3" margin="none" strong>Deaktivacija uporabnika</Heading>
      <Section>
        Za deaktivacijo uporabnika kliknite na ikono za brisanje uporabnika.
        Pojavilo se vam bo pojavno okno kjer morate potrditi deaktivacijo uporanbika.
        Ko deaktivirate uporabnika, bo ta uporabnik prikazan s sivim ozadjem v tabeli.
        Če želite uporabnika ponovno aktivirati, kliknite ikono za urejanje uporabnika in ponovno aktivirajte uporabnika.
      </Section>
    </Section>
  </Article>
);

export const teamManagement = (
  <Article className='help-article' size='large' pad='large'>
    <Header>
      <Heading>Pomoč pri vzdrževanju</Heading>
    </Header>
    <Section>
      <Heading tag="h3" margin="none" strong>Razvojne skupine</Heading>
      <Section>
        Vse razvojne skupine so prikazane v tabeli z osnovnimi podatki o skupini.
        Za dodajanje nove skupine kliknite ikono za dodajanje nove skupine. Nahaja se zraven naslova "Vzdrževanje razvojih skupin".
        Ob kliku na ikono se bo prikazalo pojavno okno.
        Vnesite ime skupine, izberite kanban master-ja in product owner-ja.
        Ob kliku na polje za izbiro se vam bodo prikazali uporabniki, ki jih lahko izberete.
        Aplikacija vam omogoča tudi iskanje uporabnikov. Ob kliku na polje za izbiro se vam bodo prikazali uporabniki in polje za iskanje.
        Vnesite ime ali priimek uporabnika in prikazali se vam bodo samo uporabniki, ki ustrezajo iskalnemu nizu.
        Ko določite kanban master-ja, product owner-ja in vsaj enega razvijalca kliknite gumb dodaj.
        Aplikacija bo shranila vašo skupino, zaprla pojavno okno in osvežila tabelo s podatki o ekipah.
      </Section>
      <Section>
        Za brisanje ekip poiščite v tabeli ekipo, ki jo želite izbrisati in kliknite na ikono za brisanje (smetnjak).
        Aplikacija bo odstranila želeno ekipo in prikazala novo stanje ekip v tabeli.
      </Section>
      <Section>
        Za urejanje ekip kliknite ikono za urejanje ekipe.
        Odprlo se vam bo pojavno okno z obstoječimi podatki o ekipah.
        Posodobite lahko vse podatke.
        Za brisanje razvijalcev kliknite na ikono za brisanje razvijalca.
      </Section>
    </Section>
    <Section>
      <Heading tag="h3" margin="none" strong>Vzdrževanje projektov</Heading>
      <Section>
        Vsi projekti so prikazani v tabeli za vzdrževanje projektov.
        Za dodajanje novega projekta kliknite ikono za dodajanje novega projekta.
        Nahaja se zraven naslova "Vzdrževanje razvojih skupin".
        Ob kliku na ikono se bo prikazalo pojavno okno.
        Vnesite obvezna polja in kliknite na gumb dodaj za dodajanje novega projekta.
        Če ste storili napako popravite podatke v spletne obrazcu ali pa kliknite gumb prekliči za prekinitev dodajanje projekta.
      </Section>
      <Section>
        Za brisanje projektov poiščite v tabeli projekt, ki ga želite izbrisati in kliknite na ikono za brisanje (smetnjak).
        Aplikacija bo odstranila želeni projekt in prikazala novo stanje projektov v tabeli.
      </Section>
      <Section>
        Za urejanje projekta kliknite ikono za urejanje projekta.
        Odprlo se vam bo pojavno okno z obstoječimi podatki o projektu.
        Posodobite lahko vse podatke.
      </Section>
    </Section>
  </Article>
);

export const loginPage = (
  <Article className='help-article' size='large' pad='large'>
    <Header>
      <Heading>Pomoč pri prijavi v sistem Emineo</Heading>
    </Header>
    <Section>
      <Section>
        Za uspešno prijavo se mora uporabnik prijaviti z ustreznim email naslovom in geslom.
        Vneseno mora biti veljaven email naslov kot tudi geslo daljše od 6 znakov.
        V primeru da je bil vnašen nepravilen email naslov ali geslo se uporabniku pokaže primerno obvestilo.
        Po X neuspešnih prijavah v sistem se uporabniku onemogoči prijava za X minut.
        Po uspešni prijavi se uporabniku ni potrebno ponovno vpisovati v sistem, saj brskalnik hrani podatke o prijavljenem uporabniku.
      </Section>
    </Section>
  </Article>
);


export const graphsHelp = (
  <Article className='help-article' size='large' pad='large'>
    <Header>
      <Heading>Pomoč pri uporabi grafov</Heading>
    </Header>
    <Section>
      <Heading tag="h3" margin="none" strong>Izbor analize</Heading>
      <Section>
        V zgornjem delu spletne strani lahko izbirate med različnimi tipi analize.
        S klikom na posamezen tip analize se vam bo prikazal ustren graf.
      </Section>

      <Heading tag="h3" margin="none" strong>Izris grafa</Heading>
      <Section>
        Za izris grafa izpolnite obvezna polja v obrazcu in pritisnite puščico zraven naslova "Filter podatkov".
        Če želite posodobiti graf, spremenite ustrezna polja v formi in ponovno pritisnite puščico.
      </Section>

      <Heading tag="h3" margin="none" strong>Avtomatski prikaz grafov</Heading>
      <Section>
        Če imate ipolnjen obrazec z obveznimi polji in zamenjate prikaz analize, ni potrebno ponovno vnašati podatkov v obrazec.
        Spletna aplikacija bo avtomatsko izrisala ustrezen graf glede na podane parametre.
        Če želite posodobiti graf, spremenite podatke v obrazcu in pritisnite gumb za izris grafa.
      </Section>
    </Section>
  </Article>
);


export const home = (
<Article className='help-article' size='large' pad='large'>
    <Header>
      <Heading>Pomoč</Heading>
    </Header>
    <Section>
      <Heading tag="h3" margin="none" strong>Prikaz table</Heading>
      <Section>
        Za prikaz posamezne table kliknite na ustrezno kartico.
        Prikazala se vam bo nova stran z izbrano tablo.
      </Section>

      <Heading tag="h3" margin="none" strong>Urejanje table</Heading>
      <Section>
        Če želite urediti strukturo table kliknite ikono za urejanje table v zgornem desnem kotu.
        Za urejanje table potrebujete ustrezne pravice.
        Če jih nimate kontaktirajte administratorja.
      </Section>

      <Heading tag="h3" margin="none" strong>Kopiranje strukture table</Heading>
      <Section>
        Za kopiranje strukture table kliknite na ikono za kopiranje table.
        Prikala se vam bo nova stran za kopiranje strukture table.
      </Section>

      <Heading tag="h3" margin="none" strong>Prikaz analize</Heading>
      <Section>
        Za prikaz analize kliknite na ikono za analizo v zgornjem desnem kotu kartice.
        Prikazala se vam bo nova stran, kjer lahko izvedete analizo izbrane table.
      </Section>
    </Section>
  </Article>
);

export const board = (
<Article className='help-article' size='large' pad='large'>
    <Header>
      <Heading>Uporaba table</Heading>
    </Header>
    <Section>
      <Heading tag="h3" margin="none" strong>Prikaz table</Heading>
      <Section>
        Na strani je prikaza izbrana tabla.
        Vrstice predstavljajo plavalne proge, vsaka plavalna proga pa je namenjena enemu projektu.
        Poleg projektov soprikazane vse kartice v ustreznih stolpcih.
        Za delo s karticami preberite navodila spodaj.
      </Section>

      <Heading tag="h3" margin="none" strong>Dodajanje nove kartice</Heading>
      <Section>
        Za dodajanje nove kartice kliknite gumb "Dodaj kartico".
        Prikazalo se vam bo pojavno okno kjer lahko izpolnete zahtevane podatke za dodajanje nove kartice.
        Izpolnite obvezna polja in gliknite gumb "Dodaj".
        Če želite zavreči spremembe kliknite gumb "Prekliči".
      </Section>

      <Heading tag="h3" margin="none" strong>Premikanje kartic</Heading>
      <Section>
        Če želite premakniti kartico v drugi stolpec jo kliknite, pridržite in povlecite v želeni stolpec.
      </Section>

      <Heading tag="h3" margin="none" strong>Prikaz podrobnosti in urejanje kartice</Heading>
      <Section>
        Za prikaz podrobnosti kartice kliknite na ikono za več možnosti v desnem zgornem kotu kartice.
        Prikazalo se vam bo pojavno okno s podrobnostimi kartice.

        Poleg tega lahko uredite vsebino kartice, če imate ustrezne pravice za urejanje vsebine kartice.
      </Section>
    </Section>
  </Article>
);

export const helpTemplate = (
<Article className='help-article' size='large' pad='large'>
    <Header>
      <Heading>Sample help page</Heading>
    </Header>
    <Section>
      Content
    </Section>
    <Footer>
      Help footer
    </Footer>
  </Article>
);
