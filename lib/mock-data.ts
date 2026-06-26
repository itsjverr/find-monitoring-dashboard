import { FeedPost, Person, SocialAccount } from "@/lib/types";

const importedPeople: Person[] = [
  {
    "id": "p-001",
    "fullName": "ΚΩΝΣΤΑΝΤΙΝΟΣ ΚΥΡΑΝΑΚΗΣ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ Π.Ε",
    "active": true
  },
  {
    "id": "p-002",
    "fullName": "ΓΙΑΝΝΗΣ ΣΜΥΡΛΗΣ",
    "role": "ΓΕΝΙΚΟΣ ΔΙΕΥΘΥΝΤΗΣ",
    "active": true
  },
  {
    "id": "p-003",
    "fullName": "ΝΙΚΟΣ ΠΑΠΟΥΤΣΗΣ",
    "role": "ΑΝΑΠΛΗΡΩΤΗΣ ΓΕΝΙΚΟΣ ΔΙΕΥΘΥΝΤΗΣ",
    "active": true
  },
  {
    "id": "p-004",
    "fullName": "ΧΡΙΣΤΟΦΟΡΟΣ ΜΠΟΥΤΣΙΚΑΚΗΣ",
    "role": "ΑΝΑΠΛΗΡΩΤΗΣ ΓΡΑΜΜΑΤΕΑΣ ΠΕ",
    "active": true
  },
  {
    "id": "p-005",
    "fullName": "ΠΑΝΑΓΙΩΤΗΣ ΛΕΜΠΕΣΗΣ",
    "role": "ΑΝΑΠΛΗΡΩΤΗΣ ΓΡΑΜΜΑΤΕΑΣ ΠΕ",
    "active": true
  },
  {
    "id": "p-006",
    "fullName": "ΑΛΕΞΑΝΔΡΑ ΣΔΟΥΚΟΥ",
    "role": "ΕΚΠΡΟΣΩΠΟΣ ΤΥΠΟΥ",
    "active": true
  },
  {
    "id": "p-007",
    "fullName": "ΕΛΕΝΗ ΣΩΚΟΥ",
    "role": "ΕΚΠΡΟΣΩΠΟΣ ΤΥΠΟΥ - ΠΕΡΙΦΕΡΕΙΑΚΑ",
    "active": true
  },
  {
    "id": "p-008",
    "fullName": "ΧΑΡΗΣ ΧΑΤΖΗΧΑΡΑΛΑΜΠΟΥΣ",
    "role": "ΔΝΤΗΣ ΓΡΑΦΕΙΟΥ ΤΥΠΟΥ",
    "active": true
  },
  {
    "id": "p-009",
    "fullName": "ΟΡΦΕΑΣ ΓΕΩΡΓΙΟΥ",
    "role": "ΠΡΟΕΔΡΟΣ ΟΝΝΕΔ",
    "active": true
  },
  {
    "id": "p-010",
    "fullName": "ΠΑΝΟΣ ΣΤΑΘΟΠΟΥΛΟΣ",
    "role": "ΔΝΤΗΣ ΕΠΙΣΤΗΜΟΝΙΚΟΥ ΣΥΜΟΥΛΙΟΥ ΙΔΚΚ",
    "active": true
  },
  {
    "id": "p-011",
    "fullName": "ΕΥΘΥΜΙΟΣ ΑΛΕΞΑΝΔΡΗΣ",
    "role": "ΣΥΝΤΟΝΙΣΤΗΣ ΔΙΑΓΡΑΜΜΑΤΕΙΑΚΟΥ",
    "active": true
  },
  {
    "id": "p-012",
    "fullName": "ΘΩΜΑΙΔΗΣ (ΑΝΑΠΛΗΡΩΤΗΣ)",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΑΓΡΟΤΙΚΩΝ ΦΟΡΕΩΝ",
    "active": true
  },
  {
    "id": "p-013",
    "fullName": "ΚΩΝΣΤΑΝΤΙΝΟΣ ΛΟΛΙΤΣΑΣ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΓΙΑ ΤΑ ΑΤΟΜΑ ΜΕ ΑΝΑΠΗΡΙΑ",
    "active": true
  },
  {
    "id": "p-014",
    "fullName": "ΔΙΟΝΥΣΗΣ ΧΑΤΖΗΔΑΚΗΣ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΑΥΤΟΔΙΟΙΚΗΣΗΣ & ΔΙΑΧΕΙΡΙΣΗΣ ΚΡΙΣΕΩΝ",
    "active": true
  },
  {
    "id": "p-015",
    "fullName": "ΑΝΑΣΤΑΣΙΟΣ (ΤΑΣΟΣ) ΧΑΤΖΗΒΑΣΙΛΕΙΟΥ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΔΙΕΘΝΩΝ ΣΧΕΣΕΩΝ & ΕΥΡΩΠΑΪΚΗΣ ΕΝΩΣΗΣ",
    "active": true
  },
  {
    "id": "p-016",
    "fullName": "ΧΡΙΣΤΟΦΟΡΟΣ ΝΤΙΖΟΣ",
    "role": "ΟΡΓΑΝΩΤΙΚΟΣ ΓΡΑΜΜΑΤΕΑΣ ΕΚΟ",
    "active": true
  },
  {
    "id": "p-017",
    "fullName": "ΦΙΛΙΠΠΟΣ ΦΟΡΤΩΜΑΣ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΕΛΛΗΝΩΝ ΤΗΣ ΔΙΑΣΠΟΡΑΣ",
    "active": true
  },
  {
    "id": "p-018",
    "fullName": "ΚΩΝΣΤΑΝΤΙΝΟΣ ΤΣΙΓΑΡΙΔΑΣ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΕΠΙΣΤΗΜΟΝΙΚΩΝ ΦΟΡΕΩΝ",
    "active": true
  },
  {
    "id": "p-019",
    "fullName": "ΘΕΟΔΩΡΟΣ ΚΟΛΛΙΑΣ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΕΡΓΑΖΟΜΕΝΩΝ ΣΤΟΝ ΙΔΙΩΤΙΚΟ & ΔΗΜΟΣΙΟ ΤΟΜΕΑ",
    "active": true
  },
  {
    "id": "p-020",
    "fullName": "ΑΘΑΝΑΣΙΑ ΔΑΒΑΛΟΥ",
    "role": "ΟΡΓΑΝΩΤΙΚΗ ΓΡΑΜΜΑΤΕΑΣ ΕΡΓΑΖΟΜΕΝΩΝ ΣΤΟΝ ΙΔΙΩΤΙΚΟ & ΔΗΜΟΣΙΟ ΤΟΜΕΑ",
    "active": true
  },
  {
    "id": "p-021",
    "fullName": "ΑΚΗΣ ΜΠΑΦΑΣ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΠΑΡΑΓΩΓΙΚΩΝ ΦΟΡΕΩΝ ΚΑΙ ΕΠΙΧΕΙΡΗΜΑΤΙΚΟΤΗΤΑΣ",
    "active": true
  },
  {
    "id": "p-022",
    "fullName": "ΑΝΔΡΕΑΣ ΧΑΤΖΗΑΝΔΡΕΟΥ",
    "role": "ΟΡΓΑΝΩΤΙΚΟΣ ΓΡΑΜΜΑΤΕΑΣ ΠΑΡΑΓΩΓΙΚΩΝ ΦΟΡΕΩΝ ΚΑΙ ΕΠΙΧΕΙΡΗΜΑΤΙΚΟΤΗΤΑΣ",
    "active": true
  },
  {
    "id": "p-023",
    "fullName": "ΠΙΣΤΗ ΚΡΥΣΤΑΛΛΙΔΟΥ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΕΘΕΛΟΝΤΙΣΜΟΥ",
    "active": true
  },
  {
    "id": "p-024",
    "fullName": "ΑΝΤΩΝΙΑ ΔΗΜΟΥ (ΑΝΑΠΛΗΡΩΤΡΙΑ)",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΠΡΟΓΡΑΜΜΑΤΟΣ",
    "active": true
  },
  {
    "id": "p-025",
    "fullName": "ΒΑΣΙΛΕΙΟΣ ΦΕΥΓΑΣ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΣΤΡΑΤΗΓΙΚΟΥ ΣΧΕΔΙΑΣΜΟΥ & ΕΠΙΚΟΙΝΩΝΙΑΣ",
    "active": true
  },
  {
    "id": "p-026",
    "fullName": "ΚΩΣΤΑΣ ΜΑΜΟΥΛΗΣ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΨΗΦΙΑΚΟΥ ΜΕΤΑΣΧΗΜΑΤΙΣΜΟΥ ΚΑΙ ΕΠΙΜΟΡΦΩΣΗΣ ΣΤΕΛΕΧΩΝ",
    "active": true
  },
  {
    "id": "p-027",
    "fullName": "ΑΝΝΑ ΝΤΑΛΛΕΣ",
    "role": "ΟΡΓΑΝΩΤΙΚΗ ΓΡΑΜΜΑΤΕΑΣ ΨΗΦΙΑΚΟΥ ΜΕΤΑΣΧΗΜΑΤΙΣΜΟΥ ΚΑΙ ΕΠΙΜΟΡΦΩΣΗΣ ΣΤΕΛΕΧΩΝ",
    "active": true
  },
  {
    "id": "p-028",
    "fullName": "ΘΕΟΔΩΡΟΣ ΣΚΡΕΚΑΣ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΤΕΩΣ ΒΟΥΛΕΥΤΩΝ - ΕΥΡΩΒΟΥΛΕΥΤΩΝ - ΠΟΛΙΤΕΥΤΩΝ",
    "active": true
  },
  {
    "id": "p-029",
    "fullName": "ΓΕΩΡΓΙΟΣ ΚΑΛΑΝΤΖΗΣ",
    "role": "ΟΡΓΑΝΩΤΙΚΟΣ ΓΡΑΜΜΑΤΕΑΣ ΤΕΩΣ ΒΟΥΛΕΥΤΩΝ - ΕΥΡΩΒΟΥΛΕΥΤΩΝ - ΠΟΛΙΤΕΥΤΩΝ",
    "active": true
  },
  {
    "id": "p-030",
    "fullName": "ΕΥΤΥΧΙΑ ΑΔΗΛΙΝΗ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΠΑΛΑΙΩΝ ΣΤΕΛΕΧΩΝ",
    "active": true
  },
  {
    "id": "p-031",
    "fullName": "ΜΑΡΙΑ ΝΑΤΣΙΟΥ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΑΝΘΡΩΠΙΝΩΝ ΔΙΚΑΙΩΜΑΤΩΝ",
    "active": true
  },
  {
    "id": "p-032",
    "fullName": "ΜΑΡΙΑ ΚΑΡΑΓΙΑΝΝΗ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΔΙΚΑΙΩΜΑΤΩΝ ΤΟΥ ΠΑΙΔΙΟΥ",
    "active": true
  },
  {
    "id": "p-033",
    "fullName": "ΙΩΑΝΝΗΣ ΑΝΑΣΤΑΣΟΠΟΥΛΟΣ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΕΚΠΑΙΔΕΥΤΙΚΗΣ ΠΟΛΙΤΙΚΗΣ ΕΠΑΓΓΕΛΜΑΤΙΚΗΣ ΕΠΑΝΑΚΑΤΑΡΤΙΣΗΣ-ΠΙΣΤΟΠΟΙΗΣΗΣ ΚΑΙ ΔΙΑ ΒΙΟΥ ΜΑΘΗΣΗΣ",
    "active": true
  },
  {
    "id": "p-034",
    "fullName": "ΑΝΑΣΤΑΣΙΟΣ ΚΟΡΙΛΛΗΣ",
    "role": "ΟΡΓΑΝΩΤΙΚΟΣ ΓΡΑΜΜΑΤΕΑΣ ΕΚΠΑΙΔΕΥΤΙΚΗΣ ΠΟΛΙΤΙΚΗΣ ΚΑΙ ΠΙΣΤΟΠΟΙΗΣΗΣ",
    "active": true
  },
  {
    "id": "p-035",
    "fullName": "ΑΝΑΣΤΑΣΙΑ ΣΑΡΧΟΣΟΓΛΟΥ",
    "role": "ΟΡΓΑΝΩΤΙΚΗ ΓΡΑΜΜΑΤΕΑΣ ΕΠΑΓΓΕΛΜΑΤΙΚΗΣ ΕΠΑΝΑΚΑΤΑΡΤΙΣΗΣ ΚΑΙ ΔΙΑ ΒΙΟΥ ΜΑΘΗΣΗΣ",
    "active": true
  },
  {
    "id": "p-036",
    "fullName": "ΒΑΣΙΛΗΣ ΓΑΚΟΠΟΥΛΟΣ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΠΟΛΙΤΙΚΟΥ ΣΧΕΔΙΑΣΜΟΥ",
    "active": true
  },
  {
    "id": "p-037",
    "fullName": "ΧΡΗΣΤΟΣ ΣΟΥΛΗΣ",
    "role": "ΓΡΑΜΜΑΤΕΑΣ ΠΕΡΙΒΑΛΛΟΝΤΟΣ ΚΑΙ ΚΛΙΜΑΤΙΚΗΣ ΑΛΛΑΓΗΣ",
    "active": true
  },
  {
    "id": "p-038",
    "fullName": "ΘΑΝΑΣΗΣ ΝΕΖΗΣ",
    "role": "ΣΥΜΒΟΥΛΟΣ ΠΡΟΕΔΡΟΥ",
    "active": true
  },
  {
    "id": "p-039",
    "fullName": "Κώστας Τσιαγκλιώτης",
    "role": "Συντονιστής του Διατομεακού Οργάνου",
    "active": true
  },
  {
    "id": "p-040",
    "fullName": "ΖΗΣΗΣ ΙΩΑΚΕΙΜΟΒΙΤΣ",
    "role": "ΑΙΡΕΤΟ ΜΕΛΟΣ ΠΕ",
    "active": true
  }
];

