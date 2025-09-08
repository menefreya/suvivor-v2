// Contestant data for Survivor Season 49
export const contestants = [
  {
    id: 1,
    name: "Alex Moore",
    age: 27,
    hometown: "Evanston, Ill.",
    residence: "Washington, D.C.",
    occupation: "Political comms director",
    tribe: "Ratu",
    eliminated: false,
    image: "Alex Moore.png",
    points: 0,
    episodes: 1
  },
  {
    id: 2,
    name: "Jake Latimer",
    age: 36,
    hometown: "Regina, Saskatchewan",
    residence: "St. Albert, Alberta",
    occupation: "Correctional officer",
    tribe: "Tika",
    eliminated: false,
    image: "Jake Latimer.png",
    points: 0,
    episodes: 1
  },
  {
    id: 3,
    name: "Jason Treul",
    age: 32,
    hometown: "Anaheim, Calif.",
    residence: "Santa Ana, Calif.",
    occupation: "Law clerk",
    tribe: "Soka",
    eliminated: false,
    image: "Jason Treul.png",
    points: 0,
    episodes: 1
  },
  {
    id: 4,
    name: "Jawan Pitts",
    age: 28,
    hometown: "Salem, N.J.",
    residence: "Los Angeles, Calif.",
    occupation: "Video editor",
    tribe: "Ratu",
    eliminated: false,
    image: "Jawan Pitts.png",
    points: 0,
    episodes: 1
  },
  {
    id: 5,
    name: "Jeremiah Ing",
    age: 39,
    hometown: "Windsor, Ontario",
    residence: "Toronto, Ontario",
    occupation: "Global events manager",
    tribe: "Tika",
    eliminated: false,
    image: "Jeremiah Ing.png",
    points: 0,
    episodes: 1
  },
  {
    id: 6,
    name: "Kimberly \"Annie\" Davis",
    age: 49,
    hometown: "Portland, Ore.",
    residence: "Austin, Texas",
    occupation: "Musician",
    tribe: "Soka",
    eliminated: false,
    image: "Kimberly Annie Davis.png",
    points: 0,
    episodes: 1
  },
  {
    id: 7,
    name: "Kristina Mills",
    age: 36,
    hometown: "Houston, Texas",
    residence: "Edmond, Okla.",
    occupation: "MBA career coach",
    tribe: "Ratu",
    eliminated: false,
    image: "Kristina Mills.png",
    points: 0,
    episodes: 1
  },
  {
    id: 8,
    name: "Matt Williams",
    age: 52,
    hometown: "Farmington, Utah",
    residence: "St. George, Utah",
    occupation: "Airport ramp agent",
    tribe: "Tika",
    eliminated: false,
    image: "Matt Williams.png",
    points: 0,
    episodes: 1
  },
  {
    id: 9,
    name: "Michelle \"MC\" Chukwujekwu",
    age: 29,
    hometown: "Sachse, Texas",
    residence: "San Diego, Calif.",
    occupation: "Fitness trainer",
    tribe: "Soka",
    eliminated: false,
    image: "Michelle Chukwujekwu.png",
    points: 0,
    episodes: 1
  },
  {
    id: 10,
    name: "Nate Moore",
    age: 47,
    hometown: "Clovis, Calif.",
    residence: "Hermosa Beach, Calif.",
    occupation: "Film producer",
    tribe: "Ratu",
    eliminated: false,
    image: "Nate Moore.png",
    points: 0,
    episodes: 1
  },
  {
    id: 11,
    name: "Nicole Mazullo",
    age: 26,
    hometown: "Long Island, N.Y.",
    residence: "Philadelphia, Pa.",
    occupation: "Financial crime consultant",
    tribe: "Tika",
    eliminated: false,
    image: "Nicole Mazullo.png",
    points: 0,
    episodes: 1
  },
  {
    id: 12,
    name: "Rizo Velovic",
    age: 25,
    hometown: "Yonkers, N.Y.",
    residence: "Yonkers, N.Y.",
    occupation: "Tech sales",
    tribe: "Soka",
    eliminated: false,
    image: "Rizo Velovic.png",
    points: 0,
    episodes: 1
  },
  {
    id: 13,
    name: "Sage Ahrens-Nichols",
    age: 30,
    hometown: "Roxboro, N.C.",
    residence: "Olympia, Wash.",
    occupation: "Clinical social worker",
    tribe: "Ratu",
    eliminated: false,
    image: "Sage Ahrens-Nichols.png",
    points: 0,
    episodes: 1
  },
  {
    id: 14,
    name: "Savannah Louie",
    age: 31,
    hometown: "Walnut Creek, Calif.",
    residence: "Atlanta, Ga.",
    occupation: "Former reporter",
    tribe: "Tika",
    eliminated: false,
    image: "Savannah Louie.png",
    points: 0,
    episodes: 1
  },
  {
    id: 15,
    name: "Shannon Fairweather",
    age: 28,
    hometown: "Wakefield, Mass.",
    residence: "Boston, Mass.",
    occupation: "Wellness specialist",
    tribe: "Soka",
    eliminated: false,
    image: "Shannon Fairweather.png",
    points: 0,
    episodes: 1
  },
  {
    id: 16,
    name: "Sophi Balerdi",
    age: 27,
    hometown: "Miami, Fla.",
    residence: "Miami, Fla.",
    occupation: "Entrepreneur",
    tribe: "Ratu",
    eliminated: false,
    image: "Sophi Balerdi.png",
    points: 0,
    episodes: 1
  },
  {
    id: 17,
    name: "Sophie Segreti",
    age: 31,
    hometown: "Darnestown, Md.",
    residence: "New York City, N.Y.",
    occupation: "Strategy associate",
    tribe: "Tika",
    eliminated: false,
    image: "Sophie Segreti.png",
    points: 0,
    episodes: 1
  },
  {
    id: 18,
    name: "Steven Ramm",
    age: 35,
    hometown: "Littleton, Colo.",
    residence: "Denver, Colo.",
    occupation: "Rocket scientist",
    tribe: "Soka",
    eliminated: false,
    image: "Steven Ramm.png",
    points: 0,
    episodes: 1
  }
];

// Helper functions
export const getContestantsByTribe = (tribe) => {
  return contestants.filter(contestant => contestant.tribe === tribe);
};

export const getActiveContestants = () => {
  return contestants.filter(contestant => !contestant.eliminated);
};

export const getEliminatedContestants = () => {
  return contestants.filter(contestant => contestant.eliminated);
};

export const getContestantById = (id) => {
  return contestants.find(contestant => contestant.id === id);
};
