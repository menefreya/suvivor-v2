// Test draft system
console.log("Testing draft picks calculation...");

// Simulate rankings
const testRankings = [
  { id: 1, name: "Alex Moore", rank: 1, eliminated: false },
  { id: 2, name: "Jake Latimer", rank: 2, eliminated: false }, 
  { id: 3, name: "Jason Treul", rank: 3, eliminated: false }
];

// Simulate picks calculation
const activeContestants = testRankings.filter(c => !c.eliminated);
const picks = activeContestants.slice(0, 2).map((contestant, index) => ({
  ...contestant,
  pickNumber: index + 1,
  assignedAt: new Date().toISOString()
}));

console.log("Test rankings:", testRankings);
console.log("Calculated picks:", picks);
console.log("Should show Alex Moore and Jake Latimer as picks 1 and 2");