export const socialAccounts: SocialAccount[] = [
  {
    "id": "sa-002-facebook",
    "personId": "p-002",
    "platform": "Facebook",
    "handle": "smirlis",
    "profileUrl": "https://www.facebook.com/smirlis",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-002-instagram",
    "personId": "p-002",
    "platform": "Instagram",
    "handle": "@ioannissmyrlis",
    "profileUrl": "https://www.instagram.com/ioannissmyrlis",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-002-x",
    "personId": "p-002",
    "platform": "X",
    "handle": "@Ysmyrlis",
    "profileUrl": "https://x.com/Ysmyrlis",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-003-facebook",
    "personId": "p-003",
    "platform": "Facebook",
    "handle": "nikos.papoutsis.39",
    "profileUrl": "https://www.facebook.com/nikos.papoutsis.39",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-003-instagram",
    "personId": "p-003",
    "platform": "Instagram",
    "handle": "@papoutsis_",
    "profileUrl": "https://www.instagram.com/papoutsis_",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-003-x",
    "personId": "p-003",
    "platform": "X",
    "handle": "@papoutsis_n",
    "profileUrl": "https://x.com/papoutsis_n",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-004-facebook",
    "personId": "p-004",
    "platform": "Facebook",
    "handle": "chr.boutsikakis",
    "profileUrl": "https://www.facebook.com/chr.boutsikakis",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-004-instagram",
    "personId": "p-004",
    "platform": "Instagram",
    "handle": "@boutsikakis_christoforos",
    "profileUrl": "https://www.instagram.com/boutsikakis_christoforos",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-004-x",
    "personId": "p-004",
    "platform": "X",
    "handle": "@BoutsikakisChr",
    "profileUrl": "https://x.com/BoutsikakisChr",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-005-facebook",
    "personId": "p-005",
    "platform": "Facebook",
    "handle": "lebesis.panagiotis",
    "profileUrl": "https://www.facebook.com/lebesis.panagiotis",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-005-instagram",
    "personId": "p-005",
    "platform": "Instagram",
    "handle": "@plebesis",
    "profileUrl": "https://www.instagram.com/plebesis",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-005-x",
    "personId": "p-005",
    "platform": "X",
    "handle": "@LebesisP",
    "profileUrl": "https://x.com/LebesisP",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-006-facebook",
    "personId": "p-006",
    "platform": "Facebook",
    "handle": "alexandra.sdk",
    "profileUrl": "https://www.facebook.com/alexandra.sdk",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-006-instagram",
    "personId": "p-006",
    "platform": "Instagram",
    "handle": "@alexandra.sdoukou",
    "profileUrl": "https://www.instagram.com/alexandra.sdoukou",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-006-x",
    "personId": "p-006",
    "platform": "X",
    "handle": "@asdoukou",
    "profileUrl": "https://x.com/asdoukou",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-007-facebook",
    "personId": "p-007",
    "platform": "Facebook",
    "handle": "elena.sokou.1",
    "profileUrl": "https://www.facebook.com/elena.sokou.1",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-007-instagram",
    "personId": "p-007",
    "platform": "Instagram",
    "handle": "@sokouelena",
    "profileUrl": "https://www.instagram.com/sokouelena",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-007-x",
    "personId": "p-007",
    "platform": "X",
    "handle": "@ElenaSokou",
    "profileUrl": "https://x.com/ElenaSokou",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-008-instagram",
    "personId": "p-008",
    "platform": "Instagram",
    "handle": "@chatzicha",
    "profileUrl": "https://www.instagram.com/chatzicha",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-008-x",
    "personId": "p-008",
    "platform": "X",
    "handle": "@chatzicha",
    "profileUrl": "https://x.com/chatzicha",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-009-facebook",
    "personId": "p-009",
    "platform": "Facebook",
    "handle": "orfeas.georgiou",
    "profileUrl": "https://www.facebook.com/orfeas.georgiou",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-009-instagram",
    "personId": "p-009",
    "platform": "Instagram",
    "handle": "@orfe.geor",
    "profileUrl": "https://www.instagram.com/orfe.geor",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-009-x",
    "personId": "p-009",
    "platform": "X",
    "handle": "@orfeas_georgiou",
    "profileUrl": "https://x.com/orfeas_georgiou",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-014-facebook",
    "personId": "p-014",
    "platform": "Facebook",
    "handle": "DionisisXatzidakis",
    "profileUrl": "https://www.facebook.com/DionisisXatzidakis",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-015-facebook",
    "personId": "p-015",
    "platform": "Facebook",
    "handle": "Tchatzivasileiou",
    "profileUrl": "https://www.facebook.com/Tchatzivasileiou",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-015-instagram",
    "personId": "p-015",
    "platform": "Instagram",
    "handle": "@tasos_chatzivasileiou",
    "profileUrl": "https://www.instagram.com/tasos_chatzivasileiou",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-015-x",
    "personId": "p-015",
    "platform": "X",
    "handle": "@tasos_chatziv",
    "profileUrl": "https://x.com/tasos_chatziv",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-016-facebook",
    "personId": "p-016",
    "platform": "Facebook",
    "handle": "profile:100047660813473",
    "profileUrl": "https://www.facebook.com/profile.php?id=100047660813473",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-016-instagram",
    "personId": "p-016",
    "platform": "Instagram",
    "handle": "@xristoforosntizos",
    "profileUrl": "https://www.instagram.com/xristoforosntizos",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-016-x",
    "personId": "p-016",
    "platform": "X",
    "handle": "@X_Ntizos",
    "profileUrl": "https://x.com/X_Ntizos",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-017-facebook",
    "personId": "p-017",
    "platform": "Facebook",
    "handle": "fortomas",
    "profileUrl": "https://www.facebook.com/fortomas",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-017-instagram",
    "personId": "p-017",
    "platform": "Instagram",
    "handle": "@philip_fortomas",
    "profileUrl": "https://www.instagram.com/philip_fortomas",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-018-facebook",
    "personId": "p-018",
    "platform": "Facebook",
    "handle": "kostantinos.tsigaridas",
    "profileUrl": "https://www.facebook.com/kostantinos.tsigaridas",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-018-instagram",
    "personId": "p-018",
    "platform": "Instagram",
    "handle": "@dr_tsigaridas_oncologist",
    "profileUrl": "https://www.instagram.com/dr_tsigaridas_oncologist",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-019-facebook",
    "personId": "p-019",
    "platform": "Facebook",
    "handle": "profile:61570991017089",
    "profileUrl": "https://www.facebook.com/profile.php?id=61570991017089",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-019-x",
    "personId": "p-019",
    "platform": "X",
    "handle": "@theodorekollias",
    "profileUrl": "https://x.com/theodorekollias",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-020-x",
    "personId": "p-020",
    "platform": "X",
    "handle": "@DavalouN",
    "profileUrl": "https://x.com/DavalouN",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-021-facebook",
    "personId": "p-021",
    "platform": "Facebook",
    "handle": "cbafas",
    "profileUrl": "https://www.facebook.com/cbafas",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-021-x",
    "personId": "p-021",
    "platform": "X",
    "handle": "@cbafas",
    "profileUrl": "https://x.com/cbafas",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-022-facebook",
    "personId": "p-022",
    "platform": "Facebook",
    "handle": "a.chatziandreou",
    "profileUrl": "https://www.facebook.com/a.chatziandreou",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-022-instagram",
    "personId": "p-022",
    "platform": "Instagram",
    "handle": "@andrechatzi",
    "profileUrl": "https://www.instagram.com/andrechatzi",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-022-x",
    "personId": "p-022",
    "platform": "X",
    "handle": "@AChatziand38748",
    "profileUrl": "https://x.com/AChatziand38748",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-023-facebook",
    "personId": "p-023",
    "platform": "Facebook",
    "handle": "kristallidoupisti",
    "profileUrl": "https://www.facebook.com/kristallidoupisti",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-023-instagram",
    "personId": "p-023",
    "platform": "Instagram",
    "handle": "@pisti_kristallidou",
    "profileUrl": "https://www.instagram.com/pisti_kristallidou",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-023-x",
    "personId": "p-023",
    "platform": "X",
    "handle": "@Pisti_Ptol",
    "profileUrl": "https://x.com/Pisti_Ptol",
    "active": true,
    "connected": false
  },
  {
    "id": "sa-024-instagram",
    "personId": "p-024",
    "platform": "Instagram",
    "handle": "@toniadimou",
    "profileUrl": "https://www.instagram.com/toniadimou",
    "active": true,
    "connected": false
  }
];

