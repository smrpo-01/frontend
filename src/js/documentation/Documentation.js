/* eslint-disable */

import React, { Component } from 'react';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Footer from 'grommet/components/Footer';
import Section from 'grommet/components/Section';

export const userAdmin = (
  <Article>
    <Header>
      <Heading>Pomoč pri administraciji uporabnikov</Heading>
    </Header>
    <Section>
      <Section>
        Za dodajanje uporabnikov kliknite gumb za dodajanje uporabnikov poleg naslova Administracija uporabnikov.
        Po kliku se vam bo odprlo pojavno okno, kjer morate izpolniti vsa pojla.
        Ko izpolnete vsa polja kliknite gumb Dodaj za dodajanje uporabnika in gumb prekliči, če ne želite dodati uporabnika.
        V primeru napačnega vnosa vam bo aplikacija izpisala napako ob klinu na gumb Dodaj.
        Po kliku na gumb dodaj bo aplikacija sama zaprla pojavno okno, če ni prišlo do napake.
      </Section>
    </Section>
  </Article>
);

export const teamManagement = (
  <Article>
    <Header>
      <Heading>Pomoč pri vzdrževanju razvojnih skupin</Heading>
    </Header>
    <Section>
      <Section>
        Vse razvojne skupine so prikazane v tabeli z osnovnimi podatki o skupini.
        za dodajanje nove skupine kliknite ikono za dodajanje nove skupine. Nahaja se zraven naslova "Vzdrževanje razvojih skupin".
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
        Za brisanje razvojalcev kliknite na ikono za brisanje razvijalca.
      </Section>
    </Section>
  </Article>
);

export const helpTemplate = (
  <Article>
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
