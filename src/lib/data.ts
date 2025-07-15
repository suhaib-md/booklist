import type { Book } from "./types";

export const initialBooks: Book[] = [
  {
    id: "1",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    synopsis: "A shocking psychological thriller of a woman’s act of violence against her husband—and of the therapist obsessed with uncovering her motive.",
    status: "Read",
    finishedDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
  },
  {
    id: "2",
    title: "Dune",
    author: "Frank Herbert",
    synopsis: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the “spice” melange, a drug capable of extending life and enhancing consciousness.",
    status: "Read",
    finishedDate: new Date(),
  },
  {
    id: "3",
    title: "Project Hail Mary",
    author: "Andy Weir",
    synopsis: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn’t know that. He can’t even remember his own name, let alone the nature of his assignment or how to complete it.",
    status: "Currently Reading",
  },
  {
    id: "4",
    title: "The Four Winds",
    author: "Kristin Hannah",
    synopsis: "An epic novel of love and heroism and hope, set against the backdrop of one of America’s most defining eras—the Great Depression.",
    status: "To Read",
  },
  {
    id: "5",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    synopsis: "Here is the story of Klara, an Artificial Friend with outstanding observational qualities, who, from her place in the store, keenly observes the behavior of those who come in to browse, and of those who pass on the street outside.",
    status: "To Read",
  },
];