const peopleWithAccounts = new Set(socialAccounts.map((account) => account.personId));

export const people: Person[] = importedPeople.filter((person) =>
  peopleWithAccounts.has(person.id)
);

const peopleById = new Map(people.map((person) => [person.id, person]));
const basePostTime = Date.parse("2026-06-25T10:30:00+03:00");

function makeLatestAccountPost(account: SocialAccount, index: number): FeedPost {
  const person = peopleById.get(account.personId);

  if (!person) {
    throw new Error(`Social account ${account.id} references missing person`);
  }

  return {
    id: `latest-${account.id}`,
    personId: account.personId,
    socialAccountId: account.id,
    platform: account.platform,
    externalPostId: `latest-${account.id}`,
    postUrl: account.profileUrl,
    text: `Latest ${account.platform} profile available for ${person.fullName}. Open the source profile to review the newest public post while live API sync is being connected.`,
    publishedAt: new Date(basePostTime - index * 18 * 60 * 1000).toISOString(),
    fetchedAt: "2026-06-25T10:30:00+03:00",
    rawJson: {
      source: "profile-import",
      profileUrl: account.profileUrl
    },
    isSeen: false,
    isPinned: false,
    isFlagged: false,
    engagementCount: 0,
    tags: ["latest profile", "pending live sync"],
    person,
    account
  };
}

export const mockPosts: FeedPost[] = socialAccounts.map(makeLatestAccountPost);
