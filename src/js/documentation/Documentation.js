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
    <Footer>
      Help footer
    </Footer>
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
